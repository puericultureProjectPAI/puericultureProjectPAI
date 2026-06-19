package com.puericulture.leasing.service;

import com.puericulture.common.entity.Person;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.config.errormanager.exception.UnauthorizedException;
import com.puericulture.leasing.dto.LeasingPackReservationRequestDto;
import com.puericulture.leasing.dto.LeasingPackReservationResponseDto;
import com.puericulture.leasing.dto.LeasingProfileDto;
import com.puericulture.leasing.dto.LeasingReservationRequestDto;
import com.puericulture.leasing.dto.LeasingReservationResponseDto;
import com.puericulture.leasing.entity.ClientProduct;
import com.puericulture.leasing.entity.LeasingArticle;
import com.puericulture.leasing.entity.LeasingOrder;
import com.puericulture.leasing.repository.ClientProductRepository;
import com.puericulture.leasing.repository.LeasingArticleRepository;
import com.puericulture.leasing.repository.LeasingOrderRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * STRATEGIC INTENT: Orchestrates the booking of leasing products. WHY THIS MATTERS: Validates lease
 * periods, prevents booking overlaps, calculates pricing dynamically, and saves the customer's
 * delivery address without DB migrations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LeasingBookingService {

    private final LeasingArticleRepository leasingArticleRepository;
    private final ClientProductRepository clientProductRepository;
    private final LeasingOrderRepository leasingOrderRepository;
    private final PersonRepository personRepository;
    private final LeasingPriceService leasingPriceService;

    @Transactional(readOnly = true)
    public LeasingProfileDto getLeasingProfile(String authenticatedPersonId) {
        log.info("Fetching leasing profile address for user {}", authenticatedPersonId);
        Person client = resolveAuthenticatedClient(authenticatedPersonId);

        List<LeasingOrder> orders =
                leasingOrderRepository.findOrdersByClientId(
                        client.getId(), org.springframework.data.domain.PageRequest.of(0, 1));
        if (!orders.isEmpty()) {
            LeasingOrder latest = orders.get(0);
            return LeasingProfileDto.builder()
                    .street(latest.getDeliveryStreet() != null ? latest.getDeliveryStreet() : "")
                    .zipCode(latest.getDeliveryZipCode() != null ? latest.getDeliveryZipCode() : "")
                    .city(latest.getDeliveryCity() != null ? latest.getDeliveryCity() : "")
                    .build();
        }

        String rawCity = client.getCity();
        String zipCode = "";
        String city = "";
        if (rawCity != null) {
            String[] parts = rawCity.split(";", 2);
            if (parts.length > 1) {
                zipCode = parts[0];
                city = parts[1];
            } else {
                city = parts[0];
            }
        }

        return LeasingProfileDto.builder()
                .street(client.getStreet() != null ? client.getStreet() : "")
                .zipCode(zipCode)
                .city(city)
                .build();
    }

    @Transactional
    public LeasingReservationResponseDto createReservation(
            LeasingReservationRequestDto dto, String authenticatedPersonId) {
        log.info(
                "Attempting to create a reservation for product {} by user {}",
                dto.getProductId(),
                authenticatedPersonId);

        Person client = resolveAuthenticatedClient(authenticatedPersonId);
        LeasingArticle article = findArticle(dto.getProductId());
        validateReservationDates(dto.getStartDate(), dto.getEndDate());
        ensureProductAvailable(dto.getProductId(), dto.getStartDate(), dto.getEndDate());

        long totalPrice =
                leasingPriceService.calculateTotalPrice(
                        article.getPricePerMonth(),
                        article.getPricePerDay(),
                        dto.getStartDate(),
                        dto.getEndDate());
        ReservationResult reservation =
                saveReservation(
                        article,
                        client.getId(),
                        dto.getStartDate(),
                        dto.getEndDate(),
                        dto.getDeliveryStreet(),
                        dto.getDeliveryZipCode(),
                        dto.getDeliveryCity());

        log.info(
                "Successfully reserved product {} for user {}. Reservation number: {}",
                dto.getProductId(),
                authenticatedPersonId,
                reservation.reservationNumber());

        return LeasingReservationResponseDto.builder()
                .reservationNumber(reservation.reservationNumber())
                .estimatedDeliveryDate(dto.getStartDate().minusDays(3))
                .productId(article.getId())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .totalPrice(totalPrice)
                .build();
    }

    @Transactional
    public LeasingPackReservationResponseDto createPackReservation(
            LeasingPackReservationRequestDto dto, String authenticatedPersonId) {
        Person client = resolveAuthenticatedClient(authenticatedPersonId);
        validateReservationDates(dto.getStartDate(), dto.getEndDate());

        Set<Long> uniqueProductIds = new LinkedHashSet<>(dto.getProductIds());
        if (uniqueProductIds.size() != dto.getProductIds().size()) {
            throw new BadRequestException("Un pack ne peut pas contenir deux fois le même article");
        }

        List<LeasingArticle> articles = new ArrayList<>();
        for (Long productId : uniqueProductIds) {
            LeasingArticle article = findArticle(productId);
            ensureProductAvailable(productId, dto.getStartDate(), dto.getEndDate());
            articles.add(article);
        }

        List<String> reservationNumbers = new ArrayList<>();
        List<LeasingPackReservationResponseDto.ReservedProduct> reservedProducts =
                new ArrayList<>();
        long totalPrice = 0L;

        for (LeasingArticle article : articles) {
            ReservationResult reservation =
                    saveReservation(
                            article,
                            client.getId(),
                            dto.getStartDate(),
                            dto.getEndDate(),
                            dto.getDeliveryStreet(),
                            dto.getDeliveryZipCode(),
                            dto.getDeliveryCity());
            reservationNumbers.add(reservation.reservationNumber());
            reservedProducts.add(
                    LeasingPackReservationResponseDto.ReservedProduct.builder()
                            .productId(article.getId())
                            .postTitle(article.getPostTitle())
                            .reservationNumber(reservation.reservationNumber())
                            .build());
            totalPrice +=
                    leasingPriceService.calculateTotalPrice(
                            article.getPricePerMonth(),
                            article.getPricePerDay(),
                            dto.getStartDate(),
                            dto.getEndDate());
        }

        return LeasingPackReservationResponseDto.builder()
                .reservationNumbers(reservationNumbers)
                .products(reservedProducts)
                .estimatedDeliveryDate(dto.getStartDate().minusDays(3))
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .totalPrice(totalPrice)
                .build();
    }

    private Person resolveAuthenticatedClient(String authenticatedPersonId) {
        if (authenticatedPersonId == null) {
            throw new UnauthorizedException("You must be authenticated to perform this action");
        }

        UUID userUuid;
        try {
            userUuid = UUID.fromString(authenticatedPersonId);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid user UUID format");
        }

        return personRepository
                .findById(userUuid)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }

    private LeasingArticle findArticle(Long productId) {
        return leasingArticleRepository
                .findById(productId)
                .orElseThrow(
                        () ->
                                new NotFoundException(
                                        "Article leasing introuvable avec l'id : " + productId));
    }

    private void validateReservationDates(LocalDate startDate, LocalDate endDate) {
        LocalDate minimumStartDate = LocalDate.now().plusDays(3);
        if (startDate.isBefore(minimumStartDate)) {
            throw new BadRequestException(
                    "La date de début doit être au moins 3 jours après aujourd'hui.");
        }
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException(
                    "La date de début doit être antérieure ou égale à la date de fin");
        }
    }

    private void ensureProductAvailable(Long productId, LocalDate startDate, LocalDate endDate) {
        long overlapsCount =
                leasingOrderRepository.countOverlappingOrders(productId, startDate, endDate);
        if (overlapsCount > 0) {
            throw new BadRequestException(
                    "L'article n'est pas disponible pour les dates sélectionnées");
        }
    }

    private ReservationResult saveReservation(
            LeasingArticle article,
            UUID clientId,
            LocalDate startDate,
            LocalDate endDate,
            String deliveryStreet,
            String deliveryZipCode,
            String deliveryCity) {
        ClientProduct clientProduct =
                ClientProduct.builder()
                        .productId(article.getId())
                        .clientId(clientId)
                        .orderId(0L)
                        .build();
        clientProduct = clientProductRepository.save(clientProduct);
        clientProduct.setOrderId(clientProduct.getId());
        clientProduct = clientProductRepository.save(clientProduct);

        LeasingOrder leasingOrder =
                LeasingOrder.builder()
                        .clientProductId(clientProduct.getId())
                        .startDate(startDate)
                        .endDate(endDate)
                        .deliveryStreet(deliveryStreet.trim())
                        .deliveryZipCode(deliveryZipCode.trim())
                        .deliveryCity(deliveryCity.trim())
                        .build();
        leasingOrderRepository.save(leasingOrder);

        return new ReservationResult(clientProduct.getId(), "RES-" + clientProduct.getId());
    }

    private record ReservationResult(Long clientProductId, String reservationNumber) {}
}

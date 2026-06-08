package com.puericulture.leasing.service;

import com.puericulture.common.entity.Person;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.config.errormanager.exception.UnauthorizedException;
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
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * STRATEGIC INTENT: Orchestrates the booking of a leasing product. WHY THIS MATTERS: Validates
 * lease periods, prevents booking overlaps, calculates pricing dynamically, and saves the
 * customer's delivery address to their profile without DB migrations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LeasingBookingService {

    private final LeasingArticleRepository leasingArticleRepository;
    private final ClientProductRepository clientProductRepository;
    private final LeasingOrderRepository leasingOrderRepository;
    private final PersonRepository personRepository;

    @Transactional(readOnly = true)
    public LeasingProfileDto getLeasingProfile(String authenticatedPersonId) {
        log.info("Fetching leasing profile address for user {}", authenticatedPersonId);
        if (authenticatedPersonId == null) {
            throw new UnauthorizedException("You must be authenticated to perform this action");
        }
        UUID userUuid;
        try {
            userUuid = UUID.fromString(authenticatedPersonId);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid user UUID format");
        }
        Person client =
                personRepository
                        .findById(userUuid)
                        .orElseThrow(() -> new UnauthorizedException("User not found"));

        // Try to get address from the latest LeasingOrder
        List<LeasingOrder> orders =
                leasingOrderRepository.findOrdersByClientId(
                        userUuid, org.springframework.data.domain.PageRequest.of(0, 1));
        if (!orders.isEmpty()) {
            LeasingOrder latest = orders.get(0);
            return LeasingProfileDto.builder()
                    .street(latest.getDeliveryStreet() != null ? latest.getDeliveryStreet() : "")
                    .zipCode(latest.getDeliveryZipCode() != null ? latest.getDeliveryZipCode() : "")
                    .city(latest.getDeliveryCity() != null ? latest.getDeliveryCity() : "")
                    .build();
        }

        // Fallback to Person address if no leasing order exists
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

        if (authenticatedPersonId == null) {
            throw new UnauthorizedException("You must be authenticated to perform this action");
        }

        // 1. Fetch user (client)
        UUID userUuid;
        try {
            userUuid = UUID.fromString(authenticatedPersonId);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid user UUID format");
        }
        Person client =
                personRepository
                        .findById(userUuid)
                        .orElseThrow(() -> new UnauthorizedException("User not found"));

        // 2. Fetch product (article)
        LeasingArticle article =
                leasingArticleRepository
                        .findById(dto.getProductId())
                        .orElseThrow(
                                () ->
                                        new NotFoundException(
                                                "Article leasing introuvable avec l'id : "
                                                        + dto.getProductId()));

        // 3. Validate dates
        LocalDate minimumStartDate = LocalDate.now().plusDays(3);
        if (dto.getStartDate().isBefore(minimumStartDate)) {
            throw new BadRequestException(
                    "La date de début doit être au moins 3 jours après aujourd'hui.");
        }
        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new BadRequestException(
                    "La date de début doit être antérieure ou égale à la date de fin");
        }

        // 4. Check overlapping bookings
        long overlapsCount =
                leasingOrderRepository.countOverlappingOrders(
                        dto.getProductId(), dto.getStartDate(), dto.getEndDate());
        if (overlapsCount > 0) {
            throw new BadRequestException(
                    "L'article n'est pas disponible pour les dates sélectionnées");
        }

        // 5. Calculate total price
        long days = ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;
        long pricePerMonth = article.getPricePerMonth() != null ? article.getPricePerMonth() : 0L;
        long pricePerDay = article.getPricePerDay() != null ? article.getPricePerDay() : 0L;

        long months = days / 30;
        long remainingDays = days % 30;
        long totalPrice = (months * pricePerMonth) + (remainingDays * pricePerDay);

        // 6. Save ClientProduct
        // TECHNICAL EXPLANATION: The database table 'client_products' defines the 'order_id' column
        // as 'NOT NULL'. Since the primary key 'id' of 'client_products' is automatically generated
        // (GenerationType.IDENTITY) upon insertion, and the 'leasing_orders' table links back to
        // this
        // generated id (meaning we cannot insert into 'leasing_orders' first), we must perform a
        // two-step insert. First, we persist 'ClientProduct' with a dummy 'orderId' (0) to satisfy
        // the
        // database-level 'NOT NULL' constraint. Then, once the primary key is generated, we update
        // 'orderId' to match the generated id (which is our order's id) and perform a second save.
        ClientProduct clientProduct =
                ClientProduct.builder()
                        .productId(article.getId())
                        .clientId(userUuid)
                        .orderId(
                                0L) // Temporary dummy value to satisfy database NOT NULL constraint
                        .build();
        clientProduct = clientProductRepository.save(clientProduct);
        clientProduct.setOrderId(clientProduct.getId());
        clientProduct = clientProductRepository.save(clientProduct);

        // 7. Save LeasingOrder with delivery address
        LeasingOrder leasingOrder =
                LeasingOrder.builder()
                        .clientProductId(clientProduct.getId())
                        .startDate(dto.getStartDate())
                        .endDate(dto.getEndDate())
                        .deliveryStreet(dto.getDeliveryStreet().trim())
                        .deliveryZipCode(dto.getDeliveryZipCode().trim())
                        .deliveryCity(dto.getDeliveryCity().trim())
                        .build();
        leasingOrderRepository.save(leasingOrder);

        log.info(
                "Successfully reserved product {} for user {}. Reservation number: RES-{}",
                dto.getProductId(),
                authenticatedPersonId,
                clientProduct.getId());

        // 8. Construct and return response DTO
        return LeasingReservationResponseDto.builder()
                .reservationNumber("RES-" + clientProduct.getId())
                .estimatedDeliveryDate(dto.getStartDate().minusDays(3))
                .productId(article.getId())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .totalPrice(totalPrice)
                .build();
    }
}

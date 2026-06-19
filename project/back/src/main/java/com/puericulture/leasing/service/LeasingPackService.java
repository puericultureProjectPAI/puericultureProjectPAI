package com.puericulture.leasing.service;

import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.ProductCategory;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.config.errormanager.exception.UnauthorizedException;
import com.puericulture.forwardtrading.entity.ChildrenEntity;
import com.puericulture.leasing.dto.LeasingPackDto;
import com.puericulture.leasing.dto.LeasingProductSummaryDto;
import com.puericulture.leasing.mapper.LeasingProductMapper;
import com.puericulture.leasing.repository.LeasingProductRepository;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeasingPackService {

    private final LeasingProductRepository leasingProductRepository;
    private final LeasingProductMapper leasingProductMapper;
    private final PersonRepository personRepository;
    private final LeasingPriceService leasingPriceService;

    public LeasingPackDto generateArrivalPack(
            String city,
            LocalDate startDate,
            LocalDate endDate,
            boolean carNeeded,
            String childFirstName) {

        Person person = getAuthenticatedPerson();
        ChildrenEntity child = selectChild(person, childFirstName);
        int ageInMonths = calculateChildAgeInMonths(child, startDate);

        // 3. Determine required products
        long durationDays = leasingPriceService.calculateDurationDays(startDate, endDate);

        // LinkedHashSet déduplique TRANSPORT_BEBE quand poussette + siège auto sont tous les deux
        // demandés
        Set<String> categories = new LinkedHashSet<>();

        if (ageInMonths < 6) {
            categories.add(ProductCategory.SOMMEIL_LITERIE.name());
            if (carNeeded) {
                categories.add(ProductCategory.TRANSPORT_BEBE.name());
            }
        } else if (ageInMonths <= 14) {
            categories.add(ProductCategory.TRANSPORT_BEBE.name());
            categories.add(ProductCategory.SOMMEIL_LITERIE.name());
            if (carNeeded) {
                categories.add(ProductCategory.TRANSPORT_BEBE.name()); // dédupliqué par le Set
            }
        } else {
            categories.add(ProductCategory.TRANSPORT_BEBE.name());
            if (durationDays > 2) {
                categories.add(ProductCategory.SOMMEIL_LITERIE.name());
            }
            if (carNeeded) {
                categories.add(ProductCategory.TRANSPORT_BEBE.name()); // dédupliqué par le Set
            }
        }

        // 4. Fetch available products
        List<LeasingProductSummaryDto> packProducts = new ArrayList<>();
        long totalPrice = 0L;

        for (String category : categories) {
            leasingProductRepository
                    .findAvailableProductByCategoryAndCity(
                            category, city, startDate, endDate, ageInMonths)
                    .ifPresent(
                            summary -> {
                                LeasingProductSummaryDto dto = leasingProductMapper.toDto(summary);
                                packProducts.add(dto);
                            });
        }

        // Calculate total price based on fetched products
        for (LeasingProductSummaryDto product : packProducts) {
            totalPrice +=
                    leasingPriceService.calculateTotalPrice(
                            product.getPricePerMonth(), product.getPricePerDay(), durationDays);
        }

        return LeasingPackDto.builder()
                .products(packProducts)
                .totalPrice(totalPrice)
                .childAgeMonths(ageInMonths)
                .build();
    }

    public List<LeasingProductSummaryDto> findEligibleProducts(
            String city, LocalDate startDate, LocalDate endDate, String childFirstName) {
        Person person = getAuthenticatedPerson();
        ChildrenEntity child = selectChild(person, childFirstName);
        int ageInMonths = calculateChildAgeInMonths(child, startDate);

        return leasingProductRepository
                .findEligibleProductsByCityAndAge(city, startDate, endDate, ageInMonths)
                .stream()
                .map(leasingProductMapper::toDto)
                .toList();
    }

    private Person getAuthenticatedPerson() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof String)) {
            throw new UnauthorizedException("User must be authenticated to generate a pack");
        }
        UUID personId = UUID.fromString((String) principal);
        return personRepository
                .findById(personId)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private ChildrenEntity selectChild(Person person, String childFirstName) {
        List<ChildrenEntity> children = person.getChildren();
        if (children == null || children.isEmpty()) {
            throw new NotFoundException("User does not have any children in their profile");
        }

        if (childFirstName != null && !childFirstName.trim().isEmpty()) {
            return children.stream()
                    .filter(c -> childFirstName.equalsIgnoreCase(c.getName()))
                    .findFirst()
                    .orElseThrow(() -> new NotFoundException("Child not found for this user"));
        }

        return children.get(0);
    }

    private int calculateChildAgeInMonths(ChildrenEntity child, LocalDate referenceDate) {
        if (child.getBirthDate() == null) {
            throw new IllegalArgumentException("Child birthdate is not set");
        }

        LocalDate birthDate = child.getBirthDate().toLocalDate();
        Period period = Period.between(birthDate, referenceDate);
        return period.getYears() * 12 + period.getMonths();
    }
}

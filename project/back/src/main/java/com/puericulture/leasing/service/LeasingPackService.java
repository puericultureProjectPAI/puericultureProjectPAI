package com.puericulture.leasing.service;

import com.puericulture.common.entity.Person;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.forwardtrading.entity.ChildrenEntity;
import com.puericulture.leasing.dto.LeasingPackDto;
import com.puericulture.leasing.dto.LeasingProductSummaryDto;
import com.puericulture.leasing.mapper.LeasingProductMapper;
import com.puericulture.leasing.repository.LeasingProductRepository;
import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
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

    public LeasingPackDto generateArrivalPack(
            String city,
            LocalDate startDate,
            LocalDate endDate,
            boolean carNeeded,
            String childFirstName) {

        // 1. Get authenticated person
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof String)) {
            throw new IllegalArgumentException("User must be authenticated to generate a pack");
        }
        UUID personId = UUID.fromString((String) principal);
        Person person =
                personRepository
                        .findById(personId)
                        .orElseThrow(() -> new NotFoundException("User not found"));

        // 2. Calculate child age
        List<ChildrenEntity> children = person.getChildren();
        if (children == null || children.isEmpty()) {
            throw new NotFoundException("User does not have any children in their profile");
        }

        ChildrenEntity child = null;
        if (childFirstName != null && !childFirstName.trim().isEmpty()) {
            child =
                    children.stream()
                            .filter(c -> childFirstName.equalsIgnoreCase(c.getName()))
                            .findFirst()
                            .orElseThrow(
                                    () -> new NotFoundException("Child not found for this user"));
        } else {
            // Fallback: use first child
            child = children.get(0);
        }

        if (child.getBirthDate() == null) {
            throw new IllegalArgumentException("Child birthdate is not set");
        }

        LocalDate birthDate = child.getBirthDate().toLocalDate();
        int ageInMonths =
                Period.between(birthDate, LocalDate.now()).getYears() * 12
                        + Period.between(birthDate, LocalDate.now()).getMonths();

        // 3. Determine required products
        long durationDays = ChronoUnit.DAYS.between(startDate, endDate);
        if (durationDays <= 0) {
            durationDays = 1;
        }

        List<String> keywords = new ArrayList<>();

        if (ageInMonths < 6) {
            keywords.add("Nacelle");
            keywords.add("Lit parapluie");
            if (carNeeded) {
                keywords.add("Cosy");
            }
        } else if (ageInMonths <= 14) {
            keywords.add("Poussette légère");
            keywords.add("Lit parapluie");
            if (carNeeded) {
                keywords.add("Siège auto");
            }
        } else {
            keywords.add("Poussette canne");
            if (durationDays > 2) {
                keywords.add("Lit parapluie");
            }
            if (carNeeded) {
                keywords.add("Siège auto");
            }
        }

        // 4. Fetch available products
        List<LeasingProductSummaryDto> packProducts = new ArrayList<>();
        long totalPrice = 0L;

        for (String keyword : keywords) {
            leasingProductRepository
                    .findAvailableProductByKeywordAndCity(keyword, city, startDate, endDate)
                    .ifPresent(
                            summary -> {
                                LeasingProductSummaryDto dto = leasingProductMapper.toDto(summary);
                                packProducts.add(dto);
                            });
        }

        // Calculate total price based on fetched products
        for (LeasingProductSummaryDto product : packProducts) {
            if (product.getPricePerDay() != null) {
                totalPrice += product.getPricePerDay() * durationDays;
            }
        }

        return LeasingPackDto.builder()
                .products(packProducts)
                .totalPrice(totalPrice)
                .childAgeMonths(ageInMonths)
                .build();
    }
}

package com.puericulture.leasing.service;

import com.puericulture.leasing.dto.LeasingFilterRequest;
import com.puericulture.leasing.dto.LeasingProductSummaryDto;
import com.puericulture.leasing.exception.InvalidFilterCriteriaException;
import com.puericulture.leasing.mapper.LeasingProductMapper;
import com.puericulture.leasing.repository.LeasingProductRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeasingProductService {

    private final LeasingProductRepository leasingProductRepository;
    private final LeasingProductMapper leasingProductMapper;

    @Transactional(readOnly = true)
    public List<LeasingProductSummaryDto> findAll() {
        return leasingProductRepository.findAllWithAvailability().stream()
                .map(leasingProductMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LeasingProductSummaryDto> filter(LeasingFilterRequest request) {
        String city = request.getCity();
        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();

        boolean hasCity = city != null && !city.isBlank();
        boolean hasDates = startDate != null && endDate != null;

        if (!hasCity && !hasDates) {
            throw new InvalidFilterCriteriaException(
                    "Au moins un critère de filtrage doit être fourni (ville et/ou dates)");
        }
        if (startDate != null && startDate.isBefore(LocalDate.now())) {
            throw new InvalidFilterCriteriaException(
                    "La date de début ne peut pas être dans le passé");
        }
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new InvalidFilterCriteriaException(
                    "La date de fin doit être après la date de début");
        }

        if (hasCity && hasDates) {
            log.debug("Filtre: VILLE + DATES");
            return leasingProductRepository
                    .findByCityAndAvailableByDateRange(city, startDate, endDate)
                    .stream()
                    .map(leasingProductMapper::toDto)
                    .toList();
        }
        if (hasCity) {
            log.debug("Filtre: VILLE SEULEMENT");
            return leasingProductRepository.findByCityWithAvailability(city).stream()
                    .map(leasingProductMapper::toDto)
                    .toList();
        }
        log.debug("Filtre: DATES SEULEMENT");
        return leasingProductRepository.findAvailableByDateRange(startDate, endDate).stream()
                .map(leasingProductMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<String> getAvailableCities() {
        return leasingProductRepository.findAllAvailableCities();
    }
}

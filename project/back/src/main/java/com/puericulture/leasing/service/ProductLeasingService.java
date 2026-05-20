package com.puericulture.leasing.service;

import com.puericulture.leasing.dto.LeasingFilterRequest;
import com.puericulture.leasing.dto.ProductLeasingResponse;
import com.puericulture.leasing.entity.ProductLeasing;
import com.puericulture.leasing.exception.InvalidFilterCriteriaException;
import com.puericulture.leasing.mapper.ProductLeasingMapper;
import com.puericulture.leasing.repository.ProductLeasingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProductLeasingService {

    @Autowired
    private ProductLeasingRepository productLeasingRepository;

    @Autowired
    private ProductLeasingMapper productLeasingMapper;

    public List<ProductLeasingResponse> findAll() {
        log.info("Récupération de tous les produits en location");
        return productLeasingRepository.findAllWithLeasing()
                .stream()
                .map(productLeasingMapper::toProductLeasingResponse)
                .collect(Collectors.toList());
    }

    /**
     * Filtre les produits selon les critères fournis (au moins UN obligatoire).
     * Pour les filtres avec dates, la disponibilité est vérifiée via leasing_orders :
     * un produit est disponible si aucune commande existante ne chevauche la période demandée.
     *
     * @throws InvalidFilterCriteriaException si aucun critère ou dates invalides
     */
    public List<ProductLeasingResponse> filter(LeasingFilterRequest filterRequest) {
        if (!filterRequest.hasAnyCriteria()) {
            log.warn("Tentative de filtrage sans critère");
            throw new InvalidFilterCriteriaException(
                    "Au moins un critère de filtrage doit être fourni (ville et/ou dates)");
        }

        if (!filterRequest.isStartDateInFuture()) {
            log.warn("Date de début dans le passé: {}", filterRequest.getStartDate());
            throw new InvalidFilterCriteriaException(
                    "La date de début ne peut pas être dans le passé");
        }

        if (!filterRequest.isValidDateRange()) {
            log.warn("Dates invalides: endDate < startDate");
            throw new InvalidFilterCriteriaException(
                    "La date de fin doit être après la date de début");
        }

        String city = filterRequest.getCity();
        LocalDate startDate = filterRequest.getStartDate();
        LocalDate endDate = filterRequest.getEndDate();

        if (city != null && !city.isBlank() && startDate != null && endDate != null) {
            log.debug("Filtre: VILLE + DATES (disponibilité)");
            return findAvailableByIds(
                    productLeasingRepository.findAvailableIdsByCityAndDateRange(city, startDate, endDate));
        }

        if (city != null && !city.isBlank()) {
            log.debug("Filtre: VILLE SEULEMENT");
            return productLeasingRepository.findByCity(city)
                    .stream()
                    .map(productLeasingMapper::toProductLeasingResponse)
                    .collect(Collectors.toList());
        }

        if (startDate != null && endDate != null) {
            log.debug("Filtre: DATES SEULEMENT (disponibilité)");
            return findAvailableByIds(
                    productLeasingRepository.findAvailableIdsByDateRange(startDate, endDate));
        }

        throw new InvalidFilterCriteriaException("Critères de filtrage invalides");
    }

    public List<String> getAvailableCities() {
        return productLeasingRepository.findAllAvailableCities();
    }

    private List<ProductLeasingResponse> findAvailableByIds(List<Long> ids) {
        if (ids.isEmpty()) {
            return List.of();
        }
        return productLeasingRepository.findAllById(ids)
                .stream()
                .sorted(Comparator.comparing(ProductLeasing::getPricePerDay))
                .map(productLeasingMapper::toProductLeasingResponse)
                .collect(Collectors.toList());
    }
}

package com.puericulture.leasing.service;


import com.puericulture.leasing.dto.LeasingFilterRequest;
import com.puericulture.leasing.dto.ProductLeasingResponse;
import com.puericulture.leasing.exception.InvalidFilterCriteriaException;
import com.puericulture.leasing.mapper.ProductLeasingMapper;
import com.puericulture.leasing.repository.ProductLeasingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service pour le filtrage des produits en location
 * Supporte filtrage flexible: ville seule, dates seules, ville+dates
 * Au moins UN critère obligatoire
 */
@Service
@Slf4j
public class ProductLeasingService {

    @Autowired
    private ProductLeasingRepository productLeasingRepository;

    @Autowired
    private ProductLeasingMapper productLeasingMapper;

    /**
     * Récupère TOUS les produits en location
     */
    public List<ProductLeasingResponse> findAll() {
        log.info("Récupération de tous les produits en location");

        return productLeasingRepository.findAllWithLeasing()
                .stream()
                .map(productLeasingMapper::toProductLeasingResponse)
                .collect(Collectors.toList());
    }

    /**
     * Filtre les produits selon les critères (au moins UN obligatoire)
     *
     * Cas supportés:
     * - Ville seulement
     * - Dates seulement
     * - Ville + Dates
     *
     * @param filterRequest critères (au moins un doit être fourni)
     * @return liste des produits filtrés
     * @throws InvalidFilterCriteriaException si aucun critère ou dates invalides
     */
    public List<ProductLeasingResponse> filter(LeasingFilterRequest filterRequest) {

        // Vérifier qu'au moins un critère est fourni
        if (!filterRequest.hasAnyCriteria()) {
            log.warn("Tentative de filtrage sans critère");
            throw new InvalidFilterCriteriaException(
                    "Au moins un critère de filtrage doit être fourni (ville et/ou dates)"
            );
        }

        // Valider la plage de dates
        if (!filterRequest.isValidDateRange()) {
            log.warn("Dates invalides: endDate < startDate");
            throw new InvalidFilterCriteriaException(
                    "La date de fin doit être après la date de début"
            );
        }

        String city = filterRequest.getCity();
        LocalDate startDate = filterRequest.getStartDate();
        LocalDate endDate = filterRequest.getEndDate();



        // Cas 1: Ville + Dates
        if (city != null && !city.isBlank() && startDate != null && endDate != null) {
            log.debug("Filtre: VILLE + DATES");
            return productLeasingRepository.findByLocationAndDates(city, startDate, endDate)
                    .stream()
                    .map(productLeasingMapper::toProductLeasingResponse)
                    .collect(Collectors.toList());
        }

        // Cas 2: Ville seulement
        if (city != null && !city.isBlank()) {
            log.debug("Filtre: VILLE SEULEMENT");
            return productLeasingRepository.findByCity(city)
                    .stream()
                    .map(productLeasingMapper::toProductLeasingResponse)
                    .collect(Collectors.toList());
        }

        // Cas 3: Dates seulement
        if (startDate != null && endDate != null) {
            log.debug("Filtre: DATES SEULEMENT");
            return productLeasingRepository.findByDateRange(startDate, endDate)
                    .stream()
                    .map(productLeasingMapper::toProductLeasingResponse)
                    .collect(Collectors.toList());
        }

        // Cela ne devrait jamais arriver (hasAnyCriteria() aurait déjà rejeté)
        throw new InvalidFilterCriteriaException(
                "Critères de filtrage invalides"
        );
    }

    /**
     * Récupère toutes les villes disponibles
     */
    public List<String> getAvailableCities() {
        return productLeasingRepository.findAllAvailableCities();
    }
}


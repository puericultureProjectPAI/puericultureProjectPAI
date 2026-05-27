package com.puericulture.leasing.service;

import com.puericulture.leasing.dto.LeasingFilterRequest;
import com.puericulture.leasing.dto.ProductLeasingResponse;
import com.puericulture.leasing.entity.LeasingArticle;
import com.puericulture.leasing.exception.InvalidFilterCriteriaException;
import com.puericulture.leasing.mapper.ProductLeasingMapper;
import com.puericulture.leasing.repository.ProductLeasingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductLeasingService {

    private final ProductLeasingRepository productLeasingRepository;
    private final ProductLeasingMapper productLeasingMapper;

    @Transactional(readOnly = true)
    public List<ProductLeasingResponse> findAll() {
        List<ProductLeasingResponse> results = productLeasingRepository.findAllWithLeasing()
                .stream()
                .map(productLeasingMapper::toProductLeasingResponse)
                .toList();
        log.info("{} produits retournés", results.size());
        return results;
    }

    /**
     * Filtre les produits selon les critères fournis (au moins UN obligatoire).
     * Pour les filtres avec dates, la disponibilité est vérifiée via leasing_orders :
     * un produit est disponible si aucune commande existante ne chevauche la période demandée.
     *
     * @throws InvalidFilterCriteriaException si aucun critère ou dates invalides
     */
    @Transactional(readOnly = true)
    public List<ProductLeasingResponse> filter(LeasingFilterRequest filterRequest) {
        String city = filterRequest.getCity();
        LocalDate startDate = filterRequest.getStartDate();
        LocalDate endDate = filterRequest.getEndDate();

        boolean hasCity = city != null && !city.isBlank();
        boolean hasDates = startDate != null && endDate != null;

        if (!hasCity && !hasDates) {
            log.warn("Tentative de filtrage sans critère");
            throw new InvalidFilterCriteriaException(
                    "Au moins un critère de filtrage doit être fourni (ville et/ou dates)");
        }

        if (startDate != null && startDate.isBefore(LocalDate.now())) {
            log.warn("Date de début dans le passé: {}", startDate);
            throw new InvalidFilterCriteriaException(
                    "La date de début ne peut pas être dans le passé");
        }

        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            log.warn("Dates invalides: endDate < startDate");
            throw new InvalidFilterCriteriaException(
                    "La date de fin doit être après la date de début");
        }

        if (hasCity && hasDates) {
            log.debug("Filtre: VILLE + DATES (disponibilité)");
            List<ProductLeasingResponse> results = findAvailableByIds(
                    productLeasingRepository.findAvailableIdsByCityAndDateRange(city, startDate, endDate));
            log.info("Filtrage effectué: {} produits trouvés", results.size());
            return results;
        }

        if (hasCity) {
            log.debug("Filtre: VILLE SEULEMENT");
            List<ProductLeasingResponse> results = productLeasingRepository.findByCity(city)
                    .stream()
                    .map(productLeasingMapper::toProductLeasingResponse)
                    .toList();
            log.info("Filtrage effectué: {} produits trouvés", results.size());
            return results;
        }

        log.debug("Filtre: DATES SEULEMENT (disponibilité)");
        List<ProductLeasingResponse> results = findAvailableByIds(
                productLeasingRepository.findAvailableIdsByDateRange(startDate, endDate));
        log.info("Filtrage effectué: {} produits trouvés", results.size());
        return results;
    }

    @Transactional(readOnly = true)
    public List<String> getAvailableCities() {
        return productLeasingRepository.findAllAvailableCities();
    }

    private List<ProductLeasingResponse> findAvailableByIds(List<Long> ids) {
        if (ids.isEmpty()) {
            return List.of();
        }
        return productLeasingRepository.findAllById(ids)
                .stream()
                .sorted(Comparator.comparing(LeasingArticle::getPricePerDay))
                .map(productLeasingMapper::toProductLeasingResponse)
                .toList();
    }
}

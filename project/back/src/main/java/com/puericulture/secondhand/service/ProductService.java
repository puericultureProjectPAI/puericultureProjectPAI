package com.puericulture.secondhand.service;

import com.puericulture.secondhand.dto.PriceComparisonDTO;
import com.puericulture.secondhand.dto.ProductResponseDTO;
import com.puericulture.secondhand.entity.SecondHandProduct;
import com.puericulture.secondhand.repository.ListingRepository;
import com.puericulture.secondhand.repository.SecondHandProductRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ListingRepository listingRepository;
    private final SecondHandProductRepository secondHandProductRepository;

    public ProductService(
            ListingRepository listingRepository,
            SecondHandProductRepository secondHandProductRepository) {
        this.listingRepository = listingRepository;
        this.secondHandProductRepository = secondHandProductRepository;
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO getProduct(String ean) {
        // Données de test en dur — à remplacer quand la librairie externe sera intégrée
        if ("3614273111683".equals(ean)) {
            return new ProductResponseDTO(
                    "prod-001", "Poussette Yoyo² 6+", "Babyzen", "POUSSETTE", null, 899.0);
        }
        Optional<SecondHandProduct> product = secondHandProductRepository.findByEan(ean);
        if (product.isEmpty()) return null;
        SecondHandProduct p = product.get();
        return new ProductResponseDTO(
                p.getId().toString(),
                p.getModel(),
                p.getBrand(),
                p.getCategory(),
                null,
                p.getNewPrice());
    }

    @Transactional(readOnly = true)
    public PriceComparisonDTO getPriceComparison(String category, Double newPrice) {

        // Données de test en dur
        if ("POUSSETTE".equals(category)) {
            Double averageOccasionPrice = 449.67;
            Long count = 5L;
            Double savingsAmount =
                    newPrice != null
                            ? Math.round((newPrice - averageOccasionPrice) * 100.0) / 100.0
                            : null;
            Double savingsPercent =
                    newPrice != null
                            ? Math.round((savingsAmount / newPrice) * 1000.0) / 10.0
                            : null;
            return new PriceComparisonDTO(
                    category, averageOccasionPrice, count, savingsAmount, savingsPercent, false);
        }

        Long count = listingRepository.countActiveListingsByCategory(category);
        if (count == 0) return new PriceComparisonDTO(category);

        Double rawAverage = listingRepository.findAveragePriceByCategory(category);
        Double averageOccasionPrice = Math.round(rawAverage * 100.0) / 100.0;

        Double savingsAmount = null;
        Double savingsPercent = null;
        if (newPrice != null) {
            savingsAmount = Math.round((newPrice - averageOccasionPrice) * 100.0) / 100.0;
            savingsPercent = Math.round((savingsAmount / newPrice) * 1000.0) / 10.0;
        }

        boolean lowSampleWarning = count < 3;

        return new PriceComparisonDTO(
                category,
                averageOccasionPrice,
                count,
                savingsAmount,
                savingsPercent,
                lowSampleWarning);
    }
}

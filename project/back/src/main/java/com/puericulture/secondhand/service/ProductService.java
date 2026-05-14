package com.puericulture.secondhand.service;

import com.puericulture.secondhand.dto.ExternalProductDTO;
import com.puericulture.secondhand.dto.PriceComparisonDTO;
import com.puericulture.secondhand.dto.ProductResponseDTO;
import com.puericulture.secondhand.entity.ExternalProduct;
import com.puericulture.secondhand.entity.SecondHandProduct;
import com.puericulture.secondhand.repository.ExternalProductRepository;
import com.puericulture.secondhand.repository.SecondHandProductRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final SecondHandProductRepository secondHandProductRepository;
    private final ExternalProductRepository externalProductRepository;

    public ProductService(
            SecondHandProductRepository secondHandProductRepository,
            ExternalProductRepository externalProductRepository) {
        this.secondHandProductRepository = secondHandProductRepository;
        this.externalProductRepository = externalProductRepository;
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO getProduct(String ean) {

        Optional<ExternalProduct> external = externalProductRepository.findByEan(ean);
        if (external.isPresent()) {
            ExternalProduct p = external.get();
            return new ProductResponseDTO(
                    p.getId().toString(),
                    p.getName(),
                    p.getBrand(),
                    p.getCategory(),
                    p.getImageUrl(),
                    p.getNewPrice());
        }

        Optional<SecondHandProduct> secondHand = secondHandProductRepository.findByEan(ean);
        if (secondHand.isPresent()) {
            SecondHandProduct p = secondHand.get();
            return new ProductResponseDTO(
                    p.getId().toString(),
                    p.getModel(),
                    p.getBrand(),
                    p.getCategory(),
                    null,
                    p.getNewPrice());
        }

        return null;
    }

    @Transactional
    public ProductResponseDTO saveExternalProduct(ExternalProductDTO dto) {
        ExternalProduct product = new ExternalProduct();
        product.setEan(dto.getEan());
        product.setName(dto.getName());
        product.setBrand(dto.getBrand());
        product.setCategory(dto.getCategory());
        product.setImageUrl(dto.getImageUrl());
        product.setNewPrice(dto.getNewPrice());
        ExternalProduct saved = externalProductRepository.save(product);
        return new ProductResponseDTO(
                saved.getId().toString(),
                saved.getName(),
                saved.getBrand(),
                saved.getCategory(),
                saved.getImageUrl(),
                saved.getNewPrice());
    }

    @Transactional(readOnly = true)
    public PriceComparisonDTO getPriceComparison(String category, Double newPrice) {

        Long count = secondHandProductRepository.countActiveListingsByCategory(category);
        if (count == 0) return new PriceComparisonDTO(category);

        Double rawAverage = secondHandProductRepository.findAveragePriceByCategory(category);
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

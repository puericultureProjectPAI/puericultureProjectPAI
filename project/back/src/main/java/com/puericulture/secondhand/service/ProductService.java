package com.puericulture.secondhand.service;

import com.puericulture.common.entity.ProductCategory;
import com.puericulture.common.mapper.ExternalProductMapper;
import com.puericulture.secondhand.dto.ExternalProductDTO;
import com.puericulture.secondhand.dto.PriceComparisonDTO;
import com.puericulture.secondhand.dto.ProductResponseDTO;
import com.puericulture.secondhand.entity.ExternalProduct;
import com.puericulture.secondhand.repository.ExternalProductRepository;
import com.puericulture.secondhand.repository.SecondHandProductRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final SecondHandProductRepository secondHandProductRepository;
    private final ExternalProductRepository externalProductRepository;
    private final ExternalProductMapper externalProductMapper;

    public ProductService(
            SecondHandProductRepository secondHandProductRepository,
            ExternalProductRepository externalProductRepository,
            ExternalProductMapper externalProductMapper) {
        this.secondHandProductRepository = secondHandProductRepository;
        this.externalProductRepository = externalProductRepository;
        this.externalProductMapper = externalProductMapper;
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO getProduct(String ean) {
        Optional<ExternalProduct> external = externalProductRepository.findByEan(ean);
        if (external.isPresent()) {
            return externalProductMapper.toDto(external.get());
        }
        return null;
    }

    @Transactional
    public ProductResponseDTO saveExternalProduct(ExternalProductDTO dto) {
        ExternalProduct product = externalProductMapper.toEntity(dto);
        ExternalProduct saved = externalProductRepository.save(product);
        return externalProductMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public PriceComparisonDTO getPriceComparison(String category, Double price) {

        ProductCategory productCategory;
        try {
            productCategory = ProductCategory.fromLabel(category);
        } catch (Exception e) {
            PriceComparisonDTO dto = new PriceComparisonDTO();
            dto.setCategory(category);
            dto.setListingsCount(0L);
            return dto;
        }

        Long count = secondHandProductRepository.countActiveListingsByCategory(productCategory);
        if (count == 0) {
            PriceComparisonDTO dto = new PriceComparisonDTO();
            dto.setCategory(category);
            dto.setListingsCount(0L);
            return dto;
        }

        Double rawAverage = secondHandProductRepository.findAveragePriceByCategory(productCategory);
        Double averageOccasionPrice = Math.round(rawAverage * 100.0) / 100.0;

        Double savingsAmount = null;
        Double savingsPercent = null;
        if (price != null) {
            savingsAmount = Math.round((price - averageOccasionPrice) * 100.0) / 100.0;
            savingsPercent = Math.round((savingsAmount / price) * 1000.0) / 10.0;
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

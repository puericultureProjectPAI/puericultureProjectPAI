package com.puericulture.troc.mapper;

import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.ProductCategory;
import com.puericulture.troc.dto.TrocProductCreateRequest;
import com.puericulture.troc.dto.TrocProductDto;
import com.puericulture.troc.entity.TrocProduct;
import java.time.LocalDateTime;
import org.springframework.stereotype.Component;

@Component
public class TrocProductMapper {

    public TrocProductDto toDto(TrocProduct entity) {
        if (entity == null) return null;
        TrocProductDto dto = new TrocProductDto();
        dto.setId(entity.getId());
        dto.setPostTitle(entity.getPostTitle());
        dto.setPostDate(entity.getPostDate());
        dto.setCity(entity.getCity());
        dto.setDescription(entity.getDescription());
        dto.setCategory(entity.getCategory() != null ? entity.getCategory().name() : null);
        dto.setLastCheckDate(entity.getLastCheckDate());
        dto.setSecurityStandard(entity.getSecurityStandard());
        dto.setMaxWeightKg(entity.getMaxWeightKg());
        dto.setDimensions(entity.getDimensions());
        dto.setMinAgeMonths(entity.getMinAgeMonths());
        dto.setMaxAgeMonths(entity.getMaxAgeMonths());
        dto.setBrand(entity.getBrand());
        dto.setModel(entity.getModel());
        dto.setCondition(entity.getCondition());
        dto.setConfidenceScore(entity.getConfidenceScore());
        dto.setEstimatedPrice(entity.getEstimatedPrice());
        dto.setStatus(entity.getStatus());
        return dto;
    }

    public TrocProduct toEntity(TrocProductCreateRequest request, Person author) {
        TrocProduct entity = new TrocProduct();
        entity.setPostTitle(request.getPostTitle());
        entity.setDescription(request.getDescription());
        entity.setCity(request.getCity());
        entity.setCategory(ProductCategory.valueOf(request.getCategory()));
        entity.setPostDate(LocalDateTime.now());
        entity.setAuthor(author);
        entity.setEstimatedPrice(request.getEstimatedPrice());
        return entity;
    }
}

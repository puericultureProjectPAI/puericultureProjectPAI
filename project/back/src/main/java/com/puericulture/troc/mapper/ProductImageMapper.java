package com.puericulture.troc.mapper;

import com.puericulture.troc.dto.ProductImageDto;
import com.puericulture.troc.entity.ProductImage;
import org.springframework.stereotype.Component;

@Component
public class ProductImageMapper {

    public ProductImageDto toDto(ProductImage entity) {
        if (entity == null) return null;
        ProductImageDto dto = new ProductImageDto();
        dto.setId(entity.getId());
        dto.setProductId(entity.getProductId());
        dto.setImageUrl(entity.getImageUrl());
        dto.setPosition(entity.getPosition());
        return dto;
    }

    public ProductImage toEntity(ProductImageDto dto) {
        if (dto == null) return null;
        ProductImage entity = new ProductImage();
        entity.setId(dto.getId());
        entity.setProductId(dto.getProductId());
        entity.setImageUrl(dto.getImageUrl());
        entity.setPosition(dto.getPosition());
        return entity;
    }
}

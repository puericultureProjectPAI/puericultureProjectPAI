package com.puericulture.troc.mapper;

import com.puericulture.common.entity.ProductImage;
import com.puericulture.troc.dto.ProductImageDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductImageMapper {

    @Mapping(source = "product.id", target = "productId")
    ProductImageDto toDto(ProductImage entity);
}

package com.puericulture.common.mapper;

import com.puericulture.common.dto.ProductImageDto;
import com.puericulture.common.entity.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductImageMapper {

    @Mapping(source = "product.id", target = "productId")
    ProductImageDto toDto(ProductImage entity);
}

package com.puericulture.common.mapper;

import com.puericulture.secondhand.dto.ExternalProductDTO;
import com.puericulture.secondhand.dto.ProductResponseDTO;
import com.puericulture.secondhand.entity.ExternalProduct;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExternalProductMapper {

    @Mapping(target = "id", ignore = true)
    ExternalProduct toEntity(ExternalProductDTO dto);

    @Mapping(target = "id", expression = "java(product.getId().toString())")
    ProductResponseDTO toDto(ExternalProduct product);
}

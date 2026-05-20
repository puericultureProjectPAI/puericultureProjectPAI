package com.puericulture.troc.mapper;

import com.puericulture.common.mapper.PersonMapper;
import com.puericulture.common.mapper.ProductCategoryMapper;
import com.puericulture.troc.dto.ProductTrocDto;
import com.puericulture.troc.entity.ProductTroc;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {PersonMapper.class, ProductCategoryMapper.class})
public interface ProductTrocMapper {

    @Mapping(target = "category", source = "category", qualifiedByName = "toLabel")
    ProductTrocDto toDto(ProductTroc productTroc);

    @Mapping(target = "category", source = "category", qualifiedByName = "fromLabel")
    ProductTroc toEntity(ProductTrocDto productTrocDto);
}

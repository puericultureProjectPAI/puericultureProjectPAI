package com.puericulture.troc.mapper;

import com.puericulture.common.mapper.PersonMapper;
import com.puericulture.troc.dto.ProductTrocDto;
import com.puericulture.troc.entity.ProductTroc;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = PersonMapper.class)
public interface ProductTrocMapper {

    ProductTrocDto toDto(ProductTroc productTroc);

    ProductTroc toEntity(ProductTrocDto productTrocDto);
}

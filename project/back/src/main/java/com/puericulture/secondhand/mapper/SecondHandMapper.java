package com.puericulture.secondhand.mapper;

import com.puericulture.common.mapper.ProductCategoryMapper;
import com.puericulture.secondhand.dto.SecondHandDto;
import com.puericulture.secondhand.entity.SecondHand;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = ProductCategoryMapper.class)
public interface SecondHandMapper {

    @Mapping(source = "category", target = "category", qualifiedByName = "toLabel")
    @Mapping(source = "author.id", target = "authorId")
    @Mapping(source = "id", target = "productId")
    @Mapping(source = "postTitle", target = "title")
    @Mapping(source = "city", target = "city")
    SecondHandDto toDto(SecondHand secondHand);
}

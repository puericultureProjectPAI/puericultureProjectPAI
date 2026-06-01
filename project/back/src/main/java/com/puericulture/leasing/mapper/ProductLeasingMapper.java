package com.puericulture.leasing.mapper;

import com.puericulture.common.mapper.ProductCategoryMapper;
import com.puericulture.leasing.dto.ProductLeasingResponse;
import com.puericulture.leasing.entity.LeasingArticle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;

@Mapper(
        componentModel = "spring",
        uses = ProductCategoryMapper.class,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface ProductLeasingMapper {

    @Mapping(target = "productId", source = "id")
    @Mapping(source = "category", target = "category", qualifiedByName = "toLabel")
    ProductLeasingResponse toProductLeasingResponse(LeasingArticle product);
}

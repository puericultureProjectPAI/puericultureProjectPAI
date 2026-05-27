package com.puericulture.leasing.mapper;

import com.puericulture.leasing.dto.ProductLeasingResponse;
import com.puericulture.leasing.entity.LeasingArticle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;

@Mapper(componentModel = "spring", nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface ProductLeasingMapper {

    @Mapping(target = "productId", source = "id")
    ProductLeasingResponse toProductLeasingResponse(LeasingArticle product);
}

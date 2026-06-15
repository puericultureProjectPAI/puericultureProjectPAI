package com.puericulture.leasing.mapper;

import com.puericulture.common.entity.ProductCategory;
import com.puericulture.leasing.dto.LeasingProductSummary;
import com.puericulture.leasing.dto.LeasingProductSummaryDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface LeasingProductMapper {

    @Mapping(target = "available", expression = "java(Boolean.TRUE.equals(summary.getAvailable()))")
    @Mapping(source = "category", target = "category", qualifiedByName = "categoryStringToLabel")
    LeasingProductSummaryDto toDto(LeasingProductSummary summary);

    @Named("categoryStringToLabel")
    default String categoryStringToLabel(String categoryName) {
        if (categoryName == null) return null;
        try {
            return ProductCategory.fromLabel(categoryName).getLabel();
        } catch (IllegalArgumentException e) {
            return categoryName;
        }
    }
}

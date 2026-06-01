package com.puericulture.leasing.mapper;

import com.puericulture.leasing.dto.LeasingProductSummary;
import com.puericulture.leasing.dto.LeasingProductSummaryDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LeasingProductMapper {

    @Mapping(target = "available", expression = "java(Boolean.TRUE.equals(summary.getAvailable()))")
    LeasingProductSummaryDto toDto(LeasingProductSummary summary);
}

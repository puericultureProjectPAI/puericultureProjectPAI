package com.puericulture.troc.mapper;

import com.puericulture.common.mapper.PersonMapper;
import com.puericulture.troc.dto.ReportResponse;
import com.puericulture.troc.entity.ExchangeReport;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = PersonMapper.class)
public interface ExchangeReportMapper {

    @Mapping(target = "exchangeId", source = "exchange.id")
    ReportResponse toResponse(ExchangeReport report);
}

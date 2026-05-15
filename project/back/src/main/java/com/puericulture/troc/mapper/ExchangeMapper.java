package com.puericulture.troc.mapper;

import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.entity.Exchange;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = ProductTrocMapper.class)
public interface ExchangeMapper {

    ExchangeResponse toResponse(Exchange exchange);
}

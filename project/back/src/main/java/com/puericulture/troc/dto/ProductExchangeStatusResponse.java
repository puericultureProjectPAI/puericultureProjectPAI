package com.puericulture.troc.dto;

import com.puericulture.troc.entity.ExchangeStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductExchangeStatusResponse {

    private boolean hasExchange;

    private Long exchangeId;

    private ExchangeStatus status;
}

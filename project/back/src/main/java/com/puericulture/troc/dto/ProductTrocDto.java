package com.puericulture.troc.dto;

import com.puericulture.common.dto.ProductDto;
import com.puericulture.troc.entity.ExchangeStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Data
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
public class ProductTrocDto extends ProductDto {

    private Long estimatedPrice;

    @Enumerated(EnumType.STRING)
    private ExchangeStatus status;
}

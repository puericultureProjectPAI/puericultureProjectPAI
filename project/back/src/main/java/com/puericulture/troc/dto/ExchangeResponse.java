package com.puericulture.troc.dto;

import com.puericulture.troc.entity.ExchangeStatus;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ExchangeResponse {

    private Long id;

    private ProductTrocDto proposerProduct;

    private ProductTrocDto receiverProduct;

    private ExchangeStatus status;

    private OffsetDateTime createdAt;
}

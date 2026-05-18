package com.puericulture.troc.dto;

import com.puericulture.troc.entity.ExchangeStatus;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Represents an exchange proposal between two products.")
public class ExchangeResponse {

    @Schema(description = "Unique identifier of the exchange.", example = "15")
    private Long id;

    @Schema(description = "Product proposed by the connected user.")
    private ProductTrocDto proposerProduct;

    @Schema(description = "Product requested from another user.")
    private ProductTrocDto receiverProduct;

    @Schema(description = "Current status of the exchange.", example = "PENDING")
    private ExchangeStatus status;

    @Schema(
            description = "The date and time when the exchange was created.",
            example = "2026-05-14T15:32:10Z")
    private OffsetDateTime createdAt;
}

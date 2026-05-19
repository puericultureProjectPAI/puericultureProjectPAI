package com.puericulture.troc.dto;

import com.puericulture.common.dto.ProductDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Represents a troc product listing.")
public class TrocProductDto extends ProductDto {

    @Schema(description = "Estimated value of the product in cents.", example = "2500")
    private Long estimatedPrice;

    @Schema(description = "Status of the troc listing.", example = "AVAILABLE")
    private String status;
}

package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Response containing the recommended arrival pack")
public class LeasingPackDto {

    @Schema(description = "List of products included in the pack")
    private List<LeasingProductSummaryDto> products;

    @Schema(description = "Total calculated price for the duration of the stay in euros")
    private Long totalPrice;

    @Schema(description = "Age of the child in months used for the recommendation")
    private Integer childAgeMonths;
}

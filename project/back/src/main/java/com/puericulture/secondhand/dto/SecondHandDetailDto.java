package com.puericulture.secondhand.dto;

import com.puericulture.common.dto.ProductDto;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Detailed information about a second-hand product including price and images")
public class SecondHandDetailDto extends ProductDto {

    @Schema(description = "Price of the second-hand product in euros")
    private Long price;

    @Schema(description = "List of URLs for the product's images")
    private List<String> imageUrls;
}

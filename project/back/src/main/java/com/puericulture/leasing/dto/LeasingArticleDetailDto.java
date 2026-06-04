package com.puericulture.leasing.dto;

import com.puericulture.common.dto.ProductDto;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Detailed information about a leasing article including pricing and images")
public class LeasingArticleDetailDto extends ProductDto {

    @Schema(description = "Price to lease the article per month in cents", example = "4500")
    private Long pricePerMonth;

    @Schema(description = "Price to lease the article per day in cents", example = "200")
    private Long pricePerDay;

    @Schema(description = "List of URLs for the article's images")
    private List<String> imageUrls;
}

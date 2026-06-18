package com.puericulture.troc.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Detailed information about a troc product including images")
public class ProductTrocDetailDto extends ProductTrocDto {

    @Schema(description = "List of image URLs associated with the troc product")
    private List<String> imageUrls;
}

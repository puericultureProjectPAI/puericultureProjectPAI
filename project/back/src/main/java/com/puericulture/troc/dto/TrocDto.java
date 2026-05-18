package com.puericulture.troc.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Response payload returned after publishing a troc product.")
public class TrocDto {

    @Schema(description = "Identifier of the product in the common products table.", example = "12")
    private Long productId;

    @Schema(description = "Title displayed for the troc product.", example = "Poussette à échanger")
    private String title;

    @Schema(description = "Detailed product description.")
    private String description;

    @Schema(description = "Estimated product value in euros.", example = "40")
    private Long estimatedPrice;

    @Schema(description = "Identifier of the product author.")
    private UUID authorId;

    @Schema(description = "Display name of the product author.", example = "Dupont")
    private String authorName;

    @Schema(description = "City where the product is located.", example = "Lille")
    private String city;

    @Schema(description = "Product category identifier.", example = "3")
    private String category;

    @Schema(description = "Current troc publication status.", example = "AVAILABLE")
    private String status;
}

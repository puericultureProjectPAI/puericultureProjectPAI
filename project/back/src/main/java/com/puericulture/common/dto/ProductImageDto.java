package com.puericulture.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Represents a single image associated to a product listing.")
public class ProductImageDto {

    @Schema(description = "Unique identifier of the image.", example = "42")
    private Long id;

    @Schema(description = "ID of the product this image belongs to.", example = "7")
    private Long productId;

    @Schema(
            description = "Public URL of the image stored in Cloudinary.",
            example = "https://res.cloudinary.com/demo/image/upload/sample.jpg")
    private String imageUrl;

    @Schema(description = "Display order of the image within the product listing.", example = "1")
    private Integer position;
}

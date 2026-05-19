package com.puericulture.troc.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Represents a single image associated to a product listing.")
public class ProductImageDto {

    @Schema(description = "Unique identifier of the image.", example = "42")
    private Long id;

    @Schema(description = "ID of the product this image belongs to.", example = "7")
    private Long productId;

    @Schema(
            description = "Public URL of the image stored in Supabase Storage.",
            example = "https://xyz.supabase.co/storage/v1/object/public/images/7/photo.jpg")
    private String imageUrl;

    @Schema(description = "Display order of the image within the product listing.", example = "1")
    private Integer position;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }
}

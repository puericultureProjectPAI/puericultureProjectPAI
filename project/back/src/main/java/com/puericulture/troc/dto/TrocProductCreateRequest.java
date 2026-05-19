package com.puericulture.troc.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request body to create a new troc product listing.")
public class TrocProductCreateRequest {

    @Schema(description = "Title of the listing.", example = "Poussette Bugaboo en bon état")
    private String postTitle;

    @Schema(
            description = "Detailed description of the product.",
            example = "Utilisée 2 ans, très bon état général.")
    private String description;

    @Schema(description = "City where the product is located.", example = "Montréal")
    private String city;

    @Schema(description = "Product category enum value.", example = "TRANSPORT_BEBE")
    private String category;

    @Schema(description = "Estimated value in cents (optional).", example = "15000")
    private Long estimatedPrice;

    public String getPostTitle() {
        return postTitle;
    }

    public void setPostTitle(String postTitle) {
        this.postTitle = postTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getEstimatedPrice() {
        return estimatedPrice;
    }

    public void setEstimatedPrice(Long estimatedPrice) {
        this.estimatedPrice = estimatedPrice;
    }
}

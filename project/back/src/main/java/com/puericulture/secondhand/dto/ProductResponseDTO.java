package com.puericulture.secondhand.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductResponseDTO {

    private String id;
    private String name;
    private String brand;
    private String category;
    private String imageUrl;
    private Double newPrice;

    public ProductResponseDTO(
            String id,
            String name,
            String brand,
            String category,
            String imageUrl,
            Double newPrice) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.category = category;
        this.imageUrl = imageUrl;
        this.newPrice = newPrice;
    }
}

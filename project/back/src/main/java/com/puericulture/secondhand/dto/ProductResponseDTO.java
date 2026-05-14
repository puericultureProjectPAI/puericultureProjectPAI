package com.puericulture.secondhand.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductResponseDTO {

    private String id;
    private String name;
    private String brand;
    private String category;
    private String imageUrl;
    private Double price;
}

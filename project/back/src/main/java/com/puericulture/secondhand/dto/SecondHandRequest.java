package com.puericulture.secondhand.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SecondHandRequest {

    @NotBlank private String title;

    @NotBlank private String description;

    @NotNull @PositiveOrZero private Long price;

    private String condition;
    private String city;
    private String category;
    private String imageReference;
    private Integer maxWeightKg;
    private String dimensions;
    private Integer minAgeMonths;
    private Integer maxAgeMonths;
    private String brand;
}

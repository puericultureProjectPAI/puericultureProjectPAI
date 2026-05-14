package com.puericulture.secondhand.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
public class ExternalProductDTO {

    @NotBlank
    @Pattern(regexp = "^[0-9]{13}$")
    private String ean;

    @NotBlank private String name;

    private String brand;
    private String category;
    private String imageUrl;
    private Double newPrice;
}

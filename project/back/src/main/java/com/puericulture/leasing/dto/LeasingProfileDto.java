package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User profile address details for leasing delivery")
public class LeasingProfileDto {

    @Schema(example = "10 Rue de la Paix", description = "User street address")
    private String street;

    @Schema(example = "75002", description = "User zip code")
    private String zipCode;

    @Schema(example = "Paris", description = "User city")
    private String city;
}

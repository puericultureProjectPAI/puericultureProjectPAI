package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request body to book a leasing article")
public class LeasingReservationRequestDto {

    @NotNull(message = "Product ID is mandatory") @Schema(description = "ID of the product to lease", example = "1")
    private Long productId;

    @NotNull(message = "Start date is mandatory") @Schema(description = "Start date of the lease period", example = "2026-06-10")
    private LocalDate startDate;

    @NotNull(message = "End date is mandatory") @Schema(description = "End date of the lease period", example = "2026-07-10")
    private LocalDate endDate;

    @NotBlank(message = "Delivery street address is mandatory")
    @Schema(description = "Street address for delivery", example = "10 Rue de la Paix")
    private String deliveryStreet;

    @NotBlank(message = "Delivery zip code is mandatory")
    @Schema(description = "Zip code for delivery", example = "75002")
    private String deliveryZipCode;

    @NotBlank(message = "Delivery city is mandatory")
    @Schema(description = "City for delivery", example = "Paris")
    private String deliveryCity;
}

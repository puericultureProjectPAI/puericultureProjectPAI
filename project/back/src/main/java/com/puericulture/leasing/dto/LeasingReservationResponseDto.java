package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response returned after a successful leasing booking")
public class LeasingReservationResponseDto {

    @Schema(description = "Unique reservation identifier/number", example = "RES-101")
    private String reservationNumber;

    @Schema(
            description = "Estimated delivery date (usually 3 days before start date)",
            example = "2026-06-07")
    private LocalDate estimatedDeliveryDate;

    @Schema(description = "ID of the leased product", example = "1")
    private Long productId;

    @Schema(description = "Start date of the lease period", example = "2026-06-10")
    private LocalDate startDate;

    @Schema(description = "End date of the lease period", example = "2026-07-10")
    private LocalDate endDate;

    @Schema(description = "Calculated total price for the selected lease period", example = "115")
    private Long totalPrice;
}

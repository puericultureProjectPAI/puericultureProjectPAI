package com.puericulture.leasing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response returned after a successful arrival pack booking")
public class LeasingPackReservationResponseDto {

    @Schema(description = "Reservation identifiers created for the booked products")
    private List<String> reservationNumbers;

    @Schema(description = "Products reserved in the pack")
    private List<ReservedProduct> products;

    @Schema(description = "Estimated delivery date", example = "2026-06-07")
    private LocalDate estimatedDeliveryDate;

    @Schema(description = "Start date of the lease period", example = "2026-06-10")
    private LocalDate startDate;

    @Schema(description = "End date of the lease period", example = "2026-07-10")
    private LocalDate endDate;

    @Schema(description = "Calculated total price for the selected lease period", example = "230")
    private Long totalPrice;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservedProduct {
        private Long productId;
        private String postTitle;
        private String reservationNumber;
    }
}

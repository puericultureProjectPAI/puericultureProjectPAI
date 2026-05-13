package com.puericulture.secondhand.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PriceComparisonDTO {

    private String category;
    private Double averageOccasionPrice;
    private Long listingsCount;
    private Double savingsAmount;
    private Double savingsPercent;
    private boolean lowSampleWarning;

    public PriceComparisonDTO(String category) {
        this.category = category;
        this.averageOccasionPrice = null;
        this.listingsCount = 0L;
        this.lowSampleWarning = false;
    }

    public PriceComparisonDTO(
            String category,
            Double averageOccasionPrice,
            Long listingsCount,
            Double savingsAmount,
            Double savingsPercent,
            boolean lowSampleWarning) {
        this.category = category;
        this.averageOccasionPrice = averageOccasionPrice;
        this.listingsCount = listingsCount;
        this.savingsAmount = savingsAmount;
        this.savingsPercent = savingsPercent;
        this.lowSampleWarning = lowSampleWarning;
    }
}

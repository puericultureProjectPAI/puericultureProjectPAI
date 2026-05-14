package com.puericulture.secondhand.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PriceComparisonDTO {

    private String category;
    private Double averageOccasionPrice;
    private Long listingsCount;
    private Double savingsAmount;
    private Double savingsPercent;
    private boolean lowSampleWarning;
}

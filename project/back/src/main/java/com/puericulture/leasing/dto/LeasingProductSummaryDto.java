package com.puericulture.leasing.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeasingProductSummaryDto {

    private Long id;
    private String postTitle;
    private String category;
    private String city;
    private Long pricePerDay;
    private Long pricePerMonth;
    private String condition;
    private String firstImageUrl;
    private boolean available;
}

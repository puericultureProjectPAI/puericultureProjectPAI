package com.puericulture.leasing.dto;

public interface LeasingProductSummary {
    Long getId();

    String getPostTitle();

    String getCategory();

    String getCity();

    Long getPricePerDay();

    Long getPricePerMonth();

    String getCondition();

    String getFirstImageUrl();

    Boolean getAvailable();
}

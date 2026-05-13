package com.puericulture.leasing.repository;

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

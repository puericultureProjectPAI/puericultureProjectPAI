package com.puericulture.troc.repository;

public interface TrocProjection {

    Long getProductId();

    String getTitle();

    String getDescription();

    String getImageUrl();

    String getCategory();

    Long getEstimatedPrice();
}

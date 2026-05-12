package com.puericulture.troc.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_troc", schema = "public")
public class ProductTroc {

    @Id
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "estimated_price")
    private Long estimatedPrice;

    @Column(name = "status")
    private String status;

    public ProductTroc() {}

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getEstimatedPrice() {
        return estimatedPrice;
    }

    public void setEstimatedPrice(Long estimatedPrice) {
        this.estimatedPrice = estimatedPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

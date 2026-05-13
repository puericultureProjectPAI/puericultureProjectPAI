package com.puericulture.troc.entity;

import com.puericulture.common.entity.Product;
import jakarta.persistence.*;

@Entity
@Table(name = "product_troc", schema = "public")
@PrimaryKeyJoinColumn(name = "product_id")
public class ProductTroc extends Product {

    @Column(name = "estimated_price")
    private Long estimatedPrice;

    @Column(name = "status")
    private String status;

    public ProductTroc() {}

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

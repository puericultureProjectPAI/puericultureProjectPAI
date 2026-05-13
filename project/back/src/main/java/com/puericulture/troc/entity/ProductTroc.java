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

    public ProductTroc() {
        this.setPostDate(
                java.time.LocalDateTime
                        .now()); // Initialiser la date de publication à la création du produit
        this.setStatus(ExchangeStatus.PENDING);
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

    public void setStatus(ExchangeStatus pending) {
        this.status = pending.toString();
    }
}

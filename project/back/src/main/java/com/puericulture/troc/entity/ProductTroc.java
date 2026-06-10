package com.puericulture.troc.entity;

import com.puericulture.common.entity.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product_troc", schema = "public")
@PrimaryKeyJoinColumn(name = "product_id")
@Getter
@Setter
@AllArgsConstructor
public class ProductTroc extends Product {

    @Column(name = "estimated_price")
    private Long estimatedPrice;

    @Column(name = "status")
    private ProductTrocStatus status;

    public ProductTroc() {
        this.setPostDate(
                java.time.LocalDateTime
                        .now()); // Initialiser la date de publication à la création du produit
        this.setStatus(ProductTrocStatus.AVAILABLE); // Initialiser le statut à AVAILABLE par défaut
    }

    public void setStatus(ProductTrocStatus status) {
        this.status = status;
    }
}

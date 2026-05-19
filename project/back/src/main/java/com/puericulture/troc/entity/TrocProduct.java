package com.puericulture.troc.entity;

import com.puericulture.common.entity.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_troc")
@PrimaryKeyJoinColumn(name = "product_id")
@Getter
@Setter
@NoArgsConstructor
public class TrocProduct extends Product {

    @Column(name = "estimated_price")
    private Long estimatedPrice;

    @Column(name = "status", nullable = false)
    private String status = "AVAILABLE";
}

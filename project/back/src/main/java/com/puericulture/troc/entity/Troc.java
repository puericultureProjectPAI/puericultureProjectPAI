package com.puericulture.troc.entity;

import com.puericulture.common.entity.Product;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "product_troc")
@PrimaryKeyJoinColumn(name = "product_id", referencedColumnName = "id")
public class Troc extends Product {

    @Column(name = "estimated_price")
    private Long estimatedPrice;

    @Column(name = "status", nullable = false)
    private String status = "AVAILABLE";
}

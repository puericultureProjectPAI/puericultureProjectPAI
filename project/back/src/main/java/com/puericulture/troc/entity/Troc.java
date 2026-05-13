package com.puericulture.troc.entity;

import com.puericulture.common.entity.Products;
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
@PrimaryKeyJoinColumn(name = "id")
public class Troc extends Products {

    @Column(name = "estimated_price", nullable = false)
    private Long estimatedPrice;
}

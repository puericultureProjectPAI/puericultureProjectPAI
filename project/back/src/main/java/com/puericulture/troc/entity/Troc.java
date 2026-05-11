package com.puericulture.troc.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product_troc")
public class Troc {

    @Id
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "estimated_price", nullable = false)
    private Long estimatedPrice;
}

package com.puericulture.leasing.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_leasing")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeasingProduct {

    @Id
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "price_per_day", nullable = false)
    private Long pricePerDay;

    @Column(name = "price_per_month", nullable = false)
    private Long pricePerMonth;
}

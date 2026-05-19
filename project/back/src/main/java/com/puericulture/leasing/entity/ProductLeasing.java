package com.puericulture.leasing.entity;

import com.puericulture.common.entity.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_leasing")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductLeasing extends Product {

    @Column(name = "price_per_month", nullable = false)
    private Long pricePerMonth;

    @Column(name = "price_per_day", nullable = false)
    private Long pricePerDay;
}

package com.puericulture.leasing.entity;

import com.puericulture.common.entity.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_leasing")
@PrimaryKeyJoinColumn(name = "product_id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeasingArticle extends Product {

    @Column(name = "price_per_month", nullable = false)
    private Long pricePerMonth;

    @Column(name = "price_per_day", nullable = false)
    private Long pricePerDay;
}

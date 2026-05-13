package com.puericulture.secondhand.entity;

import com.puericulture.common.entity.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "second_hand_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SecondHandProduct extends Product {

    @Column(name = "new_price")
    private Double newPrice;

    @Column(name = "ean", length = 13)
    private String ean;

    @Column(name = "condition", length = 50)
    private String condition;

    @Column(name = "price")
    private Double price;

    @Column(name = "status", length = 20)
    private String status;
}

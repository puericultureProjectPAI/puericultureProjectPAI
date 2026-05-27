package com.puericulture.secondhand.entity;

import com.puericulture.common.entity.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_sale")
@PrimaryKeyJoinColumn(name = "product_id", referencedColumnName = "id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SecondHand extends Product {

    @Column(name = "price", nullable = false)
    private Long price;
}

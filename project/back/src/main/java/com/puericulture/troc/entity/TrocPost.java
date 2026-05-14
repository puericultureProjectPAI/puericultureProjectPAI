package com.puericulture.troc.entity;

import com.puericulture.common.entity.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_troc")
@PrimaryKeyJoinColumn(name = "product_id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrocPost extends Product {

    @Column(name = "estimated_price")
    private Long estimatedPrice;
}

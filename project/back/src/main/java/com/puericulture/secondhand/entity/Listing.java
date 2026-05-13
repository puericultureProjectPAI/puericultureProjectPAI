package com.puericulture.secondhand.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(
        name = "listings",
        indexes = {
            @Index(
                    name = "idx_listing_category_status_condition",
                    columnList = "category, status, condition")
        })
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 13)
    private String ean;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String condition;

    @Column(nullable = false)
    private String category;
}

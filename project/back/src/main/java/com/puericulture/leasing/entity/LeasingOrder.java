package com.puericulture.leasing.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * STRATEGIC INTENT: Maps the leasing_orders table which stores rental date ranges. WHY THIS
 * MATTERS: Leasing orders extend client_products with start and end dates.
 */
@Entity
@Table(name = "leasing_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeasingOrder {

    @Id
    @Column(name = "client_product_id", nullable = false)
    private Long clientProductId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "delivery_street")
    private String deliveryStreet;

    @Column(name = "delivery_zip_code")
    private String deliveryZipCode;

    @Column(name = "delivery_city")
    private String deliveryCity;
}

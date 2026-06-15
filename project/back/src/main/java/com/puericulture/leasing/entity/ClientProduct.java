package com.puericulture.leasing.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * STRATEGIC INTENT: Maps the client_products table which links a product with a client ordering it.
 * WHY THIS MATTERS: This is the intersection entity for all customer product transactions.
 */
@Entity
@Table(name = "client_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    @Column(name = "order_id", nullable = false)
    private Long orderId;
}

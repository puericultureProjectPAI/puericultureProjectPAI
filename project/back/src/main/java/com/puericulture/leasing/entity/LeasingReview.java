package com.puericulture.leasing.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

/**
 * STRATEGIC INTENT: Maps the leasing_reviews table which stores post-rental feedback left by
 * clients. WHY THIS MATTERS: A review is tied to exactly one leasing order (UNIQUE constraint on
 * leasing_order_id), preventing duplicate submissions. The leasing_id FK links the review to the
 * product catalog so reviews can be fetched and displayed on the product detail page.
 */
@Entity
@Table(name = "leasing_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeasingReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * FK → leasing_orders.client_product_id. UNIQUE: one review per completed rental order.
     * Attempting a second review on the same order must be rejected with 409 Conflict.
     */
    @Column(name = "leasing_order_id", nullable = false, unique = true)
    private Long leasingOrderId;

    /**
     * FK → product_leasing.product_id. Used to retrieve all reviews for a given product in the
     * catalog detail page.
     */
    @Column(name = "leasing_id", nullable = false)
    private Long leasingId;

    /**
     * Rating from 1 to 5 — enforced at DB level via CHECK constraint and at API level via JSR-380.
     */
    @Column(name = "rating", nullable = false)
    private Integer rating;

    /** Free-text comment, optional. Displayed below the star rating on the product detail page. */
    @Column(name = "comment")
    private String comment;

    /**
     * Automatically set to NOW() at insert time by Hibernate. Mirrors the DEFAULT NOW() defined in
     * the SQL schema so neither the service nor the client needs to provide a timestamp.
     */
    @CreationTimestamp
    @Column(name = "review_date", nullable = false, updatable = false)
    private OffsetDateTime reviewDate;
}

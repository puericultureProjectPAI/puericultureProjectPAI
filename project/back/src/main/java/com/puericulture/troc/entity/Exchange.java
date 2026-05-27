package com.puericulture.troc.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Entity
@Table(name = "exchanges", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Exchange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "proposer_product_id", nullable = false)
    private ProductTroc proposerProduct;

    @ManyToOne
    @JoinColumn(name = "receiver_product_id", nullable = false)
    private ProductTroc receiverProduct;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExchangeStatus status = ExchangeStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_before_block")
    private ExchangeStatus statusBeforeBlock;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}

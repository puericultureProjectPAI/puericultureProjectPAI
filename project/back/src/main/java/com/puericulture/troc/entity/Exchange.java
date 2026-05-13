package com.puericulture.troc.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "exchanges", schema = "public")
public class Exchange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "creator_id", nullable = false)
    private UUID creatorId;

    @Column(name = "proposer_product_id", nullable = false)
    private Long proposerProductId;

    @Column(name = "receiver_product_id", nullable = false)
    private Long receiverProductId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExchangeStatus status = ExchangeStatus.PENDING;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Exchange() {}

    public Long getId() {
        return id;
    }

    public Long getProposerProductId() {
        return proposerProductId;
    }

    public void setProposerProductId(Long proposerProductId) {
        this.proposerProductId = proposerProductId;
    }

    public Long getReceiverProductId() {
        return receiverProductId;
    }

    public void setReceiverProductId(Long receiverProductId) {
        this.receiverProductId = receiverProductId;
    }

    public ExchangeStatus getStatus() {
        return status;
    }

    public void setStatus(ExchangeStatus status) {
        this.status = status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UUID getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(UUID creatorId) {
        this.creatorId = creatorId;
    }
}

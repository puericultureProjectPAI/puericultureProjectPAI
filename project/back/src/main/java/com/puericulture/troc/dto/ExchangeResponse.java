package com.puericulture.troc.dto;

import com.puericulture.troc.entity.ExchangeStatus;
import java.time.OffsetDateTime;

public class ExchangeResponse {

    private Long id;

    private Long proposerProductId;

    private Long receiverProductId;

    private ExchangeStatus status;

    private OffsetDateTime createdAt;

    public ExchangeResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}

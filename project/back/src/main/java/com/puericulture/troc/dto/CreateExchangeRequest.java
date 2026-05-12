package com.puericulture.troc.dto;

public class CreateExchangeRequest {

    private Long proposerProductId;

    private Long receiverProductId;

    public CreateExchangeRequest() {}

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
}

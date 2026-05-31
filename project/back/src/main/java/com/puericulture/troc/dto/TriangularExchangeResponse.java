package com.puericulture.troc.dto;

import com.puericulture.troc.entity.ExchangeStatus;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TriangularExchangeResponse {
    private Long id;
    private ExchangeStatus status;
    private OffsetDateTime createdAt;
    private List<ParticipantResponse> participants;

    @Getter
    @Setter
    public static class ParticipantResponse {
        private Long id;
        private UUID participantId;
        private String participantName;
        private Long offeredProductId;
        private String offeredProductTitle;
        private Long wantedProductId;
        private String wantedProductTitle;
        private Integer stepOrder;
        private ExchangeStatus status;
        private OffsetDateTime acceptedAt;
    }
}

package com.puericulture.troc.dto;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TriangularParticipantRequest {
    private UUID participantId;
    private Long offeredProductId;
    private Long wantedProductId;
    private Integer stepOrder;
}

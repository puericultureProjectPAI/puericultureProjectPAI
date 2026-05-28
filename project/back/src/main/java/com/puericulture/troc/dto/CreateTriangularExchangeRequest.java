package com.puericulture.troc.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTriangularExchangeRequest {

    private List<TriangularParticipantRequest> participants;
}

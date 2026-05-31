package com.puericulture.troc.mapper;

import com.puericulture.troc.dto.TriangularExchangeResponse;
import com.puericulture.troc.entity.TriangularExchange;
import com.puericulture.troc.entity.TriangularExchangeParticipant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TriangularExchangeMapper {

    TriangularExchangeResponse toResponse(TriangularExchange exchange);

    @Mapping(source = "participant.id", target = "participantId")
    @Mapping(source = "participant.name", target = "participantName")
    @Mapping(source = "offeredProduct.id", target = "offeredProductId")
    @Mapping(source = "offeredProduct.postTitle", target = "offeredProductTitle")
    @Mapping(source = "wantedProduct.id", target = "wantedProductId")
    @Mapping(source = "wantedProduct.postTitle", target = "wantedProductTitle")
    TriangularExchangeResponse.ParticipantResponse toParticipantResponse(
            TriangularExchangeParticipant participant);
}

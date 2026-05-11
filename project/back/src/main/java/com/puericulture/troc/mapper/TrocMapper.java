package com.puericulture.troc.mapper;

import com.puericulture.troc.dto.TrocDto;
import com.puericulture.troc.repository.TrocProjection;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TrocMapper {

    TrocDto toDto(TrocProjection trocProjection);
}

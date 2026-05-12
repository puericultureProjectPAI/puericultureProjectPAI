package com.puericulture.troc.mapper;

import com.puericulture.troc.dto.TrocDto;
import com.puericulture.troc.entity.Troc;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TrocMapper {
    TrocDto toDto(Troc troc);
}

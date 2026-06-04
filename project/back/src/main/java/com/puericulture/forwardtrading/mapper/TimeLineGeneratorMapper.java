package com.puericulture.forwardtrading.mapper;

import com.puericulture.forwardtrading.dto.OnBoardingDto.ChildDto;
import com.puericulture.forwardtrading.dto.TimeLineGeneratorCreateDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class TimeLineGeneratorMapper {

    @Mapping(source = "birthDate", target = "birthDate")
    public abstract TimeLineGeneratorCreateDto toTimeLineGeneratorCreateDto(ChildDto childDto);
}

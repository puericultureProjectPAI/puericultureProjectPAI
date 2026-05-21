package com.puericulture.forwardtrading.mapper;

import com.puericulture.forwardtrading.dto.TimelineArticleDto;
import com.puericulture.forwardtrading.dto.TimelinePeriodDto;
import com.puericulture.forwardtrading.entity.TimelineEvents;
import com.puericulture.forwardtrading.entity.TimelinePeriods;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TimelineMapper {

    @Mapping(target = "id", source = "period.id")
    @Mapping(target = "products", source = "events")
    TimelinePeriodDto toTimelinePeriodDto(TimelinePeriods period, List<TimelineEvents> events);

    @Mapping(target = "name", source = "articleName")
    @Mapping(target = "price", source = "articlePrice")
    @Mapping(target = "tag", source = "articleTag")
    TimelineArticleDto toProductDto(TimelineEvents event);
}

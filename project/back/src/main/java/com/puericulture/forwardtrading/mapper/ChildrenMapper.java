package com.puericulture.forwardtrading.mapper;

import com.puericulture.common.dto.PersonProfileDto;
import com.puericulture.forwardtrading.dto.OnBoardingDto.OnBoardingChildDto;
import com.puericulture.forwardtrading.dto.children.ChildDto;
import com.puericulture.forwardtrading.dto.children.CreateChildren;
import com.puericulture.forwardtrading.entity.ChildrenEntity;
import com.puericulture.forwardtrading.entity.Timelines;
import java.time.LocalDate;
import java.time.Period;
import java.util.Collections;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public abstract class ChildrenMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "name", source = "name")
    @Mapping(target = "birthDate", source = "dpa")
    @Mapping(target = "gender", source = "gender")
    public abstract ChildrenEntity toChildrenEntity(CreateChildren children);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "name", source = "name")
    @Mapping(target = "birthDate", source = "birthDate")
    @Mapping(target = "gender", ignore = true)
    public abstract ChildrenEntity toChildrenEntity(OnBoardingChildDto children);

    @Named("toChildrenPersonProfileDto")
    public List<PersonProfileDto.ChildPersonProfileDto> toChildrenPersonProfileDto(
            List<ChildrenEntity> childrenEntities) {
        if (childrenEntities == null) return Collections.emptyList();
        return childrenEntities.stream().map(this::toChildPersonProfileDto).toList();
    }

    @Mapping(target = "firstName", source = "name")
    @Mapping(target = "age", source = "birthDate", qualifiedByName = "getAge")
    @Mapping(target = "birthDate", source = "birthDate")
    @Mapping(target = "timelineId", source = "timelines", qualifiedByName = "getTimelineId")
    abstract PersonProfileDto.ChildPersonProfileDto toChildPersonProfileDto(ChildrenEntity child);

    public List<ChildDto> toChildDtoList(List<ChildrenEntity> childrenEntities) {
        if (childrenEntities == null) return Collections.emptyList();
        return childrenEntities.stream().map(this::toChildDtoDropDown).toList();
    }

    @Mapping(target = "id", source = "id")
    @Mapping(target = "firstName", source = "name")
    @Mapping(target = "timelineId", source = "timelines", qualifiedByName = "getTimelineId")
    public abstract ChildDto toChildDtoDropDown(ChildrenEntity child);

    @Named("getTimelineId")
    public Long getTimelineId(List<Timelines> timelines) {
        if (timelines == null || timelines.isEmpty()) return null;
        Timelines timeline = timelines.get(0);
        if (timeline == null) return null;
        return timeline.getId();
    }

    @Named("getAge")
    public Integer getAge(LocalDate birthDate) {
        if (birthDate == null) return null;
        return Period.between(birthDate, LocalDate.now()).getYears();
    }
}

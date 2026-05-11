package com.puericulture.forwardtrading.mapper;

import com.puericulture.forwardtrading.dto.children.CreateChildren;
import com.puericulture.forwardtrading.entity.ChildrenEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class ChildrenMapper {
    @Mapping(target = "name", source = "name")
    @Mapping(target = "birthDate", source = "dpa")
    @Mapping(target = "genre", source = "genre")
    public abstract ChildrenEntity toChildrenEntity(CreateChildren children);
}

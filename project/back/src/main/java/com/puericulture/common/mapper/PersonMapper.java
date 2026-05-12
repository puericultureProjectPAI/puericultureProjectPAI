package com.puericulture.common.mapper;

import com.puericulture.common.dto.PersonDto;
import com.puericulture.common.entity.Person;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PersonMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "city", source = "city")
    @Mapping(target = "street", source = "street")
    @Mapping(target = "genre", source = "genre")
    @Mapping(target = "dateOfBirth", source = "dateOfBirth")
    PersonDto toDto(Person person);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "city", source = "city")
    @Mapping(target = "street", source = "street")
    @Mapping(target = "genre", source = "genre")
    @Mapping(target = "dateOfBirth", source = "dateOfBirth")
    Person toEntity(PersonDto personDto);
}

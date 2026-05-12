package com.puericulture.common.mapper;

import com.puericulture.common.dto.PersonDto;
import com.puericulture.common.entity.Person;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PersonMapper {

    PersonDto toDto(Person person);

    Person toEntity(PersonDto personDto);
}

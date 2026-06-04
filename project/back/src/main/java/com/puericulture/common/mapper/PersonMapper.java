package com.puericulture.common.mapper;

import com.puericulture.common.dto.PersonDto;
import com.puericulture.common.dto.PersonProfileDto;
import com.puericulture.common.entity.Person;
import com.puericulture.forwardtrading.mapper.ChildrenMapper;
import java.time.OffsetDateTime;
import java.util.Random;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {ChildrenMapper.class})
public abstract class PersonMapper {
    Random randomGenerator = new Random();

    @Mapping(target = "id", source = "id")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "city", source = "city")
    @Mapping(target = "street", source = "street")
    @Mapping(target = "genre", source = "genre")
    @Mapping(target = "dateOfBirth", source = "dateOfBirth")
    abstract PersonDto toDto(Person person);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "city", source = "city")
    @Mapping(target = "street", source = "street")
    @Mapping(target = "genre", source = "genre")
    @Mapping(target = "dateOfBirth", source = "dateOfBirth")
    abstract Person toEntity(PersonDto personDto);

    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "lastName", source = "name")
    @Mapping(target = "memberSinceMonth", expression = "java(getMonth(person.getCreatedAt()))")
    @Mapping(target = "memberSinceYear", expression = "java(getYear(person.getCreatedAt()))")
    @Mapping(target = "trustScore", expression = "java(getMockedTrustScore())")
    @Mapping(
            target = "children",
            source = "children",
            qualifiedByName = "toChildrenPersonProfileDto")
    public abstract PersonProfileDto toPersonProfileDto(Person person);

    Integer getMonth(OffsetDateTime ts) {
        return ts == null ? null : ts.toLocalDateTime().getMonthValue();
    }

    Integer getYear(OffsetDateTime ts) {
        return ts == null ? null : ts.toLocalDateTime().getYear();
    }

    Double getMockedTrustScore() {
        double value = randomGenerator.nextDouble(0, 5);
        return Math.round(value * 100.0) / 100.0;
    }
}

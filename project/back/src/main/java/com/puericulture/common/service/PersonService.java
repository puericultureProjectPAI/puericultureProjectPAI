package com.puericulture.common.service;

import com.puericulture.common.dto.PersonProfileDto;
import com.puericulture.common.entity.Person;
import com.puericulture.common.mapper.PersonMapper;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.config.errormanager.exception.UnauthorizedException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PersonService {
    private final PersonRepository personRepository;
    private final PersonMapper personMapper;

    public PersonProfileDto getUserProfile(String personUUID) {
        if (personUUID == null) throw new UnauthorizedException("You need to be authenticated");
        Person person =
                personRepository
                        .findById(UUID.fromString(personUUID))
                        .orElseThrow(
                                () -> new UnauthorizedException("You need to be authenticated"));
        return personMapper.toPersonProfileDto(person);
    }
}

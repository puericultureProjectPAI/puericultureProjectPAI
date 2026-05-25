package com.puericulture.common.controller;

import com.puericulture.common.dto.PersonProfileDto;
import com.puericulture.common.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/person")
@RequiredArgsConstructor
public class PersonController {
    private final PersonService personService;

    @GetMapping("/me")
    public PersonProfileDto getCurrentPersonProfile(@AuthenticationPrincipal String personUUID) {
        return personService.getUserProfile(personUUID);
    }
}

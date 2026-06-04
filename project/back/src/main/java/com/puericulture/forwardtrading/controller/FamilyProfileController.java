package com.puericulture.forwardtrading.controller;

import com.puericulture.forwardtrading.dto.family.FamilyFormDto;
import com.puericulture.forwardtrading.service.FamilyRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class FamilyProfileController extends ForwardTradingController {

    private final FamilyRegistrationService familyRegistrationService;

    @PostMapping("family-profile")
    public void submitFamilyForm(
            @RequestBody FamilyFormDto form, @AuthenticationPrincipal String userId) {

        familyRegistrationService.processFamilyForm(form, userId);
    }
}

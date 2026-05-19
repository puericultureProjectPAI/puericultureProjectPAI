package com.puericulture.forwardtrading.controller;

import com.puericulture.forwardtrading.dto.children.CreateChildren;
import com.puericulture.forwardtrading.service.ChildrenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ChildrenController extends ForwardTradingController {
    private final ChildrenService childrenService;

    @PostMapping("children")
    public void createChildren(
            @RequestBody CreateChildren children, @AuthenticationPrincipal String userId) {
        childrenService.createChildren(children, userId);
    }
}

package com.puericulture.leasing.controller;

import com.puericulture.leasing.dto.LeasingArticleDetailDto;
import com.puericulture.leasing.service.LeasingArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/leasing")
@RequiredArgsConstructor
public class LeasingController {

    private final LeasingArticleService leasingArticleService;

    @GetMapping("/articles/{id}")
    public ResponseEntity<LeasingArticleDetailDto> getArticleDetail(@PathVariable Long id) {
        return ResponseEntity.ok(leasingArticleService.getArticleDetail(id));
    }
}

package com.puericulture.leasing.controller;

import com.puericulture.leasing.dto.LeasingProductSummaryDto;
import com.puericulture.leasing.service.LeasingProductService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/leasing")
@RequiredArgsConstructor
public class LeasingProductController {

    private final LeasingProductService leasingProductService;

    @GetMapping("/products")
    public ResponseEntity<List<LeasingProductSummaryDto>> getProducts() {
        return ResponseEntity.ok(leasingProductService.findAll());
    }
}

package com.puericulture.troc.controller;

import com.puericulture.troc.dto.TrocDto;
import com.puericulture.troc.dto.TrocRequest;
import com.puericulture.troc.service.TrocService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/troc/posts")
public class TrocController {
    private final TrocService trocService;

    public TrocController(TrocService trocService) {
        this.trocService = trocService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TrocDto createTroc(@Valid @RequestBody TrocRequest request) {
        return trocService.createTroc(request);
    }

    @GetMapping
    public List<TrocDto> findTrocs() {
        return trocService.findTrocs();
    }
}

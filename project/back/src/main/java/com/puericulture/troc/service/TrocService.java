package com.puericulture.troc.service;

import com.puericulture.troc.dto.TrocDto;
import com.puericulture.troc.dto.TrocRequest;
import com.puericulture.troc.mapper.TrocMapper;
import com.puericulture.troc.repository.TrocRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TrocService {
    private final TrocRepository trocRepository;
    private final TrocMapper trocMapper;

    public TrocService(TrocRepository trocRepository, TrocMapper trocMapper) {
        this.trocRepository = trocRepository;
        this.trocMapper = trocMapper;
    }

    @Transactional
    public TrocDto createTroc(TrocRequest request) {
        return trocMapper.toDto(trocRepository.create(request));
    }

    @Transactional(readOnly = true)
    public List<TrocDto> findTrocs() {
        return trocRepository.findAll().stream()
                .map(trocMapper::toDto)
                .toList();
    }
}

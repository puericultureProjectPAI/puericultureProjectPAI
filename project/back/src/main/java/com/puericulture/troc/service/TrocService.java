package com.puericulture.troc.service;

import com.puericulture.troc.dto.TrocDto;
import com.puericulture.troc.dto.TrocRequest;
import com.puericulture.troc.entity.Troc;
import com.puericulture.troc.mapper.TrocMapper;
import com.puericulture.troc.repository.TrocRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TrocService {

    private static final String DEFAULT_CITY = "Lille";

    private static final String TROC_CATEGORY = "TROC";

    private final TrocRepository trocRepository;

    private final TrocMapper trocMapper;

    public TrocService(TrocRepository trocRepository, TrocMapper trocMapper) {
        this.trocRepository = trocRepository;
        this.trocMapper = trocMapper;
    }

    @Transactional
    public TrocDto createTroc(TrocRequest request) {
        Troc troc = new Troc();
        troc.setPostTitle(request.getTitle());
        troc.setDescription(request.getDescription());
        troc.setCity(defaultIfBlank(request.getCity(), DEFAULT_CITY));
        troc.setCategory(defaultIfBlank(request.getCategory(), TROC_CATEGORY));
        troc.setAuthorId(request.getAuthorId());
        troc.setEstimatedPrice(request.getEstimatedPrice());

        Troc createdTroc = trocRepository.save(troc);
        return trocMapper.toDto(createdTroc);
    }

    @Transactional(readOnly = true)
    public List<TrocDto> findTrocs() {
        return trocRepository.findAllByCategoryOrderByIdDesc(TROC_CATEGORY).stream()
                .map(trocMapper::toDto)
                .toList();
    }

    private String defaultIfBlank(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value;
    }
}

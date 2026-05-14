package com.puericulture.leasing.service;

import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.leasing.dto.LeasingArticleDetailDto;
import com.puericulture.leasing.mapper.LeasingArticleMapper;
import com.puericulture.leasing.repository.LeasingArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeasingArticleService {

    private final LeasingArticleRepository leasingArticleRepository;
    private final LeasingArticleMapper leasingArticleMapper;

    public LeasingArticleDetailDto getArticleDetail(Long id) {
        return leasingArticleRepository
                .findByIdWithImages(id)
                .map(leasingArticleMapper::toDetailDto)
                .orElseThrow(
                        () ->
                                new NotFoundException(
                                        "Article leasing introuvable avec l'id : " + id));
    }
}

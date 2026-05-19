package com.puericulture.troc.service;

import com.puericulture.common.entity.Person;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.TrocProductCreateRequest;
import com.puericulture.troc.dto.TrocProductDto;
import com.puericulture.troc.mapper.TrocProductMapper;
import com.puericulture.troc.repository.TrocProductRepository;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TrocProductService {

    private final TrocProductRepository trocProductRepository;
    private final TrocProductMapper trocProductMapper;
    private final PersonRepository personRepository;

    @Autowired
    public TrocProductService(
            TrocProductRepository trocProductRepository,
            TrocProductMapper trocProductMapper,
            PersonRepository personRepository) {
        this.trocProductRepository = trocProductRepository;
        this.trocProductMapper = trocProductMapper;
        this.personRepository = personRepository;
    }

    public TrocProductDto create(TrocProductCreateRequest request, String authorId) {
        Person author =
                personRepository
                        .findById(UUID.fromString(authorId))
                        .orElseThrow(
                                () -> new NotFoundException("Auteur introuvable : " + authorId));

        return trocProductMapper.toDto(
                trocProductRepository.save(trocProductMapper.toEntity(request, author)));
    }

    public TrocProductDto getById(Long id) {
        return trocProductRepository
                .findById(id)
                .map(trocProductMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Produit troc introuvable : " + id));
    }
}

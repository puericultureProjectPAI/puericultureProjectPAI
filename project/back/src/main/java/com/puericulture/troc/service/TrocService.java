package com.puericulture.troc.service;

import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.ProductCategory;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.troc.dto.TrocDto;
import com.puericulture.troc.dto.TrocRequest;
import com.puericulture.troc.entity.Troc;
import com.puericulture.troc.mapper.TrocMapper;
import com.puericulture.troc.repository.TrocRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TrocService {

    private static final String DEFAULT_CITY = "Lille";

    private static final String DEFAULT_CATEGORY = "Autres articles pour bébé et enfant";

    private final TrocRepository trocRepository;

    private final TrocMapper trocMapper;

    private final PersonRepository personRepository;

    public TrocService(
            TrocRepository trocRepository,
            TrocMapper trocMapper,
            PersonRepository personRepository) {
        this.trocRepository = trocRepository;
        this.trocMapper = trocMapper;
        this.personRepository = personRepository;
    }

    @Transactional
    public TrocDto createTroc(TrocRequest request, UUID authorId) {
        if (request == null) {
            throw new IllegalArgumentException("Troc request is required");
        }

        Person author =
                personRepository
                        .findById(authorId)
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Authenticated person not found"));

        Troc troc = new Troc();
        troc.setPostTitle(request.getTitle());
        troc.setDescription(request.getDescription());
        troc.setPostDate(LocalDateTime.now());
        troc.setCity(defaultIfBlank(request.getCity(), DEFAULT_CITY));
        troc.setCategory(
                ProductCategory.fromLabel(defaultIfBlank(request.getCategory(), DEFAULT_CATEGORY)));
        troc.setAuthor(author);
        troc.setEstimatedPrice(request.getEstimatedPrice());

        Troc createdTroc = trocRepository.save(troc);
        return trocMapper.toDto(createdTroc);
    }

    private String defaultIfBlank(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value;
    }
}

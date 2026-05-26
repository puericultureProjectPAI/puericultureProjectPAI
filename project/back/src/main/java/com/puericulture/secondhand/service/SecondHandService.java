package com.puericulture.secondhand.service;

import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.ProductCategory;
import com.puericulture.common.entity.ProductImage;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.common.repository.ProductImageRepository;
import com.puericulture.secondhand.dto.SecondHandDto;
import com.puericulture.secondhand.dto.SecondHandRequest;
import com.puericulture.secondhand.entity.SecondHand;
import com.puericulture.secondhand.mapper.SecondHandMapper;
import com.puericulture.secondhand.repository.SecondHandRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SecondHandService {

    private final SecondHandRepository secondHandRepository;
    private final SecondHandMapper secondHandMapper;
    private final PersonRepository personRepository;
    private final ProductImageRepository productImageRepository;

    public SecondHandService(
            SecondHandRepository secondHandRepository,
            SecondHandMapper secondHandMapper,
            PersonRepository personRepository,
            ProductImageRepository productImageRepository) {
        this.secondHandRepository = secondHandRepository;
        this.secondHandMapper = secondHandMapper;
        this.personRepository = personRepository;
        this.productImageRepository = productImageRepository;
    }

    @Transactional
    public SecondHandDto createSecondHand(SecondHandRequest request, UUID authorId) {
        Person author =
                personRepository
                        .findById(authorId)
                        .orElseThrow(() -> new IllegalArgumentException("Person not found"));

        SecondHand secondHand = new SecondHand();
        secondHand.setPostTitle(request.getTitle());
        secondHand.setDescription(request.getDescription());
        secondHand.setPostDate(LocalDateTime.now());
        secondHand.setCity(request.getCity());
        secondHand.setCategory(ProductCategory.fromLabel(request.getCategory()));
        secondHand.setAuthor(author);
        secondHand.setPrice(request.getPrice());

        SecondHand saved = secondHandRepository.save(secondHand);

        if (request.getImageReference() != null && !request.getImageReference().isBlank()) {
            ProductImage image = new ProductImage();
            image.setProductId(saved.getId());
            image.setImageUrl(request.getImageReference());
            image.setImagePosition(1);
            productImageRepository.save(image);
        }

        return secondHandMapper.toDto(saved);
    }
}

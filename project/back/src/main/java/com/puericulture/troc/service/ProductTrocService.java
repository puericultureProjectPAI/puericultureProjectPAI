package com.puericulture.troc.service;

import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.ProductCategory;
import com.puericulture.common.entity.ProductImage;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.ProductTrocDto;
import com.puericulture.troc.dto.TrocRequest;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.entity.ProductTrocStatus;
import com.puericulture.troc.mapper.ProductTrocMapper;
import com.puericulture.troc.repository.ProductTrocRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductTrocService {

    private final ProductTrocRepository trocRepository;

    private final ProductTrocMapper trocMapper;

    private final PersonRepository personRepository;

    public ProductTrocService(
            ProductTrocRepository trocRepository,
            ProductTrocMapper trocMapper,
            PersonRepository personRepository) {
        this.trocRepository = trocRepository;
        this.trocMapper = trocMapper;
        this.personRepository = personRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductTrocDto> findAllAvailable() {
        return trocRepository.findByStatus(ProductTrocStatus.AVAILABLE).stream()
                .map(trocMapper::toDto)
                .toList();
    }

    @Transactional
    public ProductTrocDto createTroc(TrocRequest request, UUID authorId) {
        if (request == null) {
            throw new IllegalArgumentException("Troc request is required");
        }

        Person author =
                personRepository
                        .findById(authorId)
                        .orElseThrow(() -> new NotFoundException("Authenticated person not found"));

        ProductTroc troc = new ProductTroc();
        troc.setPostTitle(request.getTitle());
        troc.setDescription(request.getDescription());
        troc.setPostDate(LocalDateTime.now());
        troc.setCity(request.getCity());
        troc.setCategory(ProductCategory.fromLabel(request.getCategory()));
        troc.setAuthor(author);
        troc.setEstimatedPrice(request.getEstimatedPrice());
        troc.setCondition(request.getCondition());

        troc.setDimensions(request.getDimensions());
        troc.setMaxWeightKg(request.getMaxWeightKg());
        troc.setMinAgeMonths(request.getMinAgeMonths());
        troc.setMaxAgeMonths(request.getMaxAgeMonths());
        troc.setCondition(request.getCondition());

        List<String> imageUrls = request.getImages();
        if (imageUrls != null) {
            for (int i = 0; i < imageUrls.size(); i++) {
                ProductImage image = new ProductImage();
                image.setProduct(troc);
                image.setImageUrl(imageUrls.get(i));
                image.setPosition(i + 1);
                troc.getImages().add(image);
            }
        }

        ProductTroc createdTroc = trocRepository.save(troc);
        return trocMapper.toDto(createdTroc);
    }
}

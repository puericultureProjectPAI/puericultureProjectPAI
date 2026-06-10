package com.puericulture.troc.service;

import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.ProductCategory;
import com.puericulture.common.entity.ProductImage;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.troc.dto.ProductTrocDetailDto;
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
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Authenticated person not found"));

        ProductTroc troc = new ProductTroc();
        troc.setPostTitle(request.getTitle());
        troc.setDescription(request.getDescription());
        troc.setPostDate(LocalDateTime.now());
        troc.setCity(request.getCity());
        troc.setCategory(ProductCategory.fromLabel(request.getCategory()));
        troc.setAuthor(author);
        troc.setEstimatedPrice(request.getEstimatedPrice());

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

    @Transactional(readOnly = true)
    public ProductTrocDetailDto getTrocDetail(Long id) {
        ProductTroc troc =
                trocRepository
                        .findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Troc not found"));

        ProductTrocDto baseDto = trocMapper.toDto(troc);

        ProductTrocDetailDto dto = new ProductTrocDetailDto();

        org.springframework.beans.BeanUtils.copyProperties(baseDto, dto);

        // Map image URLs from attached images on Product
        var images = troc.getImages();
        if (images != null && !images.isEmpty()) {
            java.util.List<String> urls = new java.util.ArrayList<>();
            images.forEach(img -> urls.add(img.getImageUrl()));
            dto.setImageUrls(urls);
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public java.util.List<ProductTrocDto> findMyAvailableProducts(UUID authorId) {
        java.util.List<ProductTroc> trocs =
                trocRepository.findByAuthorIdAndStatus(authorId, ProductTrocStatus.AVAILABLE);

        java.util.List<ProductTrocDto> dtos = new java.util.ArrayList<>();
        for (ProductTroc troc : trocs) {
            dtos.add(trocMapper.toDto(troc));
        }

        return dtos;
    }
}

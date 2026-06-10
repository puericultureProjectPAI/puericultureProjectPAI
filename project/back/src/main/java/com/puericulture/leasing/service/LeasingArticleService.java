package com.puericulture.leasing.service;

import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.ProductCategory;
import com.puericulture.common.entity.ProductImage;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.common.repository.ProductImageRepository;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.leasing.dto.LeasingArticleDetailDto;
import com.puericulture.leasing.dto.LeasingArticleRequest;
import com.puericulture.leasing.entity.LeasingArticle;
import com.puericulture.leasing.mapper.LeasingArticleMapper;
import com.puericulture.leasing.repository.LeasingArticleRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LeasingArticleService {

    private final LeasingArticleRepository leasingArticleRepository;
    private final LeasingArticleMapper leasingArticleMapper;
    private final PersonRepository personRepository;
    private final ProductImageRepository productImageRepository;

    @Transactional(readOnly = true)
    public LeasingArticleDetailDto getArticleDetail(Long id) {
        return leasingArticleRepository
                .findByIdWithImages(id)
                .map(leasingArticleMapper::toDetailDto)
                .orElseThrow(
                        () ->
                                new NotFoundException(
                                        "Article leasing introuvable avec l'id : " + id));
    }

    @Transactional
    public LeasingArticleDetailDto createArticle(LeasingArticleRequest request, String authorId) {
        Person author =
                personRepository
                        .findById(UUID.fromString(authorId))
                        .orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));

        LeasingArticle article = new LeasingArticle();
        article.setPostTitle(request.getTitle());
        article.setDescription(request.getDescription());
        article.setCity(request.getCity());
        article.setCategory(ProductCategory.fromLabel(request.getCategory()));
        article.setCondition(request.getCondition());
        article.setBrand(request.getBrand());
        article.setDimensions(request.getDimensions());
        article.setMinAgeMonths(request.getMinAgeMonths());
        article.setMaxAgeMonths(request.getMaxAgeMonths());
        article.setMaxWeightKg(request.getMaxWeightKg());
        article.setPricePerDay(request.getPricePerDay());
        article.setPricePerMonth(request.getPricePerMonth());
        article.setAuthor(author);
        article.setPostDate(LocalDateTime.now());

        LeasingArticle saved = leasingArticleRepository.save(article);

        List<String> imageUrls = request.getImages();
        if (imageUrls != null) {
            for (int i = 0; i < imageUrls.size(); i++) {
                ProductImage image = new ProductImage();
                image.setProduct(saved);
                image.setImageUrl(imageUrls.get(i));
                image.setPosition(i + 1);
                productImageRepository.save(image);
            }
        }

        return leasingArticleRepository
                .findByIdWithImages(saved.getId())
                .map(leasingArticleMapper::toDetailDto)
                .orElseThrow();
    }
}

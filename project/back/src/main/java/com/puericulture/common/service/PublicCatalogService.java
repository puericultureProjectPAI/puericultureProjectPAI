package com.puericulture.common.service;

import com.puericulture.common.dto.ProductCardDto;
import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.Product;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.common.repository.ProductRepository;
import com.puericulture.forwardtrading.entity.ChildrenEntity;
import com.puericulture.leasing.entity.LeasingArticle;
import com.puericulture.secondhand.entity.SecondHand;
import com.puericulture.troc.entity.ProductTroc;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PublicCatalogService {

    private final ProductRepository productRepository;
    private final PersonRepository personRepository;

    @Transactional(readOnly = true)
    public List<ProductCardDto> getProductsByAgeRange(Integer minAge, Integer maxAge) {
        List<Product> products = productRepository.findProductsByAgeRange(minAge, maxAge);

        return products.stream().map(this::mapToGlobalDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductCardDto> getRecommendations(String userId) {
        if (userId == null) {
            return Collections.emptyList();
        }

        Person person = personRepository.findById(UUID.fromString(userId)).orElse(null);
        if (person == null || person.getChildren() == null || person.getChildren().isEmpty()) {
            return Collections.emptyList();
        }

        Set<Product> recommendedProducts = new HashSet<>();
        LocalDate now = LocalDate.now();

        for (ChildrenEntity child : person.getChildren()) {
            if (child.getBirthDate() != null) {
                LocalDate birth = child.getBirthDate().toLocalDate();
                long months = ChronoUnit.MONTHS.between(birth, now);
                int ageMonths = (int) Math.max(0, months);
                List<Product> products =
                        productRepository.findProductsByAgeRange(ageMonths, ageMonths);
                recommendedProducts.addAll(products);
            }
        }

        return recommendedProducts.stream().map(this::mapToGlobalDto).collect(Collectors.toList());
    }

    private ProductCardDto mapToGlobalDto(Product product) {
        String firstImageUrl = null;
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            firstImageUrl = product.getImages().get(0).getImageUrl();
        }

        ProductCardDto.ProductCardDtoBuilder builder =
                ProductCardDto.builder()
                        .id(product.getId())
                        .postTitle(product.getPostTitle())
                        .firstImageUrl(firstImageUrl);

        if (product instanceof LeasingArticle) {
            LeasingArticle leasing = (LeasingArticle) product;
            builder.productType("Location")
                    .price(leasing.getPricePerMonth())
                    .priceSuffix("€/mois")
                    .actionUrl("/leasing/products/" + leasing.getId());
        } else if (product instanceof SecondHand) {
            SecondHand secondHand = (SecondHand) product;
            builder.productType("Seconde main")
                    .price(secondHand.getPrice())
                    .priceSuffix("€")
                    .actionUrl("/second-hand/products/" + secondHand.getId());
        } else if (product instanceof ProductTroc) {
            ProductTroc troc = (ProductTroc) product;
            builder.productType("Troc")
                    .price(troc.getEstimatedPrice())
                    .priceSuffix("€")
                    .actionUrl("/troc/products/" + troc.getId());
        } else {
            builder.productType("Autre").price(0L).priceSuffix("€").actionUrl("/");
        }

        return builder.build();
    }
}

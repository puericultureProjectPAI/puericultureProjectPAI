package com.puericulture.common.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import com.puericulture.common.dto.ProductCardDto;
import com.puericulture.common.entity.Product;
import com.puericulture.common.repository.ProductRepository;
import com.puericulture.leasing.entity.LeasingArticle;
import com.puericulture.secondhand.entity.SecondHand;
import com.puericulture.troc.entity.ProductTroc;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class PublicCatalogServiceTest {

    @Mock private ProductRepository productRepository;

    @InjectMocks private PublicCatalogService publicCatalogService;

    private LeasingArticle leasingArticle;
    private SecondHand secondHand;
    private ProductTroc productTroc;

    @BeforeEach
    void setUp() {
        leasingArticle = new LeasingArticle();
        leasingArticle.setId(1L);
        leasingArticle.setPostTitle("Poussette");
        leasingArticle.setPricePerMonth(30L);

        secondHand = new SecondHand();
        secondHand.setId(2L);
        secondHand.setPostTitle("Lit Bébé");
        secondHand.setPrice(100L);

        productTroc = new ProductTroc();
        productTroc.setId(3L);
        productTroc.setPostTitle("Vêtements");
        productTroc.setEstimatedPrice(20L);
    }

    @Test
    void shouldReturnMixedProductsWithCorrectMapping() {
        List<Product> mockProducts = Arrays.asList(leasingArticle, secondHand, productTroc);
        when(productRepository.findProductsByAgeRange(0, 3)).thenReturn(mockProducts);

        List<ProductCardDto> result = publicCatalogService.getProductsByAgeRange(0, 3);

        assertEquals(3, result.size());

        ProductCardDto leasingDto = result.get(0);
        assertEquals("Location", leasingDto.getProductType());
        assertEquals(30L, leasingDto.getPrice());
        assertEquals("€/mois", leasingDto.getPriceSuffix());
        assertEquals("/leasing/products/1", leasingDto.getActionUrl());

        ProductCardDto secondHandDto = result.get(1);
        assertEquals("Seconde main", secondHandDto.getProductType());
        assertEquals(100L, secondHandDto.getPrice());
        assertEquals("€", secondHandDto.getPriceSuffix());
        assertEquals("/second-hand/products/2", secondHandDto.getActionUrl());

        ProductCardDto trocDto = result.get(2);
        assertEquals("Troc", trocDto.getProductType());
        assertEquals(20L, trocDto.getPrice());
        assertEquals("€", trocDto.getPriceSuffix());
        assertEquals("/troc/products/3", trocDto.getActionUrl());
    }
}

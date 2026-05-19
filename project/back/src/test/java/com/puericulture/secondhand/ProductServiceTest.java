package com.puericulture.secondhand;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import com.puericulture.common.entity.ProductCategory;
import com.puericulture.common.mapper.ExternalProductMapper;
import com.puericulture.secondhand.dto.PriceComparisonDTO;
import com.puericulture.secondhand.dto.ProductResponseDTO;
import com.puericulture.secondhand.entity.ExternalProduct;
import com.puericulture.secondhand.repository.ExternalProductRepository;
import com.puericulture.secondhand.repository.SecondHandProductRepository;
import com.puericulture.secondhand.service.ProductService;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock private ExternalProductRepository externalProductRepository;
    @Mock private SecondHandProductRepository secondHandProductRepository;
    @Mock private ExternalProductMapper externalProductMapper;

    @InjectMocks private ProductService productService;

    private static final String EAN = "3294680003292";

    @Test
    void getProduct_found_returnsProduct() {
        ExternalProduct entity = new ExternalProduct();
        entity.setEan(EAN);
        entity.setName("Poussette Yoyo");
        entity.setCategory("POUSSETTE");
        entity.setPrice(899.0);

        ProductResponseDTO dto =
                new ProductResponseDTO("1", "Poussette Yoyo", "Babyzen", "POUSSETTE", null, 899.0);

        when(externalProductRepository.findByEan(EAN)).thenReturn(Optional.of(entity));
        when(externalProductMapper.toDto(entity)).thenReturn(dto);

        ProductResponseDTO result = productService.getProduct(EAN);

        assertNotNull(result);
        assertEquals("Poussette Yoyo", result.getName());
        assertEquals(899.0, result.getPrice());
    }

    @Test
    void getProduct_notFound_returnsNull() {
        when(externalProductRepository.findByEan(EAN)).thenReturn(Optional.empty());

        ProductResponseDTO result = productService.getProduct(EAN);

        assertNull(result);
    }

    @Test
    void getPriceComparison_unknownCategory_returnsZero() {
        PriceComparisonDTO result = productService.getPriceComparison("CATEGORIE_INCONNUE", 899.0);

        assertEquals(0L, result.getListingsCount());
        assertNull(result.getAverageOccasionPrice());
    }

    @Test
    void getPriceComparison_withListings_calculatesSavings() {
        String label = "Poussettes, porte-bébés et sièges auto";
        ProductCategory category = ProductCategory.TRANSPORT_BEBE;

        when(secondHandProductRepository.countActiveListingsByCategory(category)).thenReturn(5L);
        when(secondHandProductRepository.findAveragePriceByCategory(category)).thenReturn(449.67);

        PriceComparisonDTO result = productService.getPriceComparison(label, 899.0);

        assertEquals(449.67, result.getAverageOccasionPrice());
        assertEquals(449.33, result.getSavingsAmount());
        assertFalse(result.isLowSampleWarning());
    }

    @Test
    void getPriceComparison_fewListings_lowSampleWarningTrue() {
        String label = "Poussettes, porte-bébés et sièges auto";
        ProductCategory category = ProductCategory.TRANSPORT_BEBE;

        when(secondHandProductRepository.countActiveListingsByCategory(category)).thenReturn(2L);
        when(secondHandProductRepository.findAveragePriceByCategory(category)).thenReturn(450.0);

        PriceComparisonDTO result = productService.getPriceComparison(label, 899.0);

        assertTrue(result.isLowSampleWarning());
    }
}

package com.puericulture.leasing.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.puericulture.leasing.dto.LeasingProductSummary;
import com.puericulture.leasing.dto.LeasingProductSummaryDto;
import com.puericulture.leasing.repository.LeasingProductRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LeasingProductServiceTest {

    @Mock private LeasingProductRepository leasingProductRepository;

    @InjectMocks private LeasingProductService leasingProductService;

    @Mock private LeasingProductSummary mockSummary;

    @Test
    void findAll_returnsMappedDto_whenProductIsAvailable() {
        when(mockSummary.getId()).thenReturn(1L);
        when(mockSummary.getPostTitle()).thenReturn("Poussette Yoyo");
        when(mockSummary.getCategory()).thenReturn("Poussette");
        when(mockSummary.getCity()).thenReturn("Paris");
        when(mockSummary.getPricePerDay()).thenReturn(5L);
        when(mockSummary.getPricePerMonth()).thenReturn(90L);
        when(mockSummary.getCondition()).thenReturn("Très bon état");
        when(mockSummary.getFirstImageUrl()).thenReturn("https://example.com/img.jpg");
        when(mockSummary.getAvailable()).thenReturn(true);
        when(leasingProductRepository.findAllWithAvailability()).thenReturn(List.of(mockSummary));

        List<LeasingProductSummaryDto> result = leasingProductService.findAll();

        verify(leasingProductRepository).findAllWithAvailability();
        assertThat(result).hasSize(1);
        LeasingProductSummaryDto dto = result.get(0);
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getPostTitle()).isEqualTo("Poussette Yoyo");
        assertThat(dto.getCategory()).isEqualTo("Poussette");
        assertThat(dto.getCity()).isEqualTo("Paris");
        assertThat(dto.getPricePerDay()).isEqualTo(5L);
        assertThat(dto.getPricePerMonth()).isEqualTo(90L);
        assertThat(dto.getCondition()).isEqualTo("Très bon état");
        assertThat(dto.getFirstImageUrl()).isEqualTo("https://example.com/img.jpg");
        assertThat(dto.isAvailable()).isTrue();
    }

    @Test
    void findAll_setsAvailableFalse_whenProductIsUnavailable() {
        when(mockSummary.getId()).thenReturn(6L);
        when(mockSummary.getPostTitle()).thenReturn("Baignoire bébé ergonomique");
        when(mockSummary.getCategory()).thenReturn("Bain");
        when(mockSummary.getCity()).thenReturn("Nantes");
        when(mockSummary.getPricePerDay()).thenReturn(1L);
        when(mockSummary.getPricePerMonth()).thenReturn(18L);
        when(mockSummary.getCondition()).thenReturn("Excellent état");
        when(mockSummary.getFirstImageUrl()).thenReturn("https://example.com/baignoire.jpg");
        when(mockSummary.getAvailable()).thenReturn(false);
        when(leasingProductRepository.findAllWithAvailability()).thenReturn(List.of(mockSummary));

        List<LeasingProductSummaryDto> result = leasingProductService.findAll();

        verify(leasingProductRepository).findAllWithAvailability();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).isAvailable()).isFalse();
    }

    @Test
    void findAll_returnsEmptyList_whenNoProductsExist() {
        when(leasingProductRepository.findAllWithAvailability()).thenReturn(List.of());

        List<LeasingProductSummaryDto> result = leasingProductService.findAll();

        verify(leasingProductRepository).findAllWithAvailability();
        assertThat(result).isEmpty();
    }
}

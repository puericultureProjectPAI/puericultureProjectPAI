package com.puericulture.leasing.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.puericulture.leasing.dto.LeasingProductSummary;
import com.puericulture.leasing.dto.LeasingProductSummaryDto;
import com.puericulture.leasing.mapper.LeasingProductMapper;
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
    @Mock private LeasingProductMapper leasingProductMapper;
    @InjectMocks private LeasingProductService leasingProductService;

    @Mock private LeasingProductSummary mockSummary;

    @Test
    void findAll_returnsMappedDto_whenProductIsAvailable() {
        LeasingProductSummaryDto dto =
                LeasingProductSummaryDto.builder()
                        .id(1L)
                        .postTitle("Poussette Yoyo")
                        .category("Poussette")
                        .city("Paris")
                        .pricePerDay(5L)
                        .pricePerMonth(90L)
                        .condition("Très bon état")
                        .firstImageUrl("https://example.com/img.jpg")
                        .available(true)
                        .build();
        when(leasingProductRepository.findAllWithAvailability()).thenReturn(List.of(mockSummary));
        when(leasingProductMapper.toDto(mockSummary)).thenReturn(dto);

        List<LeasingProductSummaryDto> result = leasingProductService.findAll();

        verify(leasingProductRepository).findAllWithAvailability();
        verify(leasingProductMapper).toDto(mockSummary);
        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(dto);
    }

    @Test
    void findAll_returnsMappedDto_whenProductIsUnavailable() {
        LeasingProductSummaryDto dto =
                LeasingProductSummaryDto.builder()
                        .id(6L)
                        .postTitle("Baignoire bébé ergonomique")
                        .available(false)
                        .build();
        when(leasingProductRepository.findAllWithAvailability()).thenReturn(List.of(mockSummary));
        when(leasingProductMapper.toDto(mockSummary)).thenReturn(dto);

        List<LeasingProductSummaryDto> result = leasingProductService.findAll();

        verify(leasingProductRepository).findAllWithAvailability();
        verify(leasingProductMapper).toDto(mockSummary);
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

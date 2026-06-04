package com.puericulture.leasing.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.puericulture.leasing.dto.LeasingFilterRequest;
import com.puericulture.leasing.dto.LeasingProductSummary;
import com.puericulture.leasing.dto.LeasingProductSummaryDto;
import com.puericulture.leasing.exception.InvalidFilterCriteriaException;
import com.puericulture.leasing.mapper.LeasingProductMapper;
import com.puericulture.leasing.repository.LeasingProductRepository;
import java.time.LocalDate;
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

    @Test
    void filter_returnsByCity_whenOnlyCityProvided() {
        LeasingFilterRequest request = LeasingFilterRequest.builder().city("Paris").build();
        when(leasingProductRepository.findByCityWithAvailability("Paris"))
                .thenReturn(List.of(mockSummary));
        when(leasingProductMapper.toDto(mockSummary))
                .thenReturn(LeasingProductSummaryDto.builder().id(1L).city("Paris").build());

        List<LeasingProductSummaryDto> result = leasingProductService.filter(request);

        verify(leasingProductRepository).findByCityWithAvailability("Paris");
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCity()).isEqualTo("Paris");
    }

    @Test
    void filter_returnsByDates_whenOnlyDatesProvided() {
        LocalDate start = LocalDate.now().plusDays(1);
        LocalDate end = LocalDate.now().plusDays(7);
        LeasingFilterRequest request =
                LeasingFilterRequest.builder().startDate(start).endDate(end).build();
        when(leasingProductRepository.findAvailableByDateRange(start, end))
                .thenReturn(List.of(mockSummary));
        when(leasingProductMapper.toDto(mockSummary))
                .thenReturn(LeasingProductSummaryDto.builder().id(1L).available(true).build());

        List<LeasingProductSummaryDto> result = leasingProductService.filter(request);

        verify(leasingProductRepository).findAvailableByDateRange(start, end);
        assertThat(result).hasSize(1);
    }

    @Test
    void filter_returnsByCityAndDates_whenBothProvided() {
        LocalDate start = LocalDate.now().plusDays(1);
        LocalDate end = LocalDate.now().plusDays(14);
        LeasingFilterRequest request =
                LeasingFilterRequest.builder().city("Lyon").startDate(start).endDate(end).build();
        when(leasingProductRepository.findByCityAndAvailableByDateRange("Lyon", start, end))
                .thenReturn(List.of(mockSummary));
        when(leasingProductMapper.toDto(mockSummary))
                .thenReturn(LeasingProductSummaryDto.builder().id(1L).city("Lyon").build());

        List<LeasingProductSummaryDto> result = leasingProductService.filter(request);

        verify(leasingProductRepository).findByCityAndAvailableByDateRange("Lyon", start, end);
        assertThat(result).hasSize(1);
    }

    @Test
    void filter_throwsException_whenNoCriteriaProvided() {
        LeasingFilterRequest request = LeasingFilterRequest.builder().build();

        assertThatThrownBy(() -> leasingProductService.filter(request))
                .isInstanceOf(InvalidFilterCriteriaException.class)
                .hasMessage("Au moins un critère de filtrage doit être fourni (ville et/ou dates)");
    }

    @Test
    void filter_throwsException_whenStartDateInPast() {
        LeasingFilterRequest request =
                LeasingFilterRequest.builder()
                        .startDate(LocalDate.of(2020, 1, 1))
                        .endDate(LocalDate.of(2020, 1, 31))
                        .build();

        assertThatThrownBy(() -> leasingProductService.filter(request))
                .isInstanceOf(InvalidFilterCriteriaException.class)
                .hasMessage("La date de début ne peut pas être dans le passé");
    }

    @Test
    void filter_throwsException_whenEndDateBeforeStartDate() {
        LeasingFilterRequest request =
                LeasingFilterRequest.builder()
                        .city("Paris")
                        .startDate(LocalDate.now().plusDays(10))
                        .endDate(LocalDate.now().plusDays(1))
                        .build();

        assertThatThrownBy(() -> leasingProductService.filter(request))
                .isInstanceOf(InvalidFilterCriteriaException.class)
                .hasMessage("La date de fin doit être après la date de début");
    }

    @Test
    void getAvailableCities_returnsListOfCities() {
        when(leasingProductRepository.findAllAvailableCities())
                .thenReturn(List.of("Bordeaux", "Lyon", "Paris"));

        List<String> result = leasingProductService.getAvailableCities();

        verify(leasingProductRepository).findAllAvailableCities();
        assertThat(result).containsExactly("Bordeaux", "Lyon", "Paris");
    }
}

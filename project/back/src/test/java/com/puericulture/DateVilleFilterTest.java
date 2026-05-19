package com.puericulture;

import com.puericulture.leasing.dto.LeasingFilterRequest;
import com.puericulture.leasing.dto.ProductLeasingResponse;
import com.puericulture.leasing.entity.ProductLeasing;
import com.puericulture.leasing.exception.InvalidFilterCriteriaException;
import com.puericulture.leasing.mapper.ProductLeasingMapper;
import com.puericulture.leasing.repository.ProductLeasingRepository;
import com.puericulture.leasing.service.ProductLeasingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class DateVilleFilterTest {

    @Mock
    private ProductLeasingRepository mockRepository;

    @Mock
    private ProductLeasingMapper mockMapper;

    @InjectMocks
    private ProductLeasingService productLeasingService;

    private ProductLeasing mockProduct;
    private ProductLeasingResponse mockDto;

    @BeforeEach
    void setUp() {
        mockProduct = new ProductLeasing();
        mockProduct.setId(1L);
        mockProduct.setPostTitle("Poussette Yoyo");
        mockProduct.setDescription("Poussette légère et compacte");
        mockProduct.setCity("Paris");
        mockProduct.setCategory("Poussette");
        mockProduct.setBrand("Babyzen");
        mockProduct.setModel("Yoyo 2");
        mockProduct.setPostDate(LocalDateTime.now());
        mockProduct.setPricePerDay(5L);
        mockProduct.setPricePerMonth(90L);

        mockDto = ProductLeasingResponse.builder()
                .productId(1L)
                .postTitle("Poussette Yoyo")
                .description("Poussette légère et compacte")
                .city("Paris")
                .category("Poussette")
                .brand("Babyzen")
                .model("Yoyo 2")
                .pricePerDay(5L)
                .pricePerMonth(90L)
                .build();
    }

    @Test
    void findAll_returnsMappedDto_whenProductIsAvailable() {
        when(mockRepository.findAllWithLeasing()).thenReturn(List.of(mockProduct));
        when(mockMapper.toProductLeasingResponse(mockProduct)).thenReturn(mockDto);

        List<ProductLeasingResponse> result = productLeasingService.findAll();

        assertThat(result).hasSize(1);
        ProductLeasingResponse dto = result.get(0);
        assertThat(dto.getProductId()).isEqualTo(1L);
        assertThat(dto.getPostTitle()).isEqualTo("Poussette Yoyo");
        assertThat(dto.getCategory()).isEqualTo("Poussette");
        assertThat(dto.getCity()).isEqualTo("Paris");
        assertThat(dto.getPricePerDay()).isEqualTo(5L);
        assertThat(dto.getPricePerMonth()).isEqualTo(90L);
        assertThat(dto.getBrand()).isEqualTo("Babyzen");
        assertThat(dto.getModel()).isEqualTo("Yoyo 2");
    }

    @Test
    void filter_returnsByCity_whenOnlyCityProvided() {
        LeasingFilterRequest filterRequest = LeasingFilterRequest.builder()
                .city("Paris")
                .build();

        when(mockRepository.findByCity("Paris")).thenReturn(List.of(mockProduct));
        when(mockMapper.toProductLeasingResponse(mockProduct)).thenReturn(mockDto);

        List<ProductLeasingResponse> result = productLeasingService.filter(filterRequest);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCity()).isEqualTo("Paris");
    }

    @Test
    void filter_returnsByDates_whenOnlyDatesProvided() {
        LocalDate startDate = LocalDate.of(2025, 6, 1);
        LocalDate endDate = LocalDate.of(2025, 6, 30);

        LeasingFilterRequest filterRequest = LeasingFilterRequest.builder()
                .startDate(startDate)
                .endDate(endDate)
                .build();

        when(mockRepository.findByDateRange(startDate, endDate)).thenReturn(List.of(mockProduct));
        when(mockMapper.toProductLeasingResponse(mockProduct)).thenReturn(mockDto);

        List<ProductLeasingResponse> result = productLeasingService.filter(filterRequest);

        assertThat(result).hasSize(1);
    }

    @Test
    void filter_returnsByLocationAndDates_whenBothProvided() {
        LocalDate startDate = LocalDate.of(2025, 6, 1);
        LocalDate endDate = LocalDate.of(2025, 6, 30);

        LeasingFilterRequest filterRequest = LeasingFilterRequest.builder()
                .city("Paris")
                .startDate(startDate)
                .endDate(endDate)
                .build();

        when(mockRepository.findByLocationAndDates("Paris", startDate, endDate))
                .thenReturn(List.of(mockProduct));
        when(mockMapper.toProductLeasingResponse(mockProduct)).thenReturn(mockDto);

        List<ProductLeasingResponse> result = productLeasingService.filter(filterRequest);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCity()).isEqualTo("Paris");
    }

    @Test
    void filter_throwsException_whenNoCriteriaProvided() {
        LeasingFilterRequest filterRequest = LeasingFilterRequest.builder().build();

        assertThatThrownBy(() -> productLeasingService.filter(filterRequest))
                .isInstanceOf(InvalidFilterCriteriaException.class)
                .hasMessage("Au moins un critère de filtrage doit être fourni (ville et/ou dates)");
    }

    @Test
    void filter_throwsException_whenDatesInvalid() {
        LocalDate startDate = LocalDate.of(2025, 6, 30);
        LocalDate endDate = LocalDate.of(2025, 6, 1);

        LeasingFilterRequest filterRequest = LeasingFilterRequest.builder()
                .city("Paris")
                .startDate(startDate)
                .endDate(endDate)
                .build();

        assertThatThrownBy(() -> productLeasingService.filter(filterRequest))
                .isInstanceOf(InvalidFilterCriteriaException.class)
                .hasMessage("La date de fin doit être après la date de début");
    }

    @Test
    void getAvailableCities_returnsListOfCities() {
        List<String> cities = List.of("Paris", "Lyon", "Bordeaux");
        when(mockRepository.findAllAvailableCities()).thenReturn(cities);

        List<String> result = productLeasingService.getAvailableCities();

        assertThat(result).hasSize(3);
        assertThat(result).contains("Paris", "Lyon", "Bordeaux");
    }
}

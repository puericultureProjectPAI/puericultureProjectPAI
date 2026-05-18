package com.puericulture;

import com.puericulture.leasing.service.ProductLeasingService;
import org.springframework.boot.test.context.SpringBootTest;
import com.puericulture.leasing.dto.LeasingFilterRequest;
import com.puericulture.leasing.dto.ProductLeasingResponse;
import com.puericulture.leasing.entity.Product;
import com.puericulture.leasing.entity.ProductLeasing;
import com.puericulture.leasing.exception.InvalidFilterCriteriaException;
import com.puericulture.leasing.mapper.ProductLeasingMapper;
import com.puericulture.leasing.repository.ProductLeasingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
public class DateVilleFilterTest {
    @Mock
    private ProductLeasingRepository mockRepository;

    @Mock
    private ProductLeasingMapper mockMapper;

    @InjectMocks
    private ProductLeasingService productLeasingService;

    private Product mockProduct;
    private ProductLeasingResponse mockDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup Product mock
        ProductLeasing leasing = ProductLeasing.builder()
                .id(1L)
                .pricePerDay(5L)
                .pricePerMonth(90L)
                .build();

        mockProduct = Product.builder()
                .id(1L)
                .postTitle("Poussette Yoyo")
                .description("Poussette légère et compacte")
                .city("Paris")
                .category("Poussette")
                .brand("Babyzen")
                .model("Yoyo 2")
                .postDate(LocalDateTime.now())
                .productLeasing(leasing)
                .build();

        // Setup DTO mock (SEULEMENT les champs du DTO)
        mockDto = ProductLeasingResponse.builder()
                .productId(1L)
                .postTitle("Poussette Yoyo")
                .description("Poussette légère et compacte")
                .city("Paris")
                .category("Poussette")
                .brand("Babyzen")
                .model("Yoyo 2")
                .leasingId(1L)
                .pricePerDay(5L)
                .pricePerMonth(90L)
                .build();
    }

    /**
     * Test: Récupérer TOUS les produits en location
     */
    @Test
    void findAll_returnsMappedDto_whenProductIsAvailable() {
        // Arrange
        when(mockRepository.findAllWithLeasing()).thenReturn(List.of(mockProduct));
        when(mockMapper.toProductLeasingResponse(mockProduct)).thenReturn(mockDto);

        // Act
        List<ProductLeasingResponse> result = productLeasingService.findAll();

        // Assert
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

    /**
     * Test: Filtrer par VILLE seulement
     */
    @Test
    void filter_returnsByCity_whenOnlyCityProvided() {
        // Arrange
        LeasingFilterRequest filterRequest = LeasingFilterRequest.builder()
                .city("Paris")
                .build();

        when(mockRepository.findByCity("Paris")).thenReturn(List.of(mockProduct));
        when(mockMapper.toProductLeasingResponse(mockProduct)).thenReturn(mockDto);

        // Act
        List<ProductLeasingResponse> result = productLeasingService.filter(filterRequest);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCity()).isEqualTo("Paris");
    }

    /**
     * Test: Filtrer par DATES seulement
     */
    @Test
    void filter_returnsByDates_whenOnlyDatesProvided() {
        // Arrange
        LocalDate startDate = LocalDate.of(2025, 6, 1);
        LocalDate endDate = LocalDate.of(2025, 6, 30);

        LeasingFilterRequest filterRequest = LeasingFilterRequest.builder()
                .startDate(startDate)
                .endDate(endDate)
                .build();

        when(mockRepository.findByDateRange(startDate, endDate)).thenReturn(List.of(mockProduct));
        when(mockMapper.toProductLeasingResponse(mockProduct)).thenReturn(mockDto);

        // Act
        List<ProductLeasingResponse> result = productLeasingService.filter(filterRequest);

        // Assert
        assertThat(result).hasSize(1);
    }

    /**
     * Test: Filtrer par VILLE + DATES
     */
    @Test
    void filter_returnsByLocationAndDates_whenBothProvided() {
        // Arrange
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

        // Act
        List<ProductLeasingResponse> result = productLeasingService.filter(filterRequest);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCity()).isEqualTo("Paris");
    }

    /**
     * Test: Exception si AUCUN critère fourni
     */
    @Test
    void filter_throwsException_whenNoCriteriaProvided() {
        // Arrange
        LeasingFilterRequest filterRequest = LeasingFilterRequest.builder().build();

        // Act & Assert
        assertThatThrownBy(() -> productLeasingService.filter(filterRequest))
                .isInstanceOf(InvalidFilterCriteriaException.class)
                .hasMessage("Au moins un critère de filtrage doit être fourni (ville et/ou dates)");
    }

    /**
     * Test: Exception si dates invalides (endDate < startDate)
     */
    @Test
    void filter_throwsException_whenDatesInvalid() {
        // Arrange
        LocalDate startDate = LocalDate.of(2025, 6, 30);
        LocalDate endDate = LocalDate.of(2025, 6, 1);  // Avant startDate

        LeasingFilterRequest filterRequest = LeasingFilterRequest.builder()
                .city("Paris")
                .startDate(startDate)
                .endDate(endDate)
                .build();

        // Act & Assert
        assertThatThrownBy(() -> productLeasingService.filter(filterRequest))
                .isInstanceOf(InvalidFilterCriteriaException.class)
                .hasMessage("La date de fin doit être après la date de début");
    }

    /**
     * Test: Récupérer les villes disponibles
     */
    @Test
    void getAvailableCities_returnsListOfCities() {
        // Arrange
        List<String> cities = List.of("Paris", "Lyon", "Bordeaux");
        when(mockRepository.findAllAvailableCities()).thenReturn(cities);

        // Act
        List<String> result = productLeasingService.getAvailableCities();

        // Assert
        assertThat(result).hasSize(3);
        assertThat(result).contains("Paris", "Lyon", "Bordeaux");
    }

}

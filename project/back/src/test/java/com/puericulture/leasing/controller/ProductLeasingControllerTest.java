package com.puericulture.leasing.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.puericulture.config.errormanager.CustomGlobalExceptionHandler;
import com.puericulture.leasing.dto.LeasingFilterRequest;
import com.puericulture.leasing.dto.ProductLeasingResponse;
import com.puericulture.leasing.exception.InvalidFilterCriteriaException;
import com.puericulture.leasing.service.ProductLeasingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProductLeasingControllerTest {

    @Mock
    private ProductLeasingService productLeasingService;

    @InjectMocks
    private ProductLeasingController productLeasingController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private ProductLeasingResponse sampleProduct;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(productLeasingController)
                .setControllerAdvice(new CustomGlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        sampleProduct = ProductLeasingResponse.builder()
                .productId(1L)
                .postTitle("Poussette Yoyo")
                .city("Paris")
                .category("Poussette")
                .brand("Babyzen")
                .model("Yoyo 2")
                .postDate(LocalDateTime.now())
                .pricePerDay(500L)
                .pricePerMonth(9000L)
                .build();
    }

    // -------------------------------------------------------------------------
    // GET /product-leasing
    // -------------------------------------------------------------------------

    @Test
    void findAll_returns200_withProductList() throws Exception {
        when(productLeasingService.findAll()).thenReturn(List.of(sampleProduct));

        mockMvc.perform(get("/product-leasing"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.count").value(1))
                .andExpect(jsonPath("$.data[0].productId").value(1))
                .andExpect(jsonPath("$.data[0].city").value("Paris"));
    }

    @Test
    void findAll_returns200_withEmptyList_whenNoProducts() throws Exception {
        when(productLeasingService.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/product-leasing"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(0))
                .andExpect(jsonPath("$.data").isEmpty());
    }

    // -------------------------------------------------------------------------
    // POST /product-leasing/filter
    // -------------------------------------------------------------------------

    @Test
    void filter_returns200_withResults_whenFilterByCity() throws Exception {
        LeasingFilterRequest request = LeasingFilterRequest.builder()
                .city("Paris")
                .build();

        when(productLeasingService.filter(any())).thenReturn(List.of(sampleProduct));

        mockMvc.perform(post("/product-leasing/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.count").value(1))
                .andExpect(jsonPath("$.data[0].city").value("Paris"));
    }

    @Test
    void filter_returns200_withResults_whenFilterByDates() throws Exception {
        LeasingFilterRequest request = LeasingFilterRequest.builder()
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(7))
                .build();

        when(productLeasingService.filter(any())).thenReturn(List.of(sampleProduct));

        mockMvc.perform(post("/product-leasing/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(1));
    }

    @Test
    void filter_returns200_withResults_whenFilterByCityAndDates() throws Exception {
        LeasingFilterRequest request = LeasingFilterRequest.builder()
                .city("Lyon")
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(14))
                .build();

        when(productLeasingService.filter(any())).thenReturn(List.of(sampleProduct));

        mockMvc.perform(post("/product-leasing/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(1));
    }

    @Test
    void filter_returns200_withMessage_whenNoResultsFound() throws Exception {
        LeasingFilterRequest request = LeasingFilterRequest.builder()
                .city("Bordeaux")
                .build();

        when(productLeasingService.filter(any())).thenReturn(List.of());

        mockMvc.perform(post("/product-leasing/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(0))
                .andExpect(jsonPath("$.message").value("Aucun produit trouvé pour ces critères"));
    }

    @Test
    void filter_returns400_whenNoCriteriaProvided() throws Exception {
        LeasingFilterRequest request = LeasingFilterRequest.builder().build();

        when(productLeasingService.filter(any()))
                .thenThrow(new InvalidFilterCriteriaException(
                        "Au moins un critère de filtrage doit être fourni (ville et/ou dates)"));

        mockMvc.perform(post("/product-leasing/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void filter_returns400_whenEndDateBeforeStartDate() throws Exception {
        LeasingFilterRequest request = LeasingFilterRequest.builder()
                .city("Paris")
                .startDate(LocalDate.now().plusDays(10))
                .endDate(LocalDate.now().plusDays(1))
                .build();

        when(productLeasingService.filter(any()))
                .thenThrow(new InvalidFilterCriteriaException(
                        "La date de fin doit être après la date de début"));

        mockMvc.perform(post("/product-leasing/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void filter_returns400_whenStartDateIsInThePast() throws Exception {
        LeasingFilterRequest request = LeasingFilterRequest.builder()
                .startDate(LocalDate.of(2020, 1, 1))
                .endDate(LocalDate.of(2020, 1, 31))
                .build();

        when(productLeasingService.filter(any()))
                .thenThrow(new InvalidFilterCriteriaException(
                        "La date de début ne peut pas être dans le passé"));

        mockMvc.perform(post("/product-leasing/filter")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // -------------------------------------------------------------------------
    // GET /product-leasing/cities
    // -------------------------------------------------------------------------

    @Test
    void getCities_returns200_withCityList() throws Exception {
        when(productLeasingService.getAvailableCities())
                .thenReturn(List.of("bordeaux", "lyon", "paris"));

        mockMvc.perform(get("/product-leasing/cities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.count").value(3))
                .andExpect(jsonPath("$.data[0]").value("bordeaux"));
    }

    @Test
    void getCities_returns200_withEmptyList_whenNoCities() throws Exception {
        when(productLeasingService.getAvailableCities()).thenReturn(List.of());

        mockMvc.perform(get("/product-leasing/cities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(0));
    }
}

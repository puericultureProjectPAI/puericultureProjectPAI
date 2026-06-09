package com.puericulture.leasing.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.puericulture.config.errormanager.CustomGlobalExceptionHandler;
import com.puericulture.leasing.dto.LeasingFilterRequest;
import com.puericulture.leasing.dto.LeasingProductSummaryDto;
import com.puericulture.leasing.exception.InvalidFilterCriteriaException;
import com.puericulture.leasing.service.LeasingProductService;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class LeasingProductControllerTest {

    @Mock private LeasingProductService leasingProductService;

    @InjectMocks private LeasingProductController leasingProductController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private LeasingProductSummaryDto sampleProduct;

    @BeforeEach
    void setUp() {
        mockMvc =
                MockMvcBuilders.standaloneSetup(leasingProductController)
                        .setControllerAdvice(new CustomGlobalExceptionHandler())
                        .build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        sampleProduct =
                LeasingProductSummaryDto.builder()
                        .id(1L)
                        .postTitle("Poussette Babyzen Yoyo 2")
                        .category("Poussette")
                        .city("Paris")
                        .pricePerDay(5L)
                        .pricePerMonth(90L)
                        .condition("Très bon état")
                        .available(true)
                        .build();
    }

    // -------------------------------------------------------------------------
    // POST /public/leasing/products/filter
    // -------------------------------------------------------------------------

    @Test
    void filterProducts_returns200_withResults_whenFilterByCity() throws Exception {
        LeasingFilterRequest request = LeasingFilterRequest.builder().city("Paris").build();
        when(leasingProductService.filter(any())).thenReturn(List.of(sampleProduct));

        mockMvc.perform(
                        post("/public/leasing/products/filter")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].city").value("Paris"));
    }

    @Test
    void filterProducts_returns200_withResults_whenFilterByDates() throws Exception {
        LeasingFilterRequest request =
                LeasingFilterRequest.builder()
                        .startDate(LocalDate.now().plusDays(1))
                        .endDate(LocalDate.now().plusDays(7))
                        .build();
        when(leasingProductService.filter(any())).thenReturn(List.of(sampleProduct));

        mockMvc.perform(
                        post("/public/leasing/products/filter")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].available").value(true));
    }

    @Test
    void filterProducts_returns200_withEmptyList_whenNoResults() throws Exception {
        LeasingFilterRequest request = LeasingFilterRequest.builder().city("Bordeaux").build();
        when(leasingProductService.filter(any())).thenReturn(List.of());

        mockMvc.perform(
                        post("/public/leasing/products/filter")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void filterProducts_returns400_whenNoCriteriaProvided() throws Exception {
        LeasingFilterRequest request = LeasingFilterRequest.builder().build();
        when(leasingProductService.filter(any()))
                .thenThrow(
                        new InvalidFilterCriteriaException(
                                "Au moins un critère de filtrage doit être fourni (ville et/ou dates)"));

        mockMvc.perform(
                        post("/public/leasing/products/filter")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void filterProducts_returns400_whenEndDateBeforeStartDate() throws Exception {
        LeasingFilterRequest request =
                LeasingFilterRequest.builder()
                        .city("Paris")
                        .startDate(LocalDate.now().plusDays(10))
                        .endDate(LocalDate.now().plusDays(1))
                        .build();
        when(leasingProductService.filter(any()))
                .thenThrow(
                        new InvalidFilterCriteriaException(
                                "La date de fin doit être après la date de début"));

        mockMvc.perform(
                        post("/public/leasing/products/filter")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // -------------------------------------------------------------------------
    // GET /public/leasing/products/cities
    // -------------------------------------------------------------------------

    @Test
    void getAvailableCities_returns200_withCityList() throws Exception {
        when(leasingProductService.getAvailableCities())
                .thenReturn(List.of("Bordeaux", "Lyon", "Paris"));

        mockMvc.perform(get("/public/leasing/products/cities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("Bordeaux"))
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getAvailableCities_returns200_withEmptyList_whenNoCities() throws Exception {
        when(leasingProductService.getAvailableCities()).thenReturn(List.of());

        mockMvc.perform(get("/public/leasing/products/cities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }
}

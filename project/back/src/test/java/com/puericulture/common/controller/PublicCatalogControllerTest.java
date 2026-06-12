package com.puericulture.common.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.puericulture.common.dto.ProductCardDto;
import com.puericulture.common.security.JwtAuthenticationFilter;
import com.puericulture.common.service.PublicCatalogService;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
        controllers = PublicCatalogController.class,
        excludeAutoConfiguration = {
            SecurityAutoConfiguration.class,
            UserDetailsServiceAutoConfiguration.class,
            OAuth2ResourceServerAutoConfiguration.class
        })
@AutoConfigureMockMvc(addFilters = false)
public class PublicCatalogControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private PublicCatalogService publicCatalogService;

    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void shouldReturnProductsByAgeRange() throws Exception {
        ProductCardDto dto =
                ProductCardDto.builder()
                        .id(1L)
                        .postTitle("Poussette")
                        .productType("Location")
                        .price(30L)
                        .priceSuffix("€/mois")
                        .actionUrl("/leasing/products/1")
                        .build();

        List<ProductCardDto> mockList = Collections.singletonList(dto);

        when(publicCatalogService.getProductsByAgeRange(0, 3)).thenReturn(mockList);

        mockMvc.perform(
                        get("/public/catalog/products/by-age")
                                .param("minAge", "0")
                                .param("maxAge", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].productType").value("Location"))
                .andExpect(jsonPath("$[0].priceSuffix").value("€/mois"));
    }
}

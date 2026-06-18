package com.puericulture.troc.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.ProductTrocDto;
import com.puericulture.troc.dto.TrocRequest;
import com.puericulture.troc.service.ProductTrocService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TrocControllerTest {

    @Mock private ProductTrocService productTrocService;

    private TrocController trocController;

    private static final UUID AUTHOR_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");

    @BeforeEach
    void setUp() {
        trocController = new TrocController(productTrocService);
    }

    @Test
    void createTroc_validRequest_returns201WithDto() {
        TrocRequest request = new TrocRequest();
        ProductTrocDto expected = new ProductTrocDto();
        expected.setId(1L);

        when(productTrocService.createTroc(request, AUTHOR_ID)).thenReturn(expected);

        ProductTrocDto result = trocController.createTroc(AUTHOR_ID.toString(), request);

        assertSame(expected, result);
        verify(productTrocService).createTroc(request, AUTHOR_ID);
    }

    @Test
    void createTroc_unknownAuthor_propagatesNotFoundException() {
        TrocRequest request = new TrocRequest();

        when(productTrocService.createTroc(request, AUTHOR_ID))
                .thenThrow(new NotFoundException("Authenticated person not found"));

        assertThrows(
                NotFoundException.class,
                () -> trocController.createTroc(AUTHOR_ID.toString(), request));
    }

    @Test
    void getProducts_returnsAvailableProductList() {
        List<ProductTrocDto> expected = List.of(new ProductTrocDto(), new ProductTrocDto());

        when(productTrocService.findAllAvailable()).thenReturn(expected);

        var response = trocController.getProducts();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(expected, response.getBody());
        verify(productTrocService).findAllAvailable();
    }
}

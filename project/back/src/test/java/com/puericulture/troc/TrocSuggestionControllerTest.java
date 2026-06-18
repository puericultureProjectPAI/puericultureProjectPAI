package com.puericulture.troc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.puericulture.troc.controller.TrocSuggestionController;
import com.puericulture.troc.dto.ProductTrocSuggestionDto;
import com.puericulture.troc.service.TrocSuggestionService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TrocSuggestionControllerTest {

    private static final UUID MOCK_USER_ID =
            UUID.fromString("10814ed3-a02b-4b69-9d64-aa96ed92bceb");

    @Mock private TrocSuggestionService trocSuggestionService;

    private TrocSuggestionController trocSuggestionController;

    @BeforeEach
    void setUp() {
        trocSuggestionController = new TrocSuggestionController(trocSuggestionService);
    }

    @Test
    void shouldReturnSuggestionsForConnectedUser() {
        ProductTrocSuggestionDto suggestion = new ProductTrocSuggestionDto();
        suggestion.setId(12L);
        suggestion.setIndicePertinence(85);
        List<ProductTrocSuggestionDto> expectedSuggestions = List.of(suggestion);

        when(trocSuggestionService.getSuggestionsForConnectedUser(MOCK_USER_ID))
                .thenReturn(expectedSuggestions);

        List<ProductTrocSuggestionDto> result =
                trocSuggestionController.getSuggestions(MOCK_USER_ID.toString());

        assertEquals(expectedSuggestions, result);
        verify(trocSuggestionService).getSuggestionsForConnectedUser(MOCK_USER_ID);
    }
}

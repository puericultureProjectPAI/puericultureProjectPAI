package com.puericulture.troc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.puericulture.troc.controller.TrocSuggestionController;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.dto.TrocSuggestionResponse;
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
        List<TrocSuggestionResponse> expectedSuggestions = List.of(new TrocSuggestionResponse());
        when(trocSuggestionService.getSuggestionsForConnectedUser(MOCK_USER_ID))
                .thenReturn(expectedSuggestions);

        List<TrocSuggestionResponse> result =
                trocSuggestionController.getSuggestions(MOCK_USER_ID.toString());

        assertEquals(expectedSuggestions, result);
        verify(trocSuggestionService).getSuggestionsForConnectedUser(MOCK_USER_ID);
    }

    @Test
    void shouldReturnSuggestionDetails() {
        TrocSuggestionResponse expectedSuggestion = new TrocSuggestionResponse();
        when(trocSuggestionService.getSuggestionDetails(12L, MOCK_USER_ID))
                .thenReturn(expectedSuggestion);

        TrocSuggestionResponse result =
                trocSuggestionController.getSuggestionDetails(MOCK_USER_ID.toString(), 12L);

        assertSame(expectedSuggestion, result);
        verify(trocSuggestionService).getSuggestionDetails(12L, MOCK_USER_ID);
    }

    @Test
    void shouldCallServiceWhenIgnoringSuggestion() {
        trocSuggestionController.ignoreSuggestion(MOCK_USER_ID.toString(), 12L);

        verify(trocSuggestionService).ignoreSuggestion(12L, MOCK_USER_ID);
    }

    @Test
    void shouldAcceptSuggestionAndReturnExchange() {
        ExchangeResponse expectedExchange = new ExchangeResponse();
        when(trocSuggestionService.acceptSuggestion(12L, MOCK_USER_ID))
                .thenReturn(expectedExchange);

        ExchangeResponse result =
                trocSuggestionController.acceptSuggestion(MOCK_USER_ID.toString(), 12L);

        assertSame(expectedExchange, result);
        verify(trocSuggestionService).acceptSuggestion(12L, MOCK_USER_ID);
    }
}

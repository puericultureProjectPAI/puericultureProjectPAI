package com.puericulture.troc.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import com.puericulture.common.dto.PersonDto;
import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.ProductCategory;
import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.dto.ProductTrocDto;
import com.puericulture.troc.dto.TrocSuggestionResponse;
import com.puericulture.troc.entity.ExchangeStatus;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.entity.ProductTrocStatus;
import com.puericulture.troc.entity.TrocSuggestion;
import com.puericulture.troc.entity.TrocSuggestionStatus;
import com.puericulture.troc.mapper.ProductTrocMapper;
import com.puericulture.troc.repository.ExchangeRepository;
import com.puericulture.troc.repository.ProductTrocRepository;
import com.puericulture.troc.repository.TrocSuggestionRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TrocSuggestionServiceTest {

    private static final UUID CONNECTED_USER_ID =
            UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID OTHER_USER_ID =
            UUID.fromString("22222222-2222-2222-2222-222222222222");

    @Mock private ProductTrocRepository productTrocRepository;
    @Mock private TrocSuggestionRepository trocSuggestionRepository;
    @Mock private ExchangeRepository exchangeRepository;
    @Mock private ProductTrocMapper productTrocMapper;
    @Mock private ExchangeService exchangeService;

    private TrocSuggestionService trocSuggestionService;
    private Person connectedUser;
    private Person otherUser;
    private ProductTroc requesterProduct;
    private ProductTroc suggestedProduct;

    @BeforeEach
    void setUp() {
        trocSuggestionService =
                new TrocSuggestionService(
                        productTrocRepository,
                        trocSuggestionRepository,
                        exchangeRepository,
                        productTrocMapper,
                        exchangeService);

        connectedUser = new Person();
        connectedUser.setId(CONNECTED_USER_ID);
        connectedUser.setFirstName("Léa");

        otherUser = new Person();
        otherUser.setId(OTHER_USER_ID);
        otherUser.setFirstName("Sarah");

        requesterProduct = availableProduct(1L, connectedUser, "Poussette", 40L);
        suggestedProduct = availableProduct(2L, otherUser, "Siège auto", 45L);
    }

    @Test
    void shouldGenerateRelevantSuggestionsFromAvailableProducts() {
        given(
                        trocSuggestionRepository.findActiveSuggestionsForUser(
                                CONNECTED_USER_ID, TrocSuggestionStatus.ACTIVE))
                .willReturn(List.of());
        given(
                        productTrocRepository.findAvailableProductsByAuthor(
                                CONNECTED_USER_ID, ProductTrocStatus.AVAILABLE))
                .willReturn(List.of(requesterProduct));
        given(
                        productTrocRepository.findAvailableProductsNotOwnedByAuthor(
                                CONNECTED_USER_ID, ProductTrocStatus.AVAILABLE))
                .willReturn(List.of(suggestedProduct));
        given(exchangeRepository.existsBetweenProducts(1L, 2L)).willReturn(false);
        given(trocSuggestionRepository.existsSuggestionForProductPair(CONNECTED_USER_ID, 1L, 2L))
                .willReturn(false);
        given(trocSuggestionRepository.saveAll(any()))
                .willAnswer(invocation -> invocation.getArgument(0));
        given(productTrocMapper.toDto(requesterProduct))
                .willReturn(productDto(1L, "Poussette", connectedUser));
        given(productTrocMapper.toDto(suggestedProduct))
                .willReturn(productDto(2L, "Siège auto", otherUser));

        List<TrocSuggestionResponse> suggestions =
                trocSuggestionService.getSuggestionsForConnectedUser(CONNECTED_USER_ID);

        assertThat(suggestions).hasSize(1);
        assertThat(suggestions.get(0).getCompatibilityScore()).isGreaterThanOrEqualTo(80);
        assertThat(suggestions.get(0).getCompatibilityReason()).contains("même catégorie");
        assertThat(suggestions.get(0).getOtherUser().getId()).isEqualTo(OTHER_USER_ID);

        ArgumentCaptor<List<TrocSuggestion>> suggestionsCaptor =
                ArgumentCaptor.forClass(List.class);
        verify(trocSuggestionRepository).saveAll(suggestionsCaptor.capture());
        assertThat(suggestionsCaptor.getValue().get(0).getRequesterProduct())
                .isSameAs(requesterProduct);
        assertThat(suggestionsCaptor.getValue().get(0).getSuggestedProduct())
                .isSameAs(suggestedProduct);
    }

    @Test
    void shouldNotRepeatAlreadyGeneratedSuggestion() {
        given(
                        trocSuggestionRepository.findActiveSuggestionsForUser(
                                CONNECTED_USER_ID, TrocSuggestionStatus.ACTIVE))
                .willReturn(List.of());
        given(
                        productTrocRepository.findAvailableProductsByAuthor(
                                CONNECTED_USER_ID, ProductTrocStatus.AVAILABLE))
                .willReturn(List.of(requesterProduct));
        given(
                        productTrocRepository.findAvailableProductsNotOwnedByAuthor(
                                CONNECTED_USER_ID, ProductTrocStatus.AVAILABLE))
                .willReturn(List.of(suggestedProduct));
        given(trocSuggestionRepository.existsSuggestionForProductPair(CONNECTED_USER_ID, 1L, 2L))
                .willReturn(true);

        List<TrocSuggestionResponse> suggestions =
                trocSuggestionService.getSuggestionsForConnectedUser(CONNECTED_USER_ID);

        assertThat(suggestions).isEmpty();
    }

    @Test
    void shouldIgnoreSuggestion() {
        TrocSuggestion suggestion = activeSuggestion();
        given(trocSuggestionRepository.findSuggestionForUser(10L, CONNECTED_USER_ID))
                .willReturn(Optional.of(suggestion));

        trocSuggestionService.ignoreSuggestion(10L, CONNECTED_USER_ID);

        assertThat(suggestion.getStatus()).isEqualTo(TrocSuggestionStatus.IGNORED);
        verify(trocSuggestionRepository).save(suggestion);
    }

    @Test
    void shouldAcceptSuggestionAndCreateExchangeProposal() {
        TrocSuggestion suggestion = activeSuggestion();
        ExchangeResponse expectedExchange = new ExchangeResponse();
        expectedExchange.setStatus(ExchangeStatus.PENDING);

        given(trocSuggestionRepository.findSuggestionForUser(10L, CONNECTED_USER_ID))
                .willReturn(Optional.of(suggestion));
        given(exchangeService.createExchange(any(), any())).willReturn(expectedExchange);

        ExchangeResponse response = trocSuggestionService.acceptSuggestion(10L, CONNECTED_USER_ID);

        assertThat(response).isSameAs(expectedExchange);
        assertThat(suggestion.getStatus()).isEqualTo(TrocSuggestionStatus.ACCEPTED);
        verify(trocSuggestionRepository).save(suggestion);
    }

    @Test
    void shouldRejectNonActiveSuggestionAcceptance() {
        TrocSuggestion suggestion = activeSuggestion();
        suggestion.setStatus(TrocSuggestionStatus.IGNORED);
        given(trocSuggestionRepository.findSuggestionForUser(10L, CONNECTED_USER_ID))
                .willReturn(Optional.of(suggestion));

        assertThatThrownBy(() -> trocSuggestionService.acceptSuggestion(10L, CONNECTED_USER_ID))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Only active suggestions can be accepted");
    }

    @Test
    void shouldRejectUnknownSuggestion() {
        given(trocSuggestionRepository.findSuggestionForUser(10L, CONNECTED_USER_ID))
                .willReturn(Optional.empty());

        assertThatThrownBy(() -> trocSuggestionService.getSuggestionDetails(10L, CONNECTED_USER_ID))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Troc suggestion not found");
    }

    private ProductTroc availableProduct(
            Long id, Person author, String title, Long estimatedPrice) {
        ProductTroc product = new ProductTroc();
        product.setId(id);
        product.setAuthor(author);
        product.setPostTitle(title);
        product.setCity("Lille");
        product.setCategory(ProductCategory.TRANSPORT_BEBE);
        product.setEstimatedPrice(estimatedPrice);
        product.setCondition("Très bon état");
        product.setMinAgeMonths(0);
        product.setMaxAgeMonths(24);
        product.setStatus(ProductTrocStatus.AVAILABLE);
        return product;
    }

    private TrocSuggestion activeSuggestion() {
        TrocSuggestion suggestion = new TrocSuggestion();
        suggestion.setId(10L);
        suggestion.setConnectedUser(connectedUser);
        suggestion.setRequesterProduct(requesterProduct);
        suggestion.setSuggestedProduct(suggestedProduct);
        suggestion.setCompatibilityScore(90);
        suggestion.setCompatibilityReason("Compatibilité : même catégorie");
        suggestion.setStatus(TrocSuggestionStatus.ACTIVE);
        return suggestion;
    }

    private ProductTrocDto productDto(Long id, String title, Person author) {
        PersonDto authorDto = new PersonDto();
        authorDto.setId(author.getId());
        authorDto.setFirstName(author.getFirstName());

        ProductTrocDto dto = new ProductTrocDto();
        dto.setId(id);
        dto.setPostTitle(title);
        dto.setAuthor(authorDto);
        dto.setCategory("Poussettes, porte-bébés et sièges auto");
        dto.setStatus(ProductTrocStatus.AVAILABLE);
        return dto;
    }
}

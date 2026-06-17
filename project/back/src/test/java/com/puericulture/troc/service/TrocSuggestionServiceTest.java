package com.puericulture.troc.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.puericulture.common.dto.PersonDto;
import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.ProductCategory;
import com.puericulture.troc.dto.ProductTrocDto;
import com.puericulture.troc.dto.ProductTrocSuggestionDto;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.entity.ProductTrocStatus;
import com.puericulture.troc.mapper.ProductTrocMapper;
import com.puericulture.troc.repository.ExchangeRepository;
import com.puericulture.troc.repository.ProductTrocRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TrocSuggestionServiceTest {

    private static final UUID CONNECTED_USER_ID =
            UUID.fromString("10814ed3-a02b-4b69-9d64-aa96ed92bceb");
    private static final UUID OTHER_USER_ID =
            UUID.fromString("2b8772cb-156d-4f23-80a5-68cf7c683aef");

    @Mock private ProductTrocRepository productTrocRepository;

    @Mock private ExchangeRepository exchangeRepository;

    @Mock private ProductTrocMapper productTrocMapper;

    private TrocSuggestionService trocSuggestionService;
    private Person connectedUser;
    private Person otherUser;

    @BeforeEach
    void setUp() {
        trocSuggestionService =
                new TrocSuggestionService(
                        productTrocRepository, exchangeRepository, productTrocMapper);

        connectedUser = new Person();
        connectedUser.setId(CONNECTED_USER_ID);
        connectedUser.setName("Connected parent");

        otherUser = new Person();
        otherUser.setId(OTHER_USER_ID);
        otherUser.setName("Other parent");
    }

    @Test
    void shouldComputeSuggestionsDynamicallyWithoutSavingThem() {
        ProductTroc requesterProduct = product(1L, connectedUser, "Lille", 40L);
        ProductTroc bestCandidate = product(2L, otherUser, "Lille", 42L);
        ProductTroc weakerCandidate = product(3L, otherUser, "Paris", 90L);

        ProductTrocDto bestCandidateDto = dto(bestCandidate, 2L, "Siège auto");
        ProductTrocDto weakerCandidateDto = dto(weakerCandidate, 3L, "Chaise haute");

        given(
                        productTrocRepository.findAvailableProductsByAuthor(
                                CONNECTED_USER_ID, ProductTrocStatus.AVAILABLE))
                .willReturn(List.of(requesterProduct));
        given(
                        productTrocRepository.findAvailableProductsNotOwnedByAuthor(
                                CONNECTED_USER_ID, ProductTrocStatus.AVAILABLE))
                .willReturn(List.of(weakerCandidate, bestCandidate));
        given(exchangeRepository.existsBetweenProducts(1L, 2L)).willReturn(false);
        given(exchangeRepository.existsBetweenProducts(1L, 3L)).willReturn(false);
        given(productTrocMapper.toDto(bestCandidate)).willReturn(bestCandidateDto);
        given(productTrocMapper.toDto(weakerCandidate)).willReturn(weakerCandidateDto);

        List<ProductTrocSuggestionDto> suggestions =
                trocSuggestionService.getSuggestionsForConnectedUser(CONNECTED_USER_ID);

        assertThat(suggestions).hasSize(2);
        assertThat(suggestions.get(0).getId()).isEqualTo(2L);
        assertThat(suggestions.get(0).getIndicePertinence())
                .isGreaterThan(suggestions.get(1).getIndicePertinence());
        assertThat(suggestions.get(0).getPertinenceReason()).contains("même catégorie");
    }

    @Test
    void shouldReturnEmptyListWhenConnectedUserHasNoAvailableTrocProduct() {
        given(
                        productTrocRepository.findAvailableProductsByAuthor(
                                CONNECTED_USER_ID, ProductTrocStatus.AVAILABLE))
                .willReturn(List.of());
        given(
                        productTrocRepository.findAvailableProductsNotOwnedByAuthor(
                                CONNECTED_USER_ID, ProductTrocStatus.AVAILABLE))
                .willReturn(List.of(product(2L, otherUser, "Lille", 42L)));

        List<ProductTrocSuggestionDto> suggestions =
                trocSuggestionService.getSuggestionsForConnectedUser(CONNECTED_USER_ID);

        assertThat(suggestions).isEmpty();
        verify(exchangeRepository, never()).existsBetweenProducts(1L, 2L);
    }

    private ProductTroc product(Long id, Person author, String city, Long estimatedPrice) {
        ProductTroc product = new ProductTroc();
        product.setId(id);
        product.setAuthor(author);
        product.setPostTitle("Produit " + id);
        product.setCategory(ProductCategory.TRANSPORT_BEBE);
        product.setCity(city);
        product.setEstimatedPrice(estimatedPrice);
        product.setCondition("Très bon état");
        product.setMinAgeMonths(0);
        product.setMaxAgeMonths(36);
        product.setStatus(ProductTrocStatus.AVAILABLE);
        return product;
    }

    private ProductTrocDto dto(ProductTroc product, Long id, String title) {
        PersonDto authorDto = new PersonDto();
        authorDto.setId(product.getAuthor().getId());
        authorDto.setName(product.getAuthor().getName());

        ProductTrocDto dto = new ProductTrocDto();
        dto.setId(id);
        dto.setPostTitle(title);
        dto.setCategory(ProductCategory.TRANSPORT_BEBE.getLabel());
        dto.setCity(product.getCity());
        dto.setEstimatedPrice(product.getEstimatedPrice());
        dto.setCondition(product.getCondition());
        dto.setAuthor(authorDto);
        return dto;
    }
}

package com.puericulture.troc;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.puericulture.common.entity.Person;
import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.ForbiddenException;
import com.puericulture.troc.dto.CreateExchangeRequest;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.dto.ProductExchangeStatusResponse;
import com.puericulture.troc.entity.Exchange;
import com.puericulture.troc.entity.ExchangeStatus;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.repository.ExchangeRepository;
import com.puericulture.troc.repository.ProductTrocRepository;
import com.puericulture.troc.service.ExchangeService;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExchangeServiceTest {

    @Mock private ExchangeRepository exchangeRepository;

    @Mock private ProductTrocRepository productTrocRepository;

    @InjectMocks private ExchangeService exchangeService;

    private static final UUID MOCK_USER_ID =
            UUID.fromString(
                    "10814ed3-a02b-4b69-9d64-aa96ed92bceb"); // pour les tests, on considère que
    // c'est l'ID de l'utilisateur connecté

    private ProductTroc proposerProduct;
    private ProductTroc receiverProduct;

    @BeforeEach
    void setup() { // Initialiser les produits(ProductTroc) et les utilisateurs(person) pour les
        // tests

        Person connectedUser = new Person();
        connectedUser.setId(MOCK_USER_ID);

        Person otherUser = new Person();
        otherUser.setId(UUID.randomUUID());

        proposerProduct = new ProductTroc();
        proposerProduct.setId(
                1L); // ID du produit proposé 1L car les ID sont des Long dans les entités
        proposerProduct.setCategory("TROC");
        proposerProduct.setAuthor(connectedUser);

        receiverProduct = new ProductTroc();
        receiverProduct.setId(2L);
        receiverProduct.setCategory("TROC");
        receiverProduct.setAuthor(otherUser);
    }

    // Test pour vérifier que la méthode createExchange crée un échange avec succès lorsque les
    // produits proposés et demandés sont valides et appartiennent à des utilisateurs différents
    // Parce que :
    // le produit proposé et le produit demandé existent bien
    // le produit proposé et le produit demandé appartiennent à des utilisateurs différents
    // il n’existe pas déjà un échange entre ces deux produits

    @Test
    void shouldCreateExchangeSuccessfully() {

        CreateExchangeRequest request = new CreateExchangeRequest();
        request.setProposerProductId(1L);
        request.setReceiverProductId(2L);

        when(productTrocRepository.findById(1L))
                .thenReturn(Optional.of(proposerProduct)); // Mock du repository pour retourner le
        // produit(productTroc) proposé

        when(productTrocRepository.findById(2L))
                .thenReturn(Optional.of(receiverProduct)); // Mock du repository pour retourner le
        // produit(productTroc) demandé

        when(exchangeRepository.existsByProposerProductIdAndReceiverProductId(1L, 2L))
                .thenReturn(false); // Mock du repository pour indiquer qu'il n'existe pas déjà un
        // échange entre ces deux produits

        Exchange savedExchange = new Exchange();
        savedExchange.setProposerProductId(1L);
        savedExchange.setReceiverProductId(2L);
        savedExchange.setStatus(ExchangeStatus.PENDING);

        when(exchangeRepository.save(any(Exchange.class))).thenReturn(savedExchange);

        ExchangeResponse response = exchangeService.createExchange(request);

        assertNotNull(response);
        assertEquals(1L, response.getProposerProductId());
        assertEquals(2L, response.getReceiverProductId());
        assertEquals(ExchangeStatus.PENDING, response.getStatus());

        verify(exchangeRepository, times(1)).save(any(Exchange.class));
    }

    // Test pour vérifier que la méthode createExchange lance une exception BadRequestException
    // lorsque les produits proposés et demandés appartiennent au même utilisateur
    // Parce que :
    // le produit proposé et le produit demandé appartiennent au même utilisateur

    @Test
    void shouldThrowWhenProductsBelongToSameUser() {

        receiverProduct.setAuthor(proposerProduct.getAuthor());

        CreateExchangeRequest request = new CreateExchangeRequest();
        request.setProposerProductId(1L);
        request.setReceiverProductId(2L);

        when(productTrocRepository.findById(1L)).thenReturn(Optional.of(proposerProduct));

        when(productTrocRepository.findById(2L)).thenReturn(Optional.of(receiverProduct));

        assertThrows(BadRequestException.class, () -> exchangeService.createExchange(request));
    }

    // Test pour vérifier que la méthode createExchange lance une exception BadRequestException
    // lorsque l'échange entre les deux produits existe déjà
    // Parce que :
    // l’échange existe déjà entre les deux produits proposés et demandés

    @Test
    void shouldThrowWhenExchangeAlreadyExists() {

        CreateExchangeRequest request = new CreateExchangeRequest();
        request.setProposerProductId(1L);
        request.setReceiverProductId(2L);

        when(productTrocRepository.findById(1L)).thenReturn(Optional.of(proposerProduct));

        when(productTrocRepository.findById(2L)).thenReturn(Optional.of(receiverProduct));

        when(exchangeRepository.existsByProposerProductIdAndReceiverProductId(1L, 2L))
                .thenReturn(true);

        assertThrows(BadRequestException.class, () -> exchangeService.createExchange(request));
    }

    // Test pour vérifier que la méthode deleteExchange supprime l'échange lorsque l'utilisateur
    // connecté est le créateur de l'échange
    // Parce que :
    // l’échange existe bien
    // l’utilisateur connecté est le créateur de l’échange

    @Test
    void shouldDeleteExchangeSuccessfully() {

        Exchange exchange = new Exchange();
        exchange.setCreatorId(MOCK_USER_ID);

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        exchangeService.deleteExchange(1L);

        verify(exchangeRepository, times(1)).delete(exchange);
    }

    // Test pour vérifier que la méthode deleteExchange lance une exception ForbiddenException
    // lorsque l'utilisateur connecté n'est pas le créateur de l'échange
    // Parce que :
    // l’échange existe bien

    @Test
    void shouldThrowWhenDeletingExchangeNotOwnedByUser() {

        Exchange exchange = new Exchange();
        exchange.setCreatorId(UUID.randomUUID());

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        assertThrows(ForbiddenException.class, () -> exchangeService.deleteExchange(1L));
    }

    // Test pour vérifier que la méthode acceptExchange change le statut de l'échange à CONFIRMED
    // lorsque l'utilisateur connecté est le receveur de l'échange
    // Parce que :
    // le produit demandé appartient à l'utilisateur connecté c'est à dire le receveur de l'échange
    @Test
    void shouldAcceptExchangeSuccessfully() {
        Person connectedUser = new Person();
        connectedUser.setId(MOCK_USER_ID);

        receiverProduct.setAuthor(
                connectedUser); // Le produit demandé appartient à l'utilisateur connecté c'est à
        // dire le receveur de l'échange

        Exchange exchange = new Exchange();
        exchange.setReceiverProductId(2L);
        exchange.setStatus(ExchangeStatus.PENDING);

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        when(productTrocRepository.findById(2L)).thenReturn(Optional.of(receiverProduct));

        exchangeService.acceptExchange(1L);

        assertEquals(ExchangeStatus.CONFIRMED, exchange.getStatus());

        verify(exchangeRepository, times(1)).save(exchange);
    }

    // Test pour vérifier que la méthode refuseExchange change le statut de l'échange à REFUSED
    // lorsque l'utilisateur connecté est le receveur de l'échange
    // Parce que :
    // le produit demandé appartient à l'utilisateur connecté c'est à dire le receveur de l'échange

    @Test
    void shouldRefuseExchangeSuccessfully() {
        Person connectedUser = new Person();
        connectedUser.setId(MOCK_USER_ID);

        receiverProduct.setAuthor(
                connectedUser); // Le produit demandé appartient à l'utilisateur connecté c'est à
        // dire le receveur de l'échange

        Exchange exchange = new Exchange();
        exchange.setReceiverProductId(2L);
        exchange.setStatus(ExchangeStatus.PENDING);

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        when(productTrocRepository.findById(2L)).thenReturn(Optional.of(receiverProduct));

        exchangeService.refuseExchange(1L);

        assertEquals(ExchangeStatus.REFUSED, exchange.getStatus());

        verify(exchangeRepository, times(1)).save(exchange);
    }

    // Test pour vérifier que la méthode getIfIHaveProposedExchangeForSomeonesProduct
    // retourne l'échange proposé par l'utilisateur connecté pour le produit demandé
    @Test
    void shouldReturnExchangeForConnectedUserOnProduct() {

        Exchange exchange = new Exchange();
        exchange.setReceiverProductId(2L);
        exchange.setProposerProductId(1L);
        exchange.setStatus(ExchangeStatus.PENDING);

        when(productTrocRepository.findById(2L)).thenReturn(Optional.of(receiverProduct));

        when(exchangeRepository.findAll()).thenReturn(List.of(exchange));

        when(productTrocRepository.findById(1L)).thenReturn(Optional.of(proposerProduct));

        ProductExchangeStatusResponse response =
                exchangeService.getIfIHaveProposedExchangeForSomeonesProduct(2L);

        assertNotNull(response);
        assertEquals(ExchangeStatus.PENDING, response.getStatus());
    }

    // Test pour vérifier que la méthode getIfIHaveProposedExchangeForSomeonesProduct
    //  retourne false lorsque l'utilisateur connecté n'a pas proposé d'échange pour le produit
    // demandé
    // Parce que :
    /*le produit existe bien
    la requête est valide
    l’utilisateur a le droit de consulter l’information
    “ne pas avoir proposé d’échange” n’est pas une erreur technique ou métier critique*/
    @Test
    void shouldReturnFalseWhenNoExchangeExistsForConnectedUser() {

        when(productTrocRepository.findById(2L)).thenReturn(Optional.of(receiverProduct));

        when(exchangeRepository.findAll()).thenReturn(List.of());

        ProductExchangeStatusResponse response =
                exchangeService.getIfIHaveProposedExchangeForSomeonesProduct(2L);

        assertNotNull(response);
        assertFalse(response.isHasExchange());
    }
}

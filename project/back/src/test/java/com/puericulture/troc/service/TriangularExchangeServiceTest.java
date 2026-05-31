package com.puericulture.troc.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.puericulture.common.entity.Person;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.CreateTriangularExchangeRequest;
import com.puericulture.troc.dto.TriangularExchangeResponse;
import com.puericulture.troc.dto.TriangularParticipantRequest;
import com.puericulture.troc.entity.*;
import com.puericulture.troc.mapper.TriangularExchangeMapper;
import com.puericulture.troc.repository.ExchangeRepository;
import com.puericulture.troc.repository.ProductTrocRepository;
import com.puericulture.troc.repository.TriangularExchangeParticipantRepository;
import com.puericulture.troc.repository.TriangularExchangeRepository;
import java.util.ArrayList;
import java.util.Collections;
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
class TriangularExchangeServiceTest {

    @Mock private TriangularExchangeRepository triangularExchangeRepository;
    @Mock private TriangularExchangeParticipantRepository participantRepository;
    @Mock private ProductTrocRepository productTrocRepository;
    @Mock private PersonRepository personRepository;
    @Mock private ExchangeRepository exchangeRepository;
    @Mock private TriangularExchangeMapper triangularExchangeMapper;

    @InjectMocks private TriangularExchangeService triangularExchangeService;

    private static final UUID CONNECTED_USER_ID =
            UUID.fromString("10814ed3-a02b-4b69-9d64-aa96ed92bceb");
    private static final UUID USER_B_ID = UUID.randomUUID();
    private static final UUID USER_C_ID = UUID.randomUUID();

    private ProductTroc productA;
    private ProductTroc productB;
    private ProductTroc productC;

    private Person userA;
    private Person userB;
    private Person userC;

    @BeforeEach
    void setup() {
        userA = new Person();
        userA.setId(CONNECTED_USER_ID);
        userB = new Person();
        userB.setId(USER_B_ID);
        userC = new Person();
        userC.setId(USER_C_ID);

        // CORRECTION ICI : Utilisation de setId() à la place de setProductId()
        productA = new ProductTroc();
        productA.setId(1L);
        productA.setAuthor(userA);
        productA.setStatus(ProductTrocStatus.AVAILABLE);
        productB = new ProductTroc();
        productB.setId(2L);
        productB.setAuthor(userB);
        productB.setStatus(ProductTrocStatus.AVAILABLE);
        productC = new ProductTroc();
        productC.setId(3L);
        productC.setAuthor(userC);
        productC.setStatus(ProductTrocStatus.AVAILABLE);
    }

    @Test
    void shouldCreateTriangularExchangeSuccessfully() {
        CreateTriangularExchangeRequest request = new CreateTriangularExchangeRequest();
        List<TriangularParticipantRequest> participants = new ArrayList<>();

        // Maillon 1: A donne A et veut B
        TriangularParticipantRequest p1 = new TriangularParticipantRequest();
        p1.setParticipantId(CONNECTED_USER_ID);
        p1.setOfferedProductId(1L);
        p1.setWantedProductId(2L);
        p1.setStepOrder(1);
        // Maillon 2: B donne B et veut C
        TriangularParticipantRequest p2 = new TriangularParticipantRequest();
        p2.setParticipantId(USER_B_ID);
        p2.setOfferedProductId(2L);
        p2.setWantedProductId(3L);
        p2.setStepOrder(2);
        // Maillon 3: C donne C et veut A
        TriangularParticipantRequest p3 = new TriangularParticipantRequest();
        p3.setParticipantId(USER_C_ID);
        p3.setOfferedProductId(3L);
        p3.setWantedProductId(1L);
        p3.setStepOrder(3);

        participants.addAll(List.of(p1, p2, p3));
        request.setParticipants(participants);

        when(productTrocRepository.findById(1L)).thenReturn(Optional.of(productA));
        when(productTrocRepository.findById(2L)).thenReturn(Optional.of(productB));
        when(productTrocRepository.findById(3L)).thenReturn(Optional.of(productC));
        when(personRepository.findById(CONNECTED_USER_ID)).thenReturn(Optional.of(userA));
        when(personRepository.findById(USER_B_ID)).thenReturn(Optional.of(userB));
        when(personRepository.findById(USER_C_ID)).thenReturn(Optional.of(userC));

        TriangularExchange baseExchange = new TriangularExchange();
        baseExchange.setId(100L);
        when(triangularExchangeRepository.save(any(TriangularExchange.class)))
                .thenReturn(baseExchange);

        TriangularExchangeResponse expectedResponse = new TriangularExchangeResponse();
        expectedResponse.setStatus(ExchangeStatus.PENDING);
        when(triangularExchangeMapper.toResponse(any(TriangularExchange.class)))
                .thenReturn(expectedResponse);

        TriangularExchangeResponse result =
                triangularExchangeService.createTriangularExchange(request, CONNECTED_USER_ID);

        assertNotNull(result);
        assertEquals(ExchangeStatus.PENDING, result.getStatus());
        verify(participantRepository, times(1)).saveAll(anyList());
    }

    @Test
    void shouldAcceptTriangularExchangeButStayPendingWhenNotLastVote() {
        TriangularExchange exchange = new TriangularExchange();
        exchange.setId(100L);
        exchange.setStatus(ExchangeStatus.PENDING);

        TriangularExchangeParticipant participantA = new TriangularExchangeParticipant();
        participantA.setParticipant(userA);
        participantA.setStatus(ExchangeStatus.PENDING);
        TriangularExchangeParticipant participantB = new TriangularExchangeParticipant();
        participantB.setParticipant(userB);
        participantB.setStatus(ExchangeStatus.PENDING);

        exchange.setParticipants(List.of(participantA, participantB));

        when(triangularExchangeRepository.findById(100L)).thenReturn(Optional.of(exchange));
        when(participantRepository.findByTriangularExchangeIdAndParticipantId(
                        100L, CONNECTED_USER_ID))
                .thenReturn(Optional.of(participantA));

        triangularExchangeService.acceptTriangularExchange(100L, CONNECTED_USER_ID);

        assertEquals(ExchangeStatus.ACCEPTED, participantA.getStatus());
        assertEquals(
                ExchangeStatus.PENDING, exchange.getStatus()); // Reste pending car B n'a pas voté
    }

    @Test
    void shouldTriggerGlobalAcceptanceAndLockProductsWhenLastParticipantAccepts() {
        TriangularExchange exchange = new TriangularExchange();
        exchange.setId(100L);
        exchange.setStatus(ExchangeStatus.PENDING);

        TriangularExchangeParticipant participantA = new TriangularExchangeParticipant();
        participantA.setParticipant(userA);
        participantA.setStatus(ExchangeStatus.ACCEPTED);
        participantA.setOfferedProduct(productA);

        TriangularExchangeParticipant participantB = new TriangularExchangeParticipant();
        participantB.setParticipant(userB);
        participantB.setStatus(ExchangeStatus.PENDING); // C'est lui qui vote
        participantB.setOfferedProduct(productB);

        exchange.setParticipants(List.of(participantA, participantB));

        when(triangularExchangeRepository.findById(100L)).thenReturn(Optional.of(exchange));
        when(participantRepository.findByTriangularExchangeIdAndParticipantId(100L, USER_B_ID))
                .thenReturn(Optional.of(participantB));
        when(exchangeRepository.findConflictingPendingExchanges(
                        any(), anyLong(), anyLong(), anyLong()))
                .thenReturn(List.of());

        triangularExchangeService.acceptTriangularExchange(100L, USER_B_ID);

        assertEquals(ExchangeStatus.ACCEPTED, participantB.getStatus());
        assertEquals(ExchangeStatus.ACCEPTED, exchange.getStatus()); // Changement global !
        assertEquals(ProductTrocStatus.PENDING, productA.getStatus()); // Produits verrouillés
        assertEquals(ProductTrocStatus.PENDING, productB.getStatus());
    }

    @Test
    void shouldRefuseTriangularExchangeSuccessfullyWithDominoEffect() {
        TriangularExchange exchange = new TriangularExchange();
        exchange.setId(100L);
        exchange.setStatus(ExchangeStatus.PENDING);

        TriangularExchangeParticipant participantA = new TriangularExchangeParticipant();
        participantA.setParticipant(userA);
        participantA.setOfferedProduct(productA);
        TriangularExchangeParticipant participantB = new TriangularExchangeParticipant();
        participantB.setParticipant(userB);
        participantB.setOfferedProduct(productB);

        exchange.setParticipants(List.of(participantA, participantB));

        when(triangularExchangeRepository.findById(100L)).thenReturn(Optional.of(exchange));
        when(participantRepository.findByTriangularExchangeIdAndParticipantId(
                        100L, CONNECTED_USER_ID))
                .thenReturn(Optional.of(participantA));

        triangularExchangeService.refuseTriangularExchange(100L, CONNECTED_USER_ID);

        assertEquals(ExchangeStatus.REFUSED, exchange.getStatus());
        assertEquals(ExchangeStatus.REFUSED, participantA.getStatus());
        assertEquals(ExchangeStatus.REFUSED, participantB.getStatus());
    }

    @Test
    void autoCreateTriangularExchange_Success() {
        // Given
        UUID requesterId = userA.getId();
        Long wantedProductId = productB.getId(); // User A veut le produit de User B

        // Configurer les prix pour qu'ils soient similaires (ex: 100€)
        productB.setEstimatedPrice(100L);
        productA.setEstimatedPrice(100L);
        productC.setEstimatedPrice(100L);

        // Mocks des Repositories
        when(productTrocRepository.findById(wantedProductId)).thenReturn(Optional.of(productB));
        // Mock du Mapper pour qu'il ne renvoie pas null
        when(triangularExchangeMapper.toResponse(any(TriangularExchange.class)))
                .thenReturn(new TriangularExchangeResponse());

        // Mock pour trouver le produit de User A (productA)
        when(productTrocRepository.findByAuthorIdAndStatusAndEstimatedPriceBetween(
                        eq(requesterId), eq(ProductTrocStatus.AVAILABLE), anyLong(), anyLong()))
                .thenReturn(List.of(productA));

        // Mock pour trouver le produit tiers de User C (productC)
        when(productTrocRepository.findThirdPartyProductsForTriangle(
                        eq(requesterId),
                        eq(userB.getId()),
                        eq(ProductTrocStatus.AVAILABLE),
                        anyLong(),
                        anyLong()))
                .thenReturn(List.of(productC));

        // Mock de la sauvegarde globale
        when(triangularExchangeRepository.save(any(TriangularExchange.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(personRepository.findById(requesterId)).thenReturn(Optional.of(userA));

        // When
        TriangularExchangeResponse response =
                triangularExchangeService.autoCreateTriangularExchange(
                        wantedProductId, requesterId);

        // Then
        assertNotNull(response);
        verify(triangularExchangeRepository, times(1)).save(any(TriangularExchange.class));
        verify(participantRepository, times(1)).saveAll(anyList());
    }

    @Test
    void autoCreateTriangularExchange_ThrowsException_WhenNoThirdPartyProductFound() {
        // Given
        UUID requesterId = userA.getId();
        Long wantedProductId = productB.getId();
        productB.setEstimatedPrice(100L);

        when(productTrocRepository.findById(wantedProductId)).thenReturn(Optional.of(productB));
        when(productTrocRepository.findByAuthorIdAndStatusAndEstimatedPriceBetween(
                        eq(requesterId), eq(ProductTrocStatus.AVAILABLE), anyLong(), anyLong()))
                .thenReturn(List.of(productA));

        // Aucun produit C trouvé dans la base
        when(productTrocRepository.findThirdPartyProductsForTriangle(
                        eq(requesterId),
                        eq(userB.getId()),
                        eq(ProductTrocStatus.AVAILABLE),
                        anyLong(),
                        anyLong()))
                .thenReturn(Collections.emptyList());

        // When & Then
        assertThrows(
                NotFoundException.class,
                () -> {
                    triangularExchangeService.autoCreateTriangularExchange(
                            wantedProductId, requesterId);
                });
    }

    @Test
    void updateProposedProduct_Success() {
        // Given
        Long exchangeId = 1L;
        UUID participantId = userA.getId();

        TriangularExchange exchange = new TriangularExchange();
        exchange.setStatus(ExchangeStatus.PENDING); // L'échange doit être en attente

        TriangularExchangeParticipant participant = new TriangularExchangeParticipant();
        participant.setParticipant(userA);
        participant.setOfferedProduct(productA); // Ancien produit

        // Nouveau produit de remplacement (valide et appartenant à User A)
        ProductTroc newProduct = new ProductTroc();
        newProduct.setId(99L);
        newProduct.setAuthor(userA);
        newProduct.setStatus(ProductTrocStatus.AVAILABLE);

        when(triangularExchangeRepository.findById(exchangeId)).thenReturn(Optional.of(exchange));
        when(participantRepository.findByTriangularExchangeIdAndParticipantId(
                        exchangeId, participantId))
                .thenReturn(Optional.of(participant));
        when(productTrocRepository.findById(99L)).thenReturn(Optional.of(newProduct));

        // When
        triangularExchangeService.updateProposedProduct(exchangeId, participantId, 99L);

        // Then
        assertEquals(newProduct, participant.getOfferedProduct());
        verify(participantRepository, times(1)).save(participant);
    }

    @Test
    void updateProposedProduct_ThrowsException_WhenExchangeAlreadyAccepted() {
        // Given
        Long exchangeId = 1L;
        UUID participantId = userA.getId();

        TriangularExchange exchange = new TriangularExchange();
        exchange.setStatus(ExchangeStatus.ACCEPTED); // ÉCHANGE DÉJÀ VALIDÉ (Bloquant)

        when(triangularExchangeRepository.findById(exchangeId)).thenReturn(Optional.of(exchange));

        // When & Then
        assertThrows(
                IllegalStateException.class,
                () -> {
                    triangularExchangeService.updateProposedProduct(exchangeId, participantId, 99L);
                });
        verify(participantRepository, never()).save(any());
    }
}

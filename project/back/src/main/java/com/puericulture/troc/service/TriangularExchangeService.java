package com.puericulture.troc.service;

import com.puericulture.common.entity.Person;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.ForbiddenException;
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
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TriangularExchangeService {

    private final TriangularExchangeRepository triangularExchangeRepository;
    private final TriangularExchangeParticipantRepository participantRepository;
    private final ProductTrocRepository productTrocRepository;
    private final PersonRepository personRepository;
    private final ExchangeRepository exchangeRepository;
    private final TriangularExchangeMapper triangularExchangeMapper;

    /** Proposer un nouvel échange triangulaire (Création de la boucle) */
    @Transactional
    public TriangularExchangeResponse createTriangularExchange(
            CreateTriangularExchangeRequest request, UUID connectedUserId) {
        if (request.getParticipants() == null || request.getParticipants().size() < 3) {
            throw new BadRequestException(
                    "A triangular exchange must involve at least 3 participants.");
        }

        // 1. Initialisation de la transaction parente
        TriangularExchange exchange = new TriangularExchange();
        exchange.setStatus(ExchangeStatus.PENDING);
        exchange.setCreatedAt(OffsetDateTime.now());

        final TriangularExchange savedExchange = triangularExchangeRepository.save(exchange);
        List<TriangularExchangeParticipant> participantsList = new ArrayList<>();

        boolean isConnectedUserInvolved = false;

        // 2. Traitement et vérification de chaque maillon de la chaîne
        for (TriangularParticipantRequest partRequest : request.getParticipants()) {
            ProductTroc offeredProduct =
                    productTrocRepository
                            .findById(partRequest.getOfferedProductId())
                            .orElseThrow(
                                    () ->
                                            new NotFoundException(
                                                    "Offered product not found: "
                                                            + partRequest.getOfferedProductId()));

            ProductTroc wantedProduct =
                    productTrocRepository
                            .findById(partRequest.getWantedProductId())
                            .orElseThrow(
                                    () ->
                                            new NotFoundException(
                                                    "Wanted product not found: "
                                                            + partRequest.getWantedProductId()));

            Person participant =
                    personRepository
                            .findById(partRequest.getParticipantId())
                            .orElseThrow(
                                    () ->
                                            new NotFoundException(
                                                    "Participant not found: "
                                                            + partRequest.getParticipantId()));

            // RÈGLE MÉTIER : L'article ne doit pas être fermé ou déjà dans un échange validé/en
            // cours
            if (offeredProduct.getStatus() == ProductTrocStatus.CLOSED
                    || offeredProduct.getStatus() == ProductTrocStatus.PENDING) {
                throw new BadRequestException(
                        "Product " + offeredProduct.getId() + " is currently unavailable.");
            }

            // Vérifier que l'utilisateur qui fait la requête est bien un des acteurs du triangle
            if (participant.getId().equals(connectedUserId)) {
                isConnectedUserInvolved = true;
            }

            TriangularExchangeParticipant participantEntity = new TriangularExchangeParticipant();
            participantEntity.setTriangularExchange(savedExchange);
            participantEntity.setParticipant(participant);
            participantEntity.setOfferedProduct(offeredProduct);
            participantEntity.setWantedProduct(wantedProduct);
            participantEntity.setStepOrder(partRequest.getStepOrder());
            participantEntity.setStatus(ExchangeStatus.PENDING);

            participantsList.add(participantEntity);
        }

        // SÉCURITÉ : Interdiction d'initier une boucle qui ne nous concerne pas
        if (!isConnectedUserInvolved) {
            throw new ForbiddenException(
                    "You can only propose an exchange cycle that includes one of your products.");
        }

        participantRepository.saveAll(participantsList);
        savedExchange.setParticipants(participantsList);

        return triangularExchangeMapper.toResponse(savedExchange);
    }

    /** Accepter individuellement la proposition d'échange triangulaire */
    @Transactional
    public void acceptTriangularExchange(Long exchangeId, UUID connectedUserId) {
        TriangularExchange exchange =
                triangularExchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Triangular exchange not found"));

        if (exchange.getStatus() != ExchangeStatus.PENDING) {
            throw new BadRequestException("Only pending triangular exchanges can be accepted.");
        }

        // Utilisation directe du Repository au lieu d'un stream filter
        TriangularExchangeParticipant currentParticipant =
                participantRepository
                        .findByTriangularExchangeIdAndParticipantId(exchangeId, connectedUserId)
                        .orElseThrow(
                                () ->
                                        new ForbiddenException(
                                                "You are not a participant in this exchange."));

        if (currentParticipant.getStatus() == ExchangeStatus.ACCEPTED) {
            throw new BadRequestException("You have already accepted this exchange.");
        }

        // Enregistrement du vote positif
        currentParticipant.setStatus(ExchangeStatus.ACCEPTED);
        currentParticipant.setAcceptedAt(OffsetDateTime.now());
        participantRepository.save(currentParticipant);

        // RÈGLE MÉTIER : Si tout le monde a accepté, le statut global bascule
        boolean allAccepted =
                exchange.getParticipants().stream()
                        .allMatch(p -> p.getStatus() == ExchangeStatus.ACCEPTED);

        if (allAccepted) {
            exchange.setStatus(ExchangeStatus.ACCEPTED); // Devient actif (En négociation)

            // Verrouillage de tous les articles du cycle et annulation des conflits simples
            for (TriangularExchangeParticipant p : exchange.getParticipants()) {
                ProductTroc product = p.getOfferedProduct();
                product.setStatus(ProductTrocStatus.PENDING);
                productTrocRepository.save(product);

                // Annuler les propositions d'échanges simples en attente sur ce produit désormais
                // bloqué
                List<Exchange> conflictingSimpleExchanges =
                        exchangeRepository.findConflictingPendingExchanges(
                                ExchangeStatus.PENDING, 0L, product.getId(), product.getId());
                for (Exchange simpleEx : conflictingSimpleExchanges) {
                    simpleEx.setStatus(ExchangeStatus.REFUSED);
                }
                exchangeRepository.saveAll(conflictingSimpleExchanges);
            }

            triangularExchangeRepository.save(exchange);
        }
    }

    /** Refuser ou Annuler l'échange (Effet domino atomique) */
    @Transactional
    public void refuseTriangularExchange(Long exchangeId, UUID connectedUserId) {
        TriangularExchange exchange =
                triangularExchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Triangular exchange not found"));

        if (exchange.getStatus() != ExchangeStatus.PENDING
                && exchange.getStatus() != ExchangeStatus.ACCEPTED) {
            throw new BadRequestException("Only pending or accepted exchanges can be refused.");
        }

        // Utilisation directe du Repository pour la vérification de sécurité
        boolean isParticipant =
                participantRepository
                        .findByTriangularExchangeIdAndParticipantId(exchangeId, connectedUserId)
                        .isPresent();

        if (!isParticipant) {
            throw new ForbiddenException("You do not have permission to refuse this exchange.");
        }

        // RÈGLE MÉTIER : Un refus annule tout pour tout le monde
        exchange.setStatus(ExchangeStatus.REFUSED);

        for (TriangularExchangeParticipant p : exchange.getParticipants()) {
            p.setStatus(ExchangeStatus.REFUSED);

            // Si l'échange était déjà accepté globalement, les articles étaient bloqués. On les
            // libère.
            ProductTroc product = p.getOfferedProduct();
            if (product.getStatus() == ProductTrocStatus.PENDING) {
                product.setStatus(ProductTrocStatus.AVAILABLE);
                productTrocRepository.save(product);
            }
        }

        participantRepository.saveAll(exchange.getParticipants());
        triangularExchangeRepository.save(exchange);
    }

    /** Confirmer et clôturer définitivement l'échange (Fin du cycle de troc) */
    @Transactional
    public void confirmTriangularExchange(Long exchangeId, UUID connectedUserId) {
        TriangularExchange exchange =
                triangularExchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Triangular exchange not found"));

        if (exchange.getStatus() != ExchangeStatus.ACCEPTED) {
            throw new BadRequestException(
                    "Only accepted exchanges (in negotiation) can be confirmed.");
        }

        // Vérification de sécurité via Repository
        boolean isParticipant =
                participantRepository
                        .findByTriangularExchangeIdAndParticipantId(exchangeId, connectedUserId)
                        .isPresent();

        if (!isParticipant) {
            throw new ForbiddenException("You cannot confirm this exchange.");
        }

        // Clôture de l'échange global
        exchange.setStatus(ExchangeStatus.CONFIRMED);

        // Clôture définitive de toutes les annonces impliquées
        for (TriangularExchangeParticipant p : exchange.getParticipants()) {
            ProductTroc product = p.getOfferedProduct();
            product.setStatus(ProductTrocStatus.CLOSED);
            productTrocRepository.save(product);
        }

        triangularExchangeRepository.save(exchange);
    }

    @Transactional
    public void updateProposedProduct(Long exchangeId, UUID participantId, Long newProductId) {
        TriangularExchange exchange =
                triangularExchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(
                                () -> new NotFoundException("Échange triangulaire introuvable"));

        // RÈGLE MÉTIER : On ne peut modifier son produit que si l'échange est encore en attente
        // (PENDING)
        if (exchange.getStatus() != ExchangeStatus.PENDING) {
            throw new IllegalStateException(
                    "Impossible de modifier votre article si l'échange n'est plus en attente.");
        }

        TriangularExchangeParticipant participant =
                participantRepository
                        .findByTriangularExchangeIdAndParticipantId(exchangeId, participantId)
                        .orElseThrow(
                                () ->
                                        new BadRequestException(
                                                "Vous ne participez pas à cet échange."));

        ProductTroc newProduct =
                productTrocRepository
                        .findById(newProductId)
                        .orElseThrow(
                                () ->
                                        new NotFoundException(
                                                "Le nouveau produit spécifié n'existe pas."));

        // Vérifier que le nouveau produit appartient bien à l'utilisateur connecté
        if (!newProduct.getAuthor().getId().equals(participantId)) {
            throw new BadRequestException("Ce produit ne vous appartient pas.");
        }

        // Vérifier que le produit est disponible
        if (newProduct.getStatus() != ProductTrocStatus.AVAILABLE) {
            throw new IllegalArgumentException("Ce produit n'est pas disponible pour un échange.");
        }

        // Mise à jour de l'article proposé
        participant.setOfferedProduct(newProduct);

        // Optionnel selon ta logique : Si le maillon suivant change, le wantedProduct du maillon
        // d'après
        // doit aussi être mis à jour si ton modèle lie strictement les étapes.

        participantRepository.save(participant);
    }

    @Transactional
    public TriangularExchangeResponse autoCreateTriangularExchange(
            Long wantedProductId, UUID requesterId) {
        // 1. Récupérer le produit cible (Produit B)
        ProductTroc productB =
                productTrocRepository
                        .findById(wantedProductId)
                        .orElseThrow(() -> new NotFoundException("Produit convoité introuvable"));

        Person userB = productB.getAuthor();
        Long targetPrice = productB.getEstimatedPrice();

        if (userB.getId().equals(requesterId)) {
            throw new IllegalArgumentException(
                    "Vous ne pouvez pas proposer un échange sur votre propre produit.");
        }

        // 2. Trouver un produit de l'utilisateur connecté (Produit A) avec un prix similaire (ex:
        // +/- 20%)
        long minPrice = (long) (targetPrice * 0.8);
        long maxPrice = (long) (targetPrice * 1.2);

        List<ProductTroc> myAvailableProducts =
                productTrocRepository.findByAuthorIdAndStatusAndEstimatedPriceBetween(
                        requesterId, ProductTrocStatus.AVAILABLE, minPrice, maxPrice);

        if (myAvailableProducts.isEmpty()) {
            throw new NotFoundException(
                    "Vous n'avez aucun produit disponible avec un prix similaire pour l'échange.");
        }
        ProductTroc productA = myAvailableProducts.get(0); // On prend le premier qui match

        // 3. Trouver un troisième produit (Produit C) d'un autre utilisateur (User C)
        // Idéalement, User B doit vouloir le produit C, et User C doit vouloir le produit A.
        // Sans système de "Wishlist" explicite, on cherche un produit C disponible dans la même
        // gamme de prix
        // appartenant à quelqu'un d'autre que A et B.
        List<ProductTroc> potentialProductsC =
                productTrocRepository.findThirdPartyProductsForTriangle(
                        requesterId,
                        userB.getId(),
                        ProductTrocStatus.AVAILABLE,
                        minPrice,
                        maxPrice);

        if (potentialProductsC.isEmpty()) {
            throw new NotFoundException(
                    "Impossible de trouver un troisième partenaire pour fermer la boucle de troc.");
        }
        ProductTroc productC = potentialProductsC.get(0);
        Person userC = productC.getAuthor();

        // 4. Construire la structure de l'échange triangulaire
        TriangularExchange exchange = new TriangularExchange();
        exchange.setStatus(ExchangeStatus.PENDING);
        exchange.setCreatedAt(OffsetDateTime.now());
        TriangularExchange savedExchange = triangularExchangeRepository.save(exchange);

        // Création des 3 participants (La boucle)
        List<TriangularExchangeParticipant> participants = new ArrayList<>();

        // Participant A (Demandeur) : Donne A, reçoit B
        participants.add(
                createParticipant(
                        savedExchange,
                        personRepository.findById(requesterId).get(),
                        productA,
                        productB,
                        1,
                        ExchangeStatus.ACCEPTED)); // Automatiquement accepté par le créateur

        // Participant B : Donne B, reçoit C
        participants.add(
                createParticipant(
                        savedExchange, userB, productB, productC, 2, ExchangeStatus.PENDING));

        // Participant C : Donne C, reçoit A
        participants.add(
                createParticipant(
                        savedExchange, userC, productC, productA, 3, ExchangeStatus.PENDING));

        participantRepository.saveAll(participants);
        savedExchange.setParticipants(participants);

        return triangularExchangeMapper.toResponse(savedExchange);
    }

    private TriangularExchangeParticipant createParticipant(
            TriangularExchange ext,
            Person p,
            ProductTroc off,
            ProductTroc want,
            int order,
            ExchangeStatus status) {
        TriangularExchangeParticipant tp = new TriangularExchangeParticipant();
        tp.setTriangularExchange(ext);
        tp.setParticipant(p);
        tp.setOfferedProduct(off);
        tp.setWantedProduct(want);
        tp.setStepOrder(order);
        tp.setStatus(status);
        return tp;
    }
}

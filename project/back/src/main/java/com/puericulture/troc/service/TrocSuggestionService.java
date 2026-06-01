package com.puericulture.troc.service;

import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.CreateExchangeRequest;
import com.puericulture.troc.dto.ExchangeResponse;
import com.puericulture.troc.dto.ProductTrocDto;
import com.puericulture.troc.dto.TrocSuggestionResponse;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.entity.ProductTrocStatus;
import com.puericulture.troc.entity.TrocSuggestion;
import com.puericulture.troc.entity.TrocSuggestionStatus;
import com.puericulture.troc.mapper.ProductTrocMapper;
import com.puericulture.troc.repository.ExchangeRepository;
import com.puericulture.troc.repository.ProductTrocRepository;
import com.puericulture.troc.repository.TrocSuggestionRepository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TrocSuggestionService {

    private static final int MAX_SUGGESTIONS = 10;
    private static final int MINIMUM_COMPATIBILITY_SCORE = 40;

    private final ProductTrocRepository productTrocRepository;
    private final TrocSuggestionRepository trocSuggestionRepository;
    private final ExchangeRepository exchangeRepository;
    private final ProductTrocMapper productTrocMapper;
    private final ExchangeService exchangeService;

    public TrocSuggestionService(
            ProductTrocRepository productTrocRepository,
            TrocSuggestionRepository trocSuggestionRepository,
            ExchangeRepository exchangeRepository,
            ProductTrocMapper productTrocMapper,
            ExchangeService exchangeService) {
        this.productTrocRepository = productTrocRepository;
        this.trocSuggestionRepository = trocSuggestionRepository;
        this.exchangeRepository = exchangeRepository;
        this.productTrocMapper = productTrocMapper;
        this.exchangeService = exchangeService;
    }

    @Transactional
    public List<TrocSuggestionResponse> getSuggestionsForConnectedUser(UUID connectedUserId) {
        List<TrocSuggestion> activeSuggestions =
                new ArrayList<>(
                        trocSuggestionRepository.findActiveSuggestionsForUser(
                                connectedUserId, TrocSuggestionStatus.ACTIVE));

        if (activeSuggestions.size() >= MAX_SUGGESTIONS) {
            return activeSuggestions.stream().limit(MAX_SUGGESTIONS).map(this::toResponse).toList();
        }

        List<TrocSuggestion> generatedSuggestions = generateNewSuggestions(connectedUserId);
        if (!generatedSuggestions.isEmpty()) {
            activeSuggestions.addAll(trocSuggestionRepository.saveAll(generatedSuggestions));
        }

        return activeSuggestions.stream()
                .sorted(Comparator.comparing(TrocSuggestion::getCompatibilityScore).reversed())
                .limit(MAX_SUGGESTIONS)
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TrocSuggestionResponse getSuggestionDetails(Long suggestionId, UUID connectedUserId) {
        TrocSuggestion suggestion = findSuggestionForUser(suggestionId, connectedUserId);
        return toResponse(suggestion);
    }

    @Transactional
    public void ignoreSuggestion(Long suggestionId, UUID connectedUserId) {
        TrocSuggestion suggestion = findSuggestionForUser(suggestionId, connectedUserId);
        suggestion.setStatus(TrocSuggestionStatus.IGNORED);
        trocSuggestionRepository.save(suggestion);
    }

    @Transactional
    public ExchangeResponse acceptSuggestion(Long suggestionId, UUID connectedUserId) {
        TrocSuggestion suggestion = findSuggestionForUser(suggestionId, connectedUserId);

        if (suggestion.getStatus() != TrocSuggestionStatus.ACTIVE) {
            throw new BadRequestException("Only active suggestions can be accepted");
        }

        CreateExchangeRequest request = new CreateExchangeRequest();
        request.setProposerProduct(suggestion.getRequesterProduct());
        request.setReceiverProduct(suggestion.getSuggestedProduct());

        ExchangeResponse exchangeResponse =
                exchangeService.createExchange(request, connectedUserId);
        suggestion.setStatus(TrocSuggestionStatus.ACCEPTED);
        trocSuggestionRepository.save(suggestion);
        return exchangeResponse;
    }

    private List<TrocSuggestion> generateNewSuggestions(UUID connectedUserId) {
        List<ProductTroc> requesterProducts =
                productTrocRepository.findAvailableProductsByAuthor(
                        connectedUserId, ProductTrocStatus.AVAILABLE);
        List<ProductTroc> availableProducts =
                productTrocRepository.findAvailableProductsNotOwnedByAuthor(
                        connectedUserId, ProductTrocStatus.AVAILABLE);

        List<TrocSuggestion> suggestions = new ArrayList<>();

        for (ProductTroc requesterProduct : requesterProducts) {
            for (ProductTroc suggestedProduct : availableProducts) {
                if (!canSuggestProductPair(connectedUserId, requesterProduct, suggestedProduct)) {
                    continue;
                }

                CompatibilityResult compatibility =
                        calculateCompatibility(requesterProduct, suggestedProduct);
                if (compatibility.score() < MINIMUM_COMPATIBILITY_SCORE) {
                    continue;
                }

                TrocSuggestion suggestion = new TrocSuggestion();
                suggestion.setConnectedUser(requesterProduct.getAuthor());
                suggestion.setRequesterProduct(requesterProduct);
                suggestion.setSuggestedProduct(suggestedProduct);
                suggestion.setCompatibilityScore(compatibility.score());
                suggestion.setCompatibilityReason(compatibility.reason());
                suggestion.setDistanceKm(calculateDistanceKm(requesterProduct, suggestedProduct));
                suggestion.setStatus(TrocSuggestionStatus.ACTIVE);
                suggestions.add(suggestion);
            }
        }

        return suggestions.stream()
                .sorted(Comparator.comparing(TrocSuggestion::getCompatibilityScore).reversed())
                .limit(MAX_SUGGESTIONS)
                .toList();
    }

    private boolean canSuggestProductPair(
            UUID connectedUserId, ProductTroc requesterProduct, ProductTroc suggestedProduct) {
        if (requesterProduct.getId() == null || suggestedProduct.getId() == null) {
            return false;
        }

        if (Objects.equals(requesterProduct.getId(), suggestedProduct.getId())) {
            return false;
        }

        if (suggestedProduct.getAuthor() == null
                || Objects.equals(suggestedProduct.getAuthor().getId(), connectedUserId)) {
            return false;
        }

        if (exchangeRepository.existsBetweenProducts(
                requesterProduct.getId(), suggestedProduct.getId())) {
            return false;
        }

        return !trocSuggestionRepository.existsSuggestionForProductPair(
                connectedUserId, requesterProduct.getId(), suggestedProduct.getId());
    }

    private CompatibilityResult calculateCompatibility(
            ProductTroc requesterProduct, ProductTroc suggestedProduct) {
        int score = 0;
        List<String> reasons = new ArrayList<>();

        if (Objects.equals(requesterProduct.getCategory(), suggestedProduct.getCategory())) {
            score += 50;
            reasons.add("même catégorie");
        }

        if (isSameCity(requesterProduct, suggestedProduct)) {
            score += 15;
            reasons.add("même ville");
        }

        int priceScore = calculatePriceScore(requesterProduct, suggestedProduct);
        if (priceScore > 0) {
            score += priceScore;
            reasons.add(priceScore == 15 ? "prix proche" : "prix compatible");
        }

        if (isSameNonBlank(requesterProduct.getCondition(), suggestedProduct.getCondition())) {
            score += 10;
            reasons.add("état similaire");
        }

        if (hasCompatibleAgeRange(requesterProduct, suggestedProduct)) {
            score += 10;
            reasons.add("âge compatible");
        }

        if (isSameNonBlank(requesterProduct.getBrand(), suggestedProduct.getBrand())) {
            score += 5;
            reasons.add("même marque");
        }

        if (isSameNonBlank(requesterProduct.getModel(), suggestedProduct.getModel())) {
            score += 5;
            reasons.add("même modèle");
        }

        int boundedScore = Math.min(score, 100);
        String reason =
                reasons.isEmpty()
                        ? "Suggestion générique basée sur les annonces disponibles"
                        : "Compatibilité : " + String.join(", ", reasons);

        return new CompatibilityResult(boundedScore, reason);
    }

    private int calculatePriceScore(ProductTroc requesterProduct, ProductTroc suggestedProduct) {
        Long requesterPrice = requesterProduct.getEstimatedPrice();
        Long suggestedPrice = suggestedProduct.getEstimatedPrice();

        if (requesterPrice == null
                || suggestedPrice == null
                || requesterPrice <= 0
                || suggestedPrice <= 0) {
            return 0;
        }

        double highestPrice = Math.max(requesterPrice, suggestedPrice);
        double differenceRatio = Math.abs(requesterPrice - suggestedPrice) / highestPrice;

        if (differenceRatio <= 0.20) {
            return 15;
        }

        if (differenceRatio <= 0.50) {
            return 8;
        }

        return 0;
    }

    private boolean hasCompatibleAgeRange(
            ProductTroc requesterProduct, ProductTroc suggestedProduct) {
        Integer requesterMinAge = requesterProduct.getMinAgeMonths();
        Integer requesterMaxAge = requesterProduct.getMaxAgeMonths();
        Integer suggestedMinAge = suggestedProduct.getMinAgeMonths();
        Integer suggestedMaxAge = suggestedProduct.getMaxAgeMonths();

        if (requesterMinAge == null
                || requesterMaxAge == null
                || suggestedMinAge == null
                || suggestedMaxAge == null) {
            return false;
        }

        return requesterMinAge <= suggestedMaxAge && suggestedMinAge <= requesterMaxAge;
    }

    private Double calculateDistanceKm(ProductTroc requesterProduct, ProductTroc suggestedProduct) {
        if (isSameCity(requesterProduct, suggestedProduct)) {
            return 0.0;
        }

        return null;
    }

    private boolean isSameCity(ProductTroc requesterProduct, ProductTroc suggestedProduct) {
        return isSameNonBlank(requesterProduct.getCity(), suggestedProduct.getCity());
    }

    private boolean isSameNonBlank(String firstValue, String secondValue) {
        return firstValue != null
                && secondValue != null
                && !firstValue.isBlank()
                && !secondValue.isBlank()
                && firstValue.trim().equalsIgnoreCase(secondValue.trim());
    }

    private TrocSuggestion findSuggestionForUser(Long suggestionId, UUID connectedUserId) {
        return trocSuggestionRepository
                .findSuggestionForUser(suggestionId, connectedUserId)
                .orElseThrow(() -> new NotFoundException("Troc suggestion not found"));
    }

    private TrocSuggestionResponse toResponse(TrocSuggestion suggestion) {
        ProductTrocDto requesterProduct = productTrocMapper.toDto(suggestion.getRequesterProduct());
        ProductTrocDto suggestedProduct = productTrocMapper.toDto(suggestion.getSuggestedProduct());

        return TrocSuggestionResponse.builder()
                .id(suggestion.getId())
                .requesterProduct(requesterProduct)
                .suggestedProduct(suggestedProduct)
                .otherUser(suggestedProduct.getAuthor())
                .compatibilityScore(suggestion.getCompatibilityScore())
                .compatibilityReason(suggestion.getCompatibilityReason())
                .distanceKm(suggestion.getDistanceKm())
                .status(suggestion.getStatus())
                .createdAt(suggestion.getCreatedAt())
                .build();
    }

    private record CompatibilityResult(int score, String reason) {}
}

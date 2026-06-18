package com.puericulture.troc.service;

import com.puericulture.troc.dto.ProductTrocDto;
import com.puericulture.troc.dto.ProductTrocSuggestionDto;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.entity.ProductTrocStatus;
import com.puericulture.troc.mapper.ProductTrocMapper;
import com.puericulture.troc.repository.ExchangeRepository;
import com.puericulture.troc.repository.ProductTrocRepository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TrocSuggestionService {

    private static final int MAX_SUGGESTIONS = 8;
    private static final int MINIMUM_PERTINENCE_SCORE = 40;

    private final ProductTrocRepository productTrocRepository;
    private final ExchangeRepository exchangeRepository;
    private final ProductTrocMapper productTrocMapper;

    public TrocSuggestionService(
            ProductTrocRepository productTrocRepository,
            ExchangeRepository exchangeRepository,
            ProductTrocMapper productTrocMapper) {
        this.productTrocRepository = productTrocRepository;
        this.exchangeRepository = exchangeRepository;
        this.productTrocMapper = productTrocMapper;
    }

    @Transactional(readOnly = true)
    public List<ProductTrocSuggestionDto> getSuggestionsForConnectedUser(UUID connectedUserId) {
        List<ProductTroc> requesterProducts =
                productTrocRepository.findAvailableProductsByAuthor(
                        connectedUserId, ProductTrocStatus.AVAILABLE);
        List<ProductTroc> availableProducts =
                productTrocRepository.findAvailableProductsNotOwnedByAuthor(
                        connectedUserId, ProductTrocStatus.AVAILABLE);

        if (requesterProducts.isEmpty() || availableProducts.isEmpty()) {
            return List.of();
        }

        return availableProducts.stream()
                .map(candidate -> buildBestSuggestionForCandidate(requesterProducts, candidate))
                .flatMap(Optional::stream)
                .filter(suggestion -> suggestion.getIndicePertinence() >= MINIMUM_PERTINENCE_SCORE)
                .sorted(
                        Comparator.comparing(ProductTrocSuggestionDto::getIndicePertinence)
                                .reversed())
                .limit(MAX_SUGGESTIONS)
                .toList();
    }

    private Optional<ProductTrocSuggestionDto> buildBestSuggestionForCandidate(
            List<ProductTroc> requesterProducts, ProductTroc candidateProduct) {
        SuggestionMatch bestMatch = null;

        for (ProductTroc requesterProduct : requesterProducts) {
            if (!canSuggestProductPair(requesterProduct, candidateProduct)) {
                continue;
            }

            PertinenceResult pertinence = calculatePertinence(requesterProduct, candidateProduct);
            if (bestMatch == null || pertinence.score() > bestMatch.pertinence().score()) {
                bestMatch = new SuggestionMatch(candidateProduct, pertinence);
            }
        }

        if (bestMatch == null) {
            return Optional.empty();
        }

        ProductTrocDto productDto = productTrocMapper.toDto(bestMatch.product());
        ProductTrocSuggestionDto suggestionDto = new ProductTrocSuggestionDto();
        BeanUtils.copyProperties(productDto, suggestionDto);
        suggestionDto.setIndicePertinence(bestMatch.pertinence().score());
        suggestionDto.setPertinenceReason(bestMatch.pertinence().reason());
        return Optional.of(suggestionDto);
    }

    private boolean canSuggestProductPair(
            ProductTroc requesterProduct, ProductTroc suggestedProduct) {
        if (requesterProduct.getId() == null || suggestedProduct.getId() == null) {
            return false;
        }

        if (Objects.equals(requesterProduct.getId(), suggestedProduct.getId())) {
            return false;
        }

        if (suggestedProduct.getAuthor() == null
                || requesterProduct.getAuthor() == null
                || Objects.equals(
                        suggestedProduct.getAuthor().getId(),
                        requesterProduct.getAuthor().getId())) {
            return false;
        }

        return !exchangeRepository.existsBetweenProducts(
                requesterProduct.getId(), suggestedProduct.getId());
    }

    private PertinenceResult calculatePertinence(
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
            reasons.add("tranche d'âge compatible");
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
                        ? "Suggestion basée sur les annonces de troc disponibles"
                        : "Pertinence : " + String.join(", ", reasons);

        return new PertinenceResult(boundedScore, reason);
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

    private record PertinenceResult(int score, String reason) {}

    private record SuggestionMatch(ProductTroc product, PertinenceResult pertinence) {}
}

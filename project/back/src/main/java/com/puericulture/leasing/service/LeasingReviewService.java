package com.puericulture.leasing.service;

import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.leasing.dto.CreateLeasingReviewRequest;
import com.puericulture.leasing.dto.LeasingProductReviewsResponse;
import com.puericulture.leasing.dto.LeasingReviewDto;
import com.puericulture.leasing.entity.LeasingReview;
import com.puericulture.leasing.mapper.LeasingReviewMapper;
import com.puericulture.leasing.repository.LeasingReviewRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * STRATEGIC INTENT: Orchestrates the business logic for childcare leasing reviews. WHY THIS
 * MATTERS: Validates order eligibility, ownership, and uniqueness constraints before persisting
 * reviews, protecting database integrity from unauthorized submissions.
 */
@Service
@RequiredArgsConstructor
public class LeasingReviewService {

    private final LeasingReviewRepository leasingReviewRepository;
    private final LeasingReviewMapper leasingReviewMapper;

    /**
     * Retrieves all reviews left by users for a specific childcare product in the catalog. Returns
     * them formatted as DTOs sorted by date in descending order inside a statistics wrapper.
     */
    @Transactional(readOnly = true)
    public LeasingProductReviewsResponse getReviewsForProduct(Long leasingId) {
        List<LeasingReviewDto> reviews =
                leasingReviewRepository.findAllByLeasingId(leasingId).stream()
                        .map(leasingReviewMapper::toDto)
                        .map(
                                dto -> {
                                    if (dto.getReviewerName() != null) {
                                        String name = dto.getReviewerName().trim();
                                        String[] parts = name.split(" ");
                                        dto.setReviewerName(parts[0]);
                                    } else {
                                        dto.setReviewerName("Parent Anonyme");
                                    }
                                    return dto;
                                })
                        .toList();

        int totalReviews = reviews.size();
        Double averageRating = null;
        if (totalReviews > 0) {
            double sum = reviews.stream().mapToDouble(LeasingReviewDto::getRating).sum();
            averageRating = Math.round((sum / totalReviews) * 10.0) / 10.0;
        }

        return LeasingProductReviewsResponse.builder()
                .averageRating(averageRating)
                .totalReviews(totalReviews)
                .reviews(reviews)
                .build();
    }

    /**
     * Submits a new review for a leased product. Validates that the order exists, belongs to the
     * authenticated user, is for the correct product, and that the user hasn't already left a
     * review for this order.
     */
    @Transactional
    public void createReview(String personId, Long leasingId, CreateLeasingReviewRequest request) {
        // 1. Validate order ownership and product eligibility
        if (!leasingReviewRepository.isOrderEligibleForReview(
                request.getLeasingOrderId(), personId, leasingId)) {
            throw new BadRequestException(
                    "Cette commande n'existe pas, ne vous appartient pas ou ne correspond pas à ce produit.");
        }

        // 2. Retrieve existing review for this order if it exists (for update/modification support)
        Optional<LeasingReview> existingReviewOpt =
                leasingReviewRepository.findByLeasingOrderId(request.getLeasingOrderId());

        if (existingReviewOpt.isPresent()) {
            // Update existing review (modification)
            LeasingReview existingReview = existingReviewOpt.get();
            existingReview.setRating(request.getRating());
            existingReview.setComment(request.getComment());
            leasingReviewRepository.save(existingReview);
        } else {
            // Create a new review (reviewDate is set automatically via @CreationTimestamp)
            LeasingReview review =
                    LeasingReview.builder()
                            .leasingOrderId(request.getLeasingOrderId())
                            .leasingId(leasingId)
                            .rating(request.getRating())
                            .comment(request.getComment())
                            .build();
            leasingReviewRepository.save(review);
        }
    }
}

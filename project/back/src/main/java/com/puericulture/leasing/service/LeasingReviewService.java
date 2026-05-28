package com.puericulture.leasing.service;

import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.leasing.dto.CreateLeasingReviewRequest;
import com.puericulture.leasing.dto.LeasingReviewDto;
import com.puericulture.leasing.entity.LeasingReview;
import com.puericulture.leasing.mapper.LeasingReviewMapper;
import com.puericulture.leasing.repository.LeasingReviewRepository;
import java.util.List;
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
     * them formatted as DTOs sorted by date in descending order.
     */
    @Transactional(readOnly = true)
    public List<LeasingReviewDto> getReviewsForProduct(Long leasingId) {
        return leasingReviewRepository.findAllByLeasingId(leasingId).stream()
                .map(leasingReviewMapper::toDto)
                .toList();
    }

    /**
     * Submits a new review for a leased product. Validates that the order exists, belongs to the
     * authenticated user, is for the correct product, and that the user hasn't already left a
     * review for this order.
     */
    @Transactional
    public void createReview(String personId, Long leasingId, CreateLeasingReviewRequest request) {
        // 1. Check if a review already exists for this order (UNIQUE constraint)
        if (leasingReviewRepository.existsByLeasingOrderId(request.getLeasingOrderId())) {
            throw new BadRequestException(
                    "Un avis a déjà été soumis pour cette commande de location.");
        }

        // 2. Validate order ownership and product eligibility
        if (!leasingReviewRepository.isOrderEligibleForReview(
                request.getLeasingOrderId(), personId, leasingId)) {
            throw new BadRequestException(
                    "Cette commande n'existe pas, ne vous appartient pas ou ne correspond pas à ce produit.");
        }

        // 3. Persist the review entity (reviewDate is set automatically via @CreationTimestamp)
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

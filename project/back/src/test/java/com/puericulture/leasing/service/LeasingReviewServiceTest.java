package com.puericulture.leasing.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.leasing.dto.CreateLeasingReviewRequest;
import com.puericulture.leasing.dto.LeasingProductReviewsResponse;
import com.puericulture.leasing.dto.LeasingReviewDto;
import com.puericulture.leasing.dto.LeasingReviewSummary;
import com.puericulture.leasing.entity.LeasingReview;
import com.puericulture.leasing.mapper.LeasingReviewMapper;
import com.puericulture.leasing.repository.LeasingReviewRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LeasingReviewServiceTest {

    @Mock private LeasingReviewRepository leasingReviewRepository;

    @Mock private LeasingReviewMapper leasingReviewMapper;

    @InjectMocks private LeasingReviewService leasingReviewService;

    @Mock private LeasingReviewSummary mockSummary;

    @Test
    void getReviewsForProduct_returnsMappedDtos() {
        Long leasingId = 1L;
        LeasingReviewDto dto =
                LeasingReviewDto.builder()
                        .reviewerName("Test User")
                        .rating(5)
                        .reviewDate(Instant.now())
                        .comment("Excellent !")
                        .build();

        when(leasingReviewRepository.findAllByLeasingId(leasingId))
                .thenReturn(List.of(mockSummary));
        when(leasingReviewMapper.toDto(mockSummary)).thenReturn(dto);

        LeasingProductReviewsResponse result = leasingReviewService.getReviewsForProduct(leasingId);

        verify(leasingReviewRepository).findAllByLeasingId(leasingId);
        verify(leasingReviewMapper).toDto(mockSummary);
        assertThat(result.getReviews()).hasSize(1);
        assertThat(result.getReviews().get(0).getReviewerName()).isEqualTo("Test");
        assertThat(result.getTotalReviews()).isEqualTo(1);
        assertThat(result.getAverageRating()).isEqualTo(5.0);
    }

    @Test
    void createReview_throwsException_whenOrderIsNotEligible() {
        String personId = "user-uuid";
        Long leasingId = 1L;
        CreateLeasingReviewRequest request = new CreateLeasingReviewRequest();
        request.setLeasingOrderId(10L);
        request.setRating(5);
        request.setComment("Super");

        when(leasingReviewRepository.isOrderEligibleForReview(10L, personId, leasingId))
                .thenReturn(false);

        assertThatThrownBy(() -> leasingReviewService.createReview(personId, leasingId, request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage(
                        "Cette commande n'existe pas, ne vous appartient pas ou ne correspond pas à ce produit.");

        verify(leasingReviewRepository).isOrderEligibleForReview(10L, personId, leasingId);
        verify(leasingReviewRepository, never()).save(any());
    }

    @Test
    void createReview_savesNewReview_whenNoReviewExistsYet() {
        String personId = "user-uuid";
        Long leasingId = 1L;
        CreateLeasingReviewRequest request = new CreateLeasingReviewRequest();
        request.setLeasingOrderId(10L);
        request.setRating(5);
        request.setComment("Super");

        when(leasingReviewRepository.isOrderEligibleForReview(10L, personId, leasingId))
                .thenReturn(true);
        when(leasingReviewRepository.findByLeasingOrderId(10L)).thenReturn(Optional.empty());

        leasingReviewService.createReview(personId, leasingId, request);

        verify(leasingReviewRepository).isOrderEligibleForReview(10L, personId, leasingId);
        verify(leasingReviewRepository).findByLeasingOrderId(10L);
        verify(leasingReviewRepository).save(any(LeasingReview.class));
    }

    @Test
    void createReview_updatesExistingReview_whenReviewAlreadyExists() {
        String personId = "user-uuid";
        Long leasingId = 1L;
        CreateLeasingReviewRequest request = new CreateLeasingReviewRequest();
        request.setLeasingOrderId(10L);
        request.setRating(4);
        request.setComment("Updated Comment");

        LeasingReview existingReview =
                LeasingReview.builder()
                        .id(100L)
                        .leasingOrderId(10L)
                        .leasingId(leasingId)
                        .rating(5)
                        .comment("Original Comment")
                        .build();

        when(leasingReviewRepository.isOrderEligibleForReview(10L, personId, leasingId))
                .thenReturn(true);
        when(leasingReviewRepository.findByLeasingOrderId(10L))
                .thenReturn(Optional.of(existingReview));

        leasingReviewService.createReview(personId, leasingId, request);

        verify(leasingReviewRepository).isOrderEligibleForReview(10L, personId, leasingId);
        verify(leasingReviewRepository).findByLeasingOrderId(10L);
        verify(leasingReviewRepository).save(existingReview);
        assertThat(existingReview.getRating()).isEqualTo(4);
        assertThat(existingReview.getComment()).isEqualTo("Updated Comment");
    }
}

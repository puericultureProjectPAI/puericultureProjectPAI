package com.puericulture.leasing.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.leasing.dto.CreateLeasingReviewRequest;
import com.puericulture.leasing.dto.LeasingReviewDto;
import com.puericulture.leasing.dto.LeasingReviewSummary;
import com.puericulture.leasing.entity.LeasingReview;
import com.puericulture.leasing.mapper.LeasingReviewMapper;
import com.puericulture.leasing.repository.LeasingReviewRepository;
import java.time.OffsetDateTime;
import java.util.List;
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
                        .reviewDate(OffsetDateTime.now())
                        .comment("Excellent !")
                        .build();

        when(leasingReviewRepository.findAllByLeasingId(leasingId))
                .thenReturn(List.of(mockSummary));
        when(leasingReviewMapper.toDto(mockSummary)).thenReturn(dto);

        List<LeasingReviewDto> result = leasingReviewService.getReviewsForProduct(leasingId);

        verify(leasingReviewRepository).findAllByLeasingId(leasingId);
        verify(leasingReviewMapper).toDto(mockSummary);
        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(dto);
    }

    @Test
    void createReview_throwsException_whenReviewAlreadyExistsForOrder() {
        String personId = "user-uuid";
        Long leasingId = 1L;
        CreateLeasingReviewRequest request = new CreateLeasingReviewRequest();
        request.setLeasingOrderId(10L);
        request.setRating(5);
        request.setComment("Super");

        when(leasingReviewRepository.existsByLeasingOrderId(10L)).thenReturn(true);

        assertThatThrownBy(() -> leasingReviewService.createReview(personId, leasingId, request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Un avis a déjà été soumis pour cette commande de location.");

        verify(leasingReviewRepository, never()).isOrderEligibleForReview(any(), any(), any());
        verify(leasingReviewRepository, never()).save(any());
    }

    @Test
    void createReview_throwsException_whenOrderIsNotEligible() {
        String personId = "user-uuid";
        Long leasingId = 1L;
        CreateLeasingReviewRequest request = new CreateLeasingReviewRequest();
        request.setLeasingOrderId(10L);
        request.setRating(5);
        request.setComment("Super");

        when(leasingReviewRepository.existsByLeasingOrderId(10L)).thenReturn(false);
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
    void createReview_savesReview_whenValid() {
        String personId = "user-uuid";
        Long leasingId = 1L;
        CreateLeasingReviewRequest request = new CreateLeasingReviewRequest();
        request.setLeasingOrderId(10L);
        request.setRating(5);
        request.setComment("Super");

        when(leasingReviewRepository.existsByLeasingOrderId(10L)).thenReturn(false);
        when(leasingReviewRepository.isOrderEligibleForReview(10L, personId, leasingId))
                .thenReturn(true);

        leasingReviewService.createReview(personId, leasingId, request);

        verify(leasingReviewRepository).existsByLeasingOrderId(10L);
        verify(leasingReviewRepository).isOrderEligibleForReview(10L, personId, leasingId);
        verify(leasingReviewRepository).save(any(LeasingReview.class));
    }
}

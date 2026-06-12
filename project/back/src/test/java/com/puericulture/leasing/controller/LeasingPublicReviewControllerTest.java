package com.puericulture.leasing.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.puericulture.leasing.dto.LeasingProductReviewsResponse;
import com.puericulture.leasing.dto.LeasingReviewDto;
import com.puericulture.leasing.service.LeasingReviewService;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class LeasingPublicReviewControllerTest {

    @Mock private LeasingReviewService leasingReviewService;

    private LeasingPublicReviewController leasingPublicReviewController;

    @BeforeEach
    void setUp() {
        leasingPublicReviewController = new LeasingPublicReviewController(leasingReviewService);
    }

    @Test
    void getReviewsForProduct_delegatesToServiceAndReturnsOk() {
        Long leasingId = 1L;
        LeasingProductReviewsResponse expectedResponse =
                LeasingProductReviewsResponse.builder()
                        .averageRating(4.0)
                        .totalReviews(1)
                        .reviews(
                                List.of(
                                        LeasingReviewDto.builder()
                                                .reviewerName("Jane")
                                                .rating(4)
                                                .reviewDate(Instant.now())
                                                .comment("Très bien")
                                                .build()))
                        .build();

        when(leasingReviewService.getReviewsForProduct(leasingId)).thenReturn(expectedResponse);

        ResponseEntity<LeasingProductReviewsResponse> response =
                leasingPublicReviewController.getReviewsForProduct(leasingId);

        verify(leasingReviewService).getReviewsForProduct(leasingId);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(expectedResponse);
    }
}

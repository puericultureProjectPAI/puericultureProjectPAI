package com.puericulture.leasing.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.puericulture.leasing.dto.CreateLeasingReviewRequest;
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
class LeasingReviewControllerTest {

    @Mock private LeasingReviewService leasingReviewService;

    private LeasingReviewController leasingReviewController;

    @BeforeEach
    void setUp() {
        leasingReviewController = new LeasingReviewController(leasingReviewService);
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
                leasingReviewController.getReviewsForProduct(leasingId);

        verify(leasingReviewService).getReviewsForProduct(leasingId);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(expectedResponse);
    }

    @Test
    void createReview_delegatesToService() {
        String authenticatedPersonId = "user-uuid";
        Long leasingId = 1L;
        CreateLeasingReviewRequest request = new CreateLeasingReviewRequest();
        request.setLeasingOrderId(100L);
        request.setRating(5);
        request.setComment("Super service !");

        leasingReviewController.createReview(authenticatedPersonId, leasingId, request);

        verify(leasingReviewService).createReview(authenticatedPersonId, leasingId, request);
    }
}

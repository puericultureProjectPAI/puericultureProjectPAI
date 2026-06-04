package com.puericulture.leasing.controller;

import static org.mockito.Mockito.verify;

import com.puericulture.leasing.dto.CreateLeasingReviewRequest;
import com.puericulture.leasing.service.LeasingReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LeasingReviewControllerTest {

    @Mock private LeasingReviewService leasingReviewService;

    private LeasingReviewController leasingReviewController;

    @BeforeEach
    void setUp() {
        leasingReviewController = new LeasingReviewController(leasingReviewService);
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

package com.puericulture.troc;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.puericulture.troc.controller.ExchangeReportController;
import com.puericulture.troc.dto.CreateReportRequest;
import com.puericulture.troc.dto.ModerateReportRequest;
import com.puericulture.troc.dto.ReportResponse;
import com.puericulture.troc.entity.ReportStatus;
import com.puericulture.troc.entity.ReportType;
import com.puericulture.troc.service.ExchangeReportService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExchangeReportControllerTest {

    @Mock private ExchangeReportService reportService;

    private ExchangeReportController reportController;

    private static final UUID MOCK_USER_ID =
            UUID.fromString("10814ed3-a02b-4b69-9d64-aa96ed92bceb");

    @BeforeEach
    void setUp() {
        reportController = new ExchangeReportController(reportService);
    }

    @Test
    void shouldDelegateReportExchangeToService() {
        long exchangeId = 10L;
        CreateReportRequest request = new CreateReportRequest();
        request.setType(ReportType.ARTICLE_NON_CONFORME);
        request.setDescription("Article non conforme");
        ReportResponse expectedResponse = new ReportResponse();

        when(reportService.reportExchange(exchangeId, MOCK_USER_ID, request))
                .thenReturn(expectedResponse);

        ReportResponse result =
                reportController.reportExchange(MOCK_USER_ID.toString(), exchangeId, request);

        assertSame(expectedResponse, result);
        verify(reportService).reportExchange(exchangeId, MOCK_USER_ID, request);
    }

    @Test
    void shouldDelegateGetAllReportsToService() {
        List<ReportResponse> expectedList = List.of(new ReportResponse(), new ReportResponse());
        when(reportService.getAllReports()).thenReturn(expectedList);

        List<ReportResponse> result = reportController.getAllReports();

        assertEquals(expectedList, result);
        verify(reportService).getAllReports();
    }

    @Test
    void shouldDelegateGetReportByIdToService() {
        long reportId = 42L;
        ReportResponse expectedResponse = new ReportResponse();
        when(reportService.getReportById(reportId)).thenReturn(expectedResponse);

        ReportResponse result = reportController.getReport(reportId);

        assertSame(expectedResponse, result);
        verify(reportService).getReportById(reportId);
    }

    @Test
    void shouldDelegateModerateReportToService() {
        long reportId = 7L;
        ModerateReportRequest request = new ModerateReportRequest();
        request.setDecision(ReportStatus.RESOLVED);
        request.setComment("Signalement confirmé");
        ReportResponse expectedResponse = new ReportResponse();

        when(reportService.moderateReport(reportId, request)).thenReturn(expectedResponse);

        ReportResponse result = reportController.moderateReport(reportId, request);

        assertSame(expectedResponse, result);
        verify(reportService).moderateReport(reportId, request);
    }
}

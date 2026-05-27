package com.puericulture.troc.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.puericulture.common.entity.Person;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.common.service.NotificationService;
import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.ForbiddenException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.CreateReportRequest;
import com.puericulture.troc.dto.ModerateReportRequest;
import com.puericulture.troc.dto.ReportResponse;
import com.puericulture.troc.entity.Exchange;
import com.puericulture.troc.entity.ExchangeReport;
import com.puericulture.troc.entity.ExchangeStatus;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.entity.ReportStatus;
import com.puericulture.troc.entity.ReportType;
import com.puericulture.troc.mapper.ExchangeReportMapper;
import com.puericulture.troc.repository.ExchangeReportRepository;
import com.puericulture.troc.repository.ExchangeRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExchangeReportServiceTest {

    @Mock private ExchangeReportRepository reportRepository;
    @Mock private ExchangeRepository exchangeRepository;
    @Mock private PersonRepository personRepository;
    @Mock private ExchangeReportMapper reportMapper;
    @Mock private NotificationService notificationService;

    @InjectMocks private ExchangeReportService reportService;

    private static final UUID PROPOSER_ID = UUID.fromString("10814ed3-a02b-4b69-9d64-aa96ed92bceb");
    private static final UUID RECEIVER_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final UUID OUTSIDER_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");

    private Person proposer;
    private Person receiver;
    private ProductTroc proposerProduct;
    private ProductTroc receiverProduct;
    private Exchange pendingExchange;

    @BeforeEach
    void setup() {
        proposer = new Person();
        proposer.setId(PROPOSER_ID);

        receiver = new Person();
        receiver.setId(RECEIVER_ID);

        proposerProduct = new ProductTroc();
        proposerProduct.setId(1L);
        proposerProduct.setAuthor(proposer);

        receiverProduct = new ProductTroc();
        receiverProduct.setId(2L);
        receiverProduct.setAuthor(receiver);

        pendingExchange = new Exchange();
        pendingExchange.setId(10L);
        pendingExchange.setProposerProduct(proposerProduct);
        pendingExchange.setReceiverProduct(receiverProduct);
        pendingExchange.setStatus(ExchangeStatus.PENDING);
    }

    // ── reportExchange ────────────────────────────────────────────────────────

    @Test
    void reportExchange_proposerReports_exchangeBlockedAndReportSaved() {
        CreateReportRequest request = new CreateReportRequest();
        request.setType(ReportType.ARTICLE_NON_CONFORME);
        request.setDescription("Article non conforme");

        ExchangeReport savedReport = new ExchangeReport();
        savedReport.setExchange(pendingExchange);
        ReportResponse expectedResponse = new ReportResponse();

        when(exchangeRepository.findById(10L)).thenReturn(Optional.of(pendingExchange));
        when(personRepository.findById(PROPOSER_ID)).thenReturn(Optional.of(proposer));
        when(reportRepository.save(any(ExchangeReport.class))).thenReturn(savedReport);
        when(reportMapper.toResponse(savedReport)).thenReturn(expectedResponse);

        ReportResponse result = reportService.reportExchange(10L, PROPOSER_ID, request);

        assertSame(expectedResponse, result);
        assertEquals(ExchangeStatus.BLOCKED, pendingExchange.getStatus());
        assertEquals(ExchangeStatus.PENDING, pendingExchange.getStatusBeforeBlock());
        verify(exchangeRepository).save(pendingExchange);
        verify(notificationService).notifyAdminNewReport(savedReport);
    }

    @Test
    void reportExchange_receiverReports_exchangeBlocked() {
        CreateReportRequest request = new CreateReportRequest();
        request.setType(ReportType.COMPORTEMENT_INAPPROPRIE);
        request.setDescription("Comportement inapproprié");

        ExchangeReport savedReport = new ExchangeReport();
        savedReport.setExchange(pendingExchange);
        ReportResponse expectedResponse = new ReportResponse();

        when(exchangeRepository.findById(10L)).thenReturn(Optional.of(pendingExchange));
        when(personRepository.findById(RECEIVER_ID)).thenReturn(Optional.of(receiver));
        when(reportRepository.save(any(ExchangeReport.class))).thenReturn(savedReport);
        when(reportMapper.toResponse(savedReport)).thenReturn(expectedResponse);

        reportService.reportExchange(10L, RECEIVER_ID, request);

        assertEquals(ExchangeStatus.BLOCKED, pendingExchange.getStatus());
    }

    @Test
    void reportExchange_nonParticipant_throwsForbidden() {
        when(exchangeRepository.findById(10L)).thenReturn(Optional.of(pendingExchange));

        CreateReportRequest request = new CreateReportRequest();
        request.setType(ReportType.AUTRE);
        request.setDescription("Problème");

        assertThrows(
                ForbiddenException.class,
                () -> reportService.reportExchange(10L, OUTSIDER_ID, request));
    }

    @Test
    void reportExchange_confirmedExchange_throwsBadRequest() {
        pendingExchange.setStatus(ExchangeStatus.CONFIRMED);
        when(exchangeRepository.findById(10L)).thenReturn(Optional.of(pendingExchange));

        CreateReportRequest request = new CreateReportRequest();
        request.setType(ReportType.ARTICLE_NON_RECU);
        request.setDescription("Article non reçu");

        assertThrows(
                BadRequestException.class,
                () -> reportService.reportExchange(10L, PROPOSER_ID, request));
    }

    @Test
    void reportExchange_refusedExchange_throwsBadRequest() {
        pendingExchange.setStatus(ExchangeStatus.REFUSED);
        when(exchangeRepository.findById(10L)).thenReturn(Optional.of(pendingExchange));

        CreateReportRequest request = new CreateReportRequest();
        request.setType(ReportType.ANNULATION_ABUSIVE);
        request.setDescription("Annulation abusive");

        assertThrows(
                BadRequestException.class,
                () -> reportService.reportExchange(10L, PROPOSER_ID, request));
    }

    @Test
    void reportExchange_exchangeNotFound_throwsNotFound() {
        when(exchangeRepository.findById(99L)).thenReturn(Optional.empty());

        CreateReportRequest request = new CreateReportRequest();
        request.setType(ReportType.FRAUDE_SUSPECTEE);
        request.setDescription("Fraude");

        assertThrows(
                NotFoundException.class,
                () -> reportService.reportExchange(99L, PROPOSER_ID, request));
    }

    // ── moderateReport ────────────────────────────────────────────────────────

    @Test
    void moderateReport_resolved_exchangeRefused() {
        ExchangeReport report = new ExchangeReport();
        report.setId(1L);
        report.setExchange(pendingExchange);
        pendingExchange.setStatusBeforeBlock(ExchangeStatus.PENDING);

        ModerateReportRequest request = new ModerateReportRequest();
        request.setDecision(ReportStatus.RESOLVED);
        request.setComment("Signalement confirmé");

        ReportResponse expectedResponse = new ReportResponse();
        when(reportRepository.findById(1L)).thenReturn(Optional.of(report));
        when(reportRepository.save(report)).thenReturn(report);
        when(reportMapper.toResponse(report)).thenReturn(expectedResponse);

        ReportResponse result = reportService.moderateReport(1L, request);

        assertSame(expectedResponse, result);
        assertEquals(ReportStatus.RESOLVED, report.getStatus());
        assertEquals(ExchangeStatus.REFUSED, pendingExchange.getStatus());
        assertNull(pendingExchange.getStatusBeforeBlock());
        verify(exchangeRepository).save(pendingExchange);
        verify(notificationService).notifyParticipantsReportResolved(report);
    }

    @Test
    void moderateReport_rejected_exchangeRestoredToPreviousStatus() {
        pendingExchange.setStatus(ExchangeStatus.BLOCKED);
        pendingExchange.setStatusBeforeBlock(ExchangeStatus.ACCEPTED);

        ExchangeReport report = new ExchangeReport();
        report.setId(2L);
        report.setExchange(pendingExchange);

        ModerateReportRequest request = new ModerateReportRequest();
        request.setDecision(ReportStatus.REJECTED);
        request.setComment("Signalement infondé");

        when(reportRepository.findById(2L)).thenReturn(Optional.of(report));
        when(reportRepository.save(report)).thenReturn(report);
        when(reportMapper.toResponse(report)).thenReturn(new ReportResponse());

        reportService.moderateReport(2L, request);

        assertEquals(ReportStatus.REJECTED, report.getStatus());
        assertEquals(ExchangeStatus.ACCEPTED, pendingExchange.getStatus());
        assertNull(pendingExchange.getStatusBeforeBlock());
    }

    @Test
    void moderateReport_rejectedWithNullStatusBeforeBlock_fallbackToPending() {
        pendingExchange.setStatus(ExchangeStatus.BLOCKED);
        pendingExchange.setStatusBeforeBlock(null);

        ExchangeReport report = new ExchangeReport();
        report.setId(3L);
        report.setExchange(pendingExchange);

        ModerateReportRequest request = new ModerateReportRequest();
        request.setDecision(ReportStatus.REJECTED);

        when(reportRepository.findById(3L)).thenReturn(Optional.of(report));
        when(reportRepository.save(report)).thenReturn(report);
        when(reportMapper.toResponse(report)).thenReturn(new ReportResponse());

        reportService.moderateReport(3L, request);

        assertEquals(ExchangeStatus.PENDING, pendingExchange.getStatus());
    }

    @Test
    void moderateReport_reportNotFound_throwsNotFound() {
        when(reportRepository.findById(99L)).thenReturn(Optional.empty());

        ModerateReportRequest request = new ModerateReportRequest();
        request.setDecision(ReportStatus.RESOLVED);

        assertThrows(NotFoundException.class, () -> reportService.moderateReport(99L, request));
    }

    // ── getAllReports / getReportById ─────────────────────────────────────────

    @Test
    void getAllReports_returnsAllMappedReports() {
        ExchangeReport report1 = new ExchangeReport();
        ExchangeReport report2 = new ExchangeReport();
        ReportResponse resp1 = new ReportResponse();
        ReportResponse resp2 = new ReportResponse();

        when(reportRepository.findAllByOrderByCreatedAtDesc())
                .thenReturn(List.of(report1, report2));
        when(reportMapper.toResponse(report1)).thenReturn(resp1);
        when(reportMapper.toResponse(report2)).thenReturn(resp2);

        List<ReportResponse> result = reportService.getAllReports();

        assertEquals(2, result.size());
        assertSame(resp1, result.get(0));
        assertSame(resp2, result.get(1));
    }

    @Test
    void getReportById_found_returnsMappedResponse() {
        ExchangeReport report = new ExchangeReport();
        ReportResponse expectedResponse = new ReportResponse();

        when(reportRepository.findById(5L)).thenReturn(Optional.of(report));
        when(reportMapper.toResponse(report)).thenReturn(expectedResponse);

        ReportResponse result = reportService.getReportById(5L);

        assertSame(expectedResponse, result);
    }

    @Test
    void getReportById_notFound_throwsNotFound() {
        when(reportRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> reportService.getReportById(99L));
    }
}

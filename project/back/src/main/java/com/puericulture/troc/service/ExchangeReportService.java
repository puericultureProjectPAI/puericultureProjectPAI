package com.puericulture.troc.service;

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
import com.puericulture.troc.entity.ReportStatus;
import com.puericulture.troc.mapper.ExchangeReportMapper;
import com.puericulture.troc.repository.ExchangeReportRepository;
import com.puericulture.troc.repository.ExchangeRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ExchangeReportService {

    private final ExchangeReportRepository reportRepository;
    private final ExchangeRepository exchangeRepository;
    private final PersonRepository personRepository;
    private final ExchangeReportMapper reportMapper;
    private final NotificationService notificationService;

    public ExchangeReportService(
            ExchangeReportRepository reportRepository,
            ExchangeRepository exchangeRepository,
            PersonRepository personRepository,
            ExchangeReportMapper reportMapper,
            NotificationService notificationService) {
        this.reportRepository = reportRepository;
        this.exchangeRepository = exchangeRepository;
        this.personRepository = personRepository;
        this.reportMapper = reportMapper;
        this.notificationService = notificationService;
    }

    @Transactional
    public ReportResponse reportExchange(
            Long exchangeId, UUID connectedUserId, CreateReportRequest request) {

        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Exchange not found"));

        boolean isParticipant =
                exchange.getProposerProduct().getAuthor().getId().equals(connectedUserId)
                        || exchange.getReceiverProduct()
                                .getAuthor()
                                .getId()
                                .equals(connectedUserId);

        if (!isParticipant) {
            throw new ForbiddenException("Only exchange participants can file a report");
        }

        if (exchange.getStatus() == ExchangeStatus.BLOCKED) {
            throw new BadRequestException("Exchange is already frozen due to an active report");
        }

        if (exchange.getStatus() == ExchangeStatus.CONFIRMED
                || exchange.getStatus() == ExchangeStatus.REFUSED) {
            throw new BadRequestException("Cannot report a closed exchange");
        }

        Person reporter =
                personRepository
                        .findById(connectedUserId)
                        .orElseThrow(() -> new NotFoundException("Person not found"));

        ExchangeReport report = new ExchangeReport();
        report.setExchange(exchange);
        report.setReportedBy(reporter);
        report.setType(request.getType());
        report.setDescription(request.getDescription());
        report.setStatus(ReportStatus.OPEN);
        if (request.getAttachmentUrls() != null) {
            report.setAttachmentUrls(request.getAttachmentUrls());
        }

        exchange.setStatusBeforeBlock(exchange.getStatus());
        exchange.setStatus(ExchangeStatus.BLOCKED);

        exchangeRepository.save(exchange);
        ExchangeReport saved = reportRepository.save(report);

        notificationService.notifyAdminNewReport(saved);

        return reportMapper.toResponse(saved);
    }

    @Transactional
    public ReportResponse moderateReport(Long reportId, ModerateReportRequest request) {

        ExchangeReport report =
                reportRepository
                        .findById(reportId)
                        .orElseThrow(() -> new NotFoundException("Report not found"));

        Exchange exchange = report.getExchange();

        report.setModerationComment(request.getComment());

        if (request.getDecision() == ReportStatus.RESOLVED) {
            report.setStatus(ReportStatus.RESOLVED);
            exchange.setStatus(ExchangeStatus.REFUSED);
        } else if (request.getDecision() == ReportStatus.REJECTED) {
            report.setStatus(ReportStatus.REJECTED);
            exchange.setStatus(
                    exchange.getStatusBeforeBlock() != null
                            ? exchange.getStatusBeforeBlock()
                            : ExchangeStatus.PENDING);
        } else {
            throw new BadRequestException("Decision must be RESOLVED or REJECTED");
        }

        exchange.setStatusBeforeBlock(null);
        exchangeRepository.save(exchange);
        ExchangeReport saved = reportRepository.save(report);

        notificationService.notifyParticipantsReportResolved(saved);

        return reportMapper.toResponse(saved);
    }

    public List<ReportResponse> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(reportMapper::toResponse)
                .toList();
    }

    public ReportResponse getReportById(Long reportId) {
        return reportRepository
                .findById(reportId)
                .map(reportMapper::toResponse)
                .orElseThrow(() -> new NotFoundException("Report not found"));
    }
}

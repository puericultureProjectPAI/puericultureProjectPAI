package com.puericulture.troc.controller;

import com.puericulture.troc.dto.CreateReportRequest;
import com.puericulture.troc.dto.ModerateReportRequest;
import com.puericulture.troc.dto.ReportResponse;
import com.puericulture.troc.service.ExchangeReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(
        name = "Exchange Reports",
        description = "Endpoints for reporting and moderating exchange issues.")
public class ExchangeReportController {

    private final ExchangeReportService reportService;

    @Operation(
            summary = "File a report on an exchange",
            description =
                    "Allows an exchange participant to report a problem. The exchange is immediately blocked until moderation.")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "201",
                        description = "Report created, exchange blocked."),
                @ApiResponse(responseCode = "400", description = "Exchange is already closed."),
                @ApiResponse(responseCode = "403", description = "User is not a participant."),
                @ApiResponse(responseCode = "404", description = "Exchange not found.")
            })
    @PostMapping("/troc/exchanges/{exchangeId}/reports")
    @ResponseStatus(HttpStatus.CREATED)
    public ReportResponse reportExchange(
            @AuthenticationPrincipal String authenticatedPersonId,
            @PathVariable Long exchangeId,
            @RequestBody @Valid CreateReportRequest request) {

        return reportService.reportExchange(
                exchangeId, UUID.fromString(authenticatedPersonId), request);
    }

    @Operation(
            summary = "List all reports",
            description = "Admin only. Returns all reports ordered by creation date.")
    @ApiResponse(responseCode = "200", description = "Reports retrieved.")
    @GetMapping("/admin/reports")
    public List<ReportResponse> getAllReports() {
        return reportService.getAllReports();
    }

    @Operation(
            summary = "Get report details",
            description = "Admin only. Returns details of a single report.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Report retrieved."),
                @ApiResponse(responseCode = "404", description = "Report not found.")
            })
    @GetMapping("/admin/reports/{reportId}")
    public ReportResponse getReport(@PathVariable Long reportId) {
        return reportService.getReportById(reportId);
    }

    @Operation(
            summary = "Moderate a report",
            description =
                    "Admin only. RESOLVED cancels the exchange; REJECTED restores the exchange to its previous status.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Report moderated."),
                @ApiResponse(responseCode = "400", description = "Invalid decision value."),
                @ApiResponse(responseCode = "404", description = "Report not found.")
            })
    @PostMapping("/admin/reports/{reportId}/moderate")
    public ReportResponse moderateReport(
            @PathVariable Long reportId, @RequestBody @Valid ModerateReportRequest request) {

        return reportService.moderateReport(reportId, request);
    }
}

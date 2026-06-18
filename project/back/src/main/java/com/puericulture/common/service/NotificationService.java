package com.puericulture.common.service;

import com.puericulture.troc.entity.ExchangeReport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    public void notifyAdminNewReport(ExchangeReport report) {
        log.info(
                "New report #{} filed on exchange #{}",
                report.getId(),
                report.getExchange().getId());
    }

    public void notifyParticipantsReportResolved(ExchangeReport report) {
        log.info("Report #{} resolved with status {}", report.getId(), report.getStatus());
    }
}

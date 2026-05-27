package com.puericulture.troc.repository;

import com.puericulture.troc.entity.ExchangeReport;
import com.puericulture.troc.entity.ReportStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExchangeReportRepository extends JpaRepository<ExchangeReport, Long> {

    List<ExchangeReport> findByExchange_Id(Long exchangeId);

    List<ExchangeReport> findAllByOrderByCreatedAtDesc();

    List<ExchangeReport> findByStatusOrderByCreatedAtDesc(ReportStatus status);
}

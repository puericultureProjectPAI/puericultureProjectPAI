package com.puericulture.troc.entity;

import com.puericulture.common.entity.Person;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "exchange_reports", schema = "public")
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "exchange_id", nullable = false)
    private Exchange exchange;

    @ManyToOne
    @JoinColumn(name = "reported_by_id", nullable = false)
    private Person reportedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status = ReportStatus.OPEN;

    @ElementCollection
    @CollectionTable(
            name = "exchange_report_attachment_urls",
            schema = "public",
            joinColumns = @JoinColumn(name = "exchange_report_id"))
    @Column(name = "attachment_url", columnDefinition = "TEXT")
    private List<String> attachmentUrls = new ArrayList<>();

    @Column(name = "moderation_comment", columnDefinition = "TEXT")
    private String moderationComment;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @PreUpdate
    void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}

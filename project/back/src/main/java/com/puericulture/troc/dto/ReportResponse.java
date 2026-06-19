package com.puericulture.troc.dto;

import com.puericulture.common.dto.PersonDto;
import com.puericulture.troc.entity.ReportStatus;
import com.puericulture.troc.entity.ReportType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Represents a report filed on an exchange.")
public class ReportResponse {

    @Schema(description = "Unique identifier of the report.", example = "1")
    private Long id;

    @Schema(description = "ID of the reported exchange.", example = "15")
    private Long exchangeId;

    @Schema(description = "User who filed the report.")
    private PersonDto reportedBy;

    @Schema(description = "Category of the problem.", example = "ARTICLE_NON_CONFORME")
    private ReportType type;

    @Schema(description = "Detailed description of the problem.")
    private String description;

    @Schema(description = "Current moderation status.", example = "OPEN")
    private ReportStatus status;

    @Schema(description = "URLs of attached proof files.")
    private List<String> attachmentUrls;

    @Schema(description = "Comment left by the moderator after review.")
    private String moderationComment;

    @Schema(description = "Date the report was created.")
    private OffsetDateTime createdAt;

    @Schema(description = "Date the report was last updated.")
    private OffsetDateTime updatedAt;
}

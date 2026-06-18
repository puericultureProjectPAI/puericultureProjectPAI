package com.puericulture.troc.dto;

import com.puericulture.troc.entity.ReportStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModerateReportRequest {

    @NotNull private ReportStatus decision;

    private String comment;
}

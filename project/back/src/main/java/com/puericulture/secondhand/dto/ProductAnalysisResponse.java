package com.puericulture.secondhand.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductAnalysisResponse {
    private String title;
    private String description;
    private String category;
    private Double confidenceScore;
}

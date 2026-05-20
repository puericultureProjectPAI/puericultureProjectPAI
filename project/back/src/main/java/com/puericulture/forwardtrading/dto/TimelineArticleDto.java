package com.puericulture.forwardtrading.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimelineArticleDto {
    private String name;
    private String price;
    private String tag;
}

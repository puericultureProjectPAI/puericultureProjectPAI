package com.puericulture.forwardtrading.utils.timeline.generator;

import com.puericulture.forwardtrading.dto.TimeLineGeneratorCreateDto;
import com.puericulture.forwardtrading.entity.Timelines;

public interface TimelineGenerator {
    public Timelines generateTimeline(TimeLineGeneratorCreateDto timeLineGeneratorCreateDto);
}

package com.puericulture.forwardtrading.controller;

import com.puericulture.forwardtrading.dto.TimelinePeriodDto;
import com.puericulture.forwardtrading.service.TimelineService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TimelineController extends ForwardTradingController {

    private final TimelineService timelineService;

    @GetMapping("/timelines/{timelineId}")
    public ResponseEntity<List<TimelinePeriodDto>> getTimeline(@PathVariable Long timelineId) {
        return ResponseEntity.ok(timelineService.getTimeline(timelineId));
    }
}

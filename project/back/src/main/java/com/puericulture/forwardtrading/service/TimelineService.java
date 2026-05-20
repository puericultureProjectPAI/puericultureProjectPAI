package com.puericulture.forwardtrading.service;

import com.puericulture.forwardtrading.dto.TimelinePeriodDto;
import com.puericulture.forwardtrading.entity.TimelineEvents;
import com.puericulture.forwardtrading.entity.TimelinePeriods;
import com.puericulture.forwardtrading.mapper.TimelineMapper;
import com.puericulture.forwardtrading.repository.TimelineEventRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TimelineService {

    private final TimelineEventRepository timelineEventRepository;
    private final TimelineMapper timelineMapper;

    /**
     * @param timelineId The target timeline ID
     * @return The structured list of periods containing their products
     */
    public List<TimelinePeriodDto> getTimeline(Long timelineId) {
        List<TimelineEvents> events = timelineEventRepository.findByTimelineId(timelineId);

        // Grouping events by their associated period
        Map<TimelinePeriods, List<TimelineEvents>> eventsByPeriod =
                events.stream().collect(Collectors.groupingBy(TimelineEvents::getPeriod));

        // Sorting by the period's orderIndex, then mapping to DTO
        return eventsByPeriod.entrySet().stream()
                .sorted(
                        Map.Entry.comparingByKey(
                                Comparator.comparing(TimelinePeriods::getOrderIndex)))
                .map(entry -> timelineMapper.toTimelinePeriodDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }
}

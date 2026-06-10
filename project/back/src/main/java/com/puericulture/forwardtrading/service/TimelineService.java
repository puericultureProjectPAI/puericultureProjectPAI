package com.puericulture.forwardtrading.service;

import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.forwardtrading.dto.TimelinePeriodDto;
import com.puericulture.forwardtrading.entity.TimelineEvents;
import com.puericulture.forwardtrading.entity.TimelinePeriods;
import com.puericulture.forwardtrading.entity.Timelines;
import com.puericulture.forwardtrading.mapper.TimelineMapper;
import com.puericulture.forwardtrading.repository.TimelineEventRepository;
import com.puericulture.forwardtrading.repository.TimelineRepository;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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
    private final TimelineRepository timelineRepository;
    private final TimelineMapper timelineMapper;

    /**
     * @param timelineId The target timeline ID
     * @return The structured list of periods containing their products
     */
    public List<TimelinePeriodDto> getTimeline(Long timelineId) {
        List<TimelineEvents> events = timelineEventRepository.findByTimelineId(timelineId);

        if (events.isEmpty()) {
            throw new NotFoundException("Timeline not found for ID : " + timelineId);
        }

        Timelines timeline =
                timelineRepository
                        .findById(timelineId)
                        .orElseThrow(
                                () ->
                                        new NotFoundException(
                                                "Timeline not found for ID : " + timelineId));

        LocalDate birthDate = timeline.getChildren().getBirthDate().toLocalDate();
        long ageInMonths = ChronoUnit.MONTHS.between(birthDate, LocalDate.now());

        // Grouping events by their associated period
        Map<TimelinePeriods, List<TimelineEvents>> eventsByPeriod =
                events.stream().collect(Collectors.groupingBy(TimelineEvents::getPeriod));

        // Sorting by the period's orderIndex, then mapping to DTO
        return eventsByPeriod.entrySet().stream()
                .sorted(
                        Map.Entry.comparingByKey(
                                Comparator.comparing(TimelinePeriods::getOrderIndex)))
                .map(
                        entry -> {
                            TimelinePeriodDto dto =
                                    timelineMapper.toTimelinePeriodDto(
                                            entry.getKey(), entry.getValue());
                            dto.setStatus(computeStatus(entry.getKey().getLabel(), ageInMonths));
                            return dto;
                        })
                .collect(Collectors.toList());
    }

    private String computeStatus(String label, long ageInMonths) {
        try {
            String[] parts = label.split("-");
            int start = Integer.parseInt(parts[0].trim());
            int end = Integer.parseInt(parts[1].trim().split(" ")[0]);
            if (ageInMonths < start) return "future";
            if (ageInMonths <= end) return "current";
            return "past";
        } catch (Exception e) {
            return "future";
        }
    }
}

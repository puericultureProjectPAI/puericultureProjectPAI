package com.puericulture.forwardtrading.utils.timeline.generator;

import com.puericulture.forwardtrading.dto.TimeLineGeneratorCreateDto;
import com.puericulture.forwardtrading.entity.TimelineEvents;
import com.puericulture.forwardtrading.entity.TimelinePeriods;
import com.puericulture.forwardtrading.entity.Timelines;
import com.puericulture.forwardtrading.repository.TimelinePeriodRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class MockTimeLineGenerator implements TimelineGenerator {
    private final TimelinePeriodRepository timelinePeriodRepository;

    List<String> mockedArticles =
            List.of(
                    "Poussette",
                    "T-Shirt",
                    "Couche",
                    "Trottinette",
                    "PC Gamer",
                    "Chaise pour bébé",
                    "Biberon");
    List<String> mockedTags = List.of("Jeux", "Vêtements", "Hygiene", "Mobilier", "Nourriture");

    Random random = new Random();

    private Long timelineEventIdIncrementer = 0l;
    private Long timelineIdIncrementer = 0l;

    @Override
    public Timelines generateTimeline(TimeLineGeneratorCreateDto timeLineGeneratorCreateDto) {
        timelineIdIncrementer++;
        Timelines timelines =
                Timelines.builder()
                        // .id(timelineIdIncrementer)
                        .name("Timeline - %s".formatted(timelineIdIncrementer))
                        .events(new ArrayList<>())
                        .build();
        List<TimelinePeriods> availablePeriods =
                getAvailableTimelinePeriods(
                        getNumberOfWeeksSinceDate(
                                toLocalDate(timeLineGeneratorCreateDto.getBirthDate())));
        for (TimelinePeriods period : availablePeriods) {
            int nbArticleEvent = random.nextInt(6) + 1;
            for (int i = 0; i < nbArticleEvent; i++) {
                timelines.getEvents().add(getTimelineEvent(timelines, period));
            }
        }
        return timelines;
    }

    private LocalDate toLocalDate(Date date) {
        if (date == null) {
            return null;
        }
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    private int getNumberOfWeeksSinceDate(LocalDate date) {
        if (date == null) {
            return 0;
        }
        long weeks = ChronoUnit.WEEKS.between(date, LocalDate.now());
        return Math.max(0, (int) weeks);
    }

    private TimelineEvents getTimelineEvent(Timelines timelines, TimelinePeriods period) {
        timelineIdIncrementer++;
        return TimelineEvents.builder()
                // .id(timelineEventIdIncrementer)
                .timeline(timelines)
                .type("ACHAT")
                .articlePrice(BigDecimal.valueOf(random.nextDouble(5, 2500)))
                .articleName(mockedArticles.get(random.nextInt(mockedArticles.size())))
                .articleTag(mockedTags.get(random.nextInt(mockedTags.size())))
                .period(period)
                .build();
    }

    private List<TimelinePeriods> getAvailableTimelinePeriods(int weeksSinceBirth) {
        List<TimelinePeriods> allPeriods = timelinePeriodRepository.findAllByOrderByOrderIndexAsc();
        List<TimelinePeriods> availablePeriods = new ArrayList<>();
        int cumulativeWeeks = 0;
        for (TimelinePeriods period : allPeriods) {
            cumulativeWeeks += period.getWeekDuration();
            if (cumulativeWeeks > weeksSinceBirth) {
                availablePeriods.add(period);
            }
        }
        return availablePeriods;
    }
}

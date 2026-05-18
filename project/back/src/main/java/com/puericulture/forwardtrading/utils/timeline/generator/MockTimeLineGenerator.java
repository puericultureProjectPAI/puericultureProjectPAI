package com.puericulture.forwardtrading.utils.timeline.generator;

import com.puericulture.forwardtrading.entity.TimelineEvents;
import com.puericulture.forwardtrading.entity.TimelinePeriods;
import com.puericulture.forwardtrading.entity.Timelines;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class MockTimeLineGenerator implements TimelineGenerator {
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
    List<TimelinePeriods> timelinePeriods =
            List.of(
                    TimelinePeriods.builder()
                            .id(1l)
                            .label("0-3 mois")
                            .type("T1")
                            .weekDuration(12)
                            .orderIndex(1)
                            .build(),
                    TimelinePeriods.builder()
                            .id(2l)
                            .label("3-6 mois")
                            .type("T2")
                            .weekDuration(12)
                            .orderIndex(2)
                            .build(),
                    TimelinePeriods.builder()
                            .id(3l)
                            .label("6-9 mois")
                            .type("T3")
                            .weekDuration(12)
                            .orderIndex(3)
                            .build(),
                    TimelinePeriods.builder()
                            .id(4l)
                            .label("9-12 mois")
                            .type("T4")
                            .weekDuration(12)
                            .orderIndex(4)
                            .build());

    Random random = new Random();

    private Long timelineEventIdIncrementer = 0l;
    private Long timelineIdIncrementer = 0l;

    @Override
    public Timelines generateTimeline(Object object) {
        timelineIdIncrementer++;
        Timelines timelines =
                Timelines.builder()
                        .id(timelineIdIncrementer)
                        .name("Timeline - %s".formatted(timelineIdIncrementer))
                        .events(new ArrayList<>())
                        .build();
        int nbArticleEvent = random.nextInt(14);
        for (int i = 0; i < nbArticleEvent; i++) {
            timelines.getEvents().add(getTimelineEvent(timelines));
        }
        return timelines;
    }

    private TimelineEvents getTimelineEvent(Timelines timelines) {
        timelineIdIncrementer++;
        return TimelineEvents.builder()
                .id(timelineEventIdIncrementer)
                .timeline(timelines)
                .articleName(mockedArticles.get(random.nextInt(mockedArticles.size())))
                .articleTag(mockedTags.get(random.nextInt(mockedTags.size())))
                .period(getTimelinePeriods())
                .build();
    }

    private TimelinePeriods getTimelinePeriods() {
        return timelinePeriods.get(random.nextInt(timelinePeriods.size()));
    }
}

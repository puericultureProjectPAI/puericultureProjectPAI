package com.puericulture.forwardtrading.repository;

import com.puericulture.forwardtrading.entity.TimelineEvents;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimelineEventRepository extends CrudRepository<TimelineEvents, Long> {
    List<TimelineEvents> findByTimelineId(Long timelineId);
}

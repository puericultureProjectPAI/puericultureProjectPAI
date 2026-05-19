package com.puericulture.forwardtrading.repository;

import com.puericulture.forwardtrading.entity.TimelineEvents;
import org.springframework.data.repository.CrudRepository;

public interface TimelineEventRepository extends CrudRepository<TimelineEvents, Long> {}

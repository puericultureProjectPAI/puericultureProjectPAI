package com.puericulture.forwardtrading.repository;

import com.puericulture.forwardtrading.entity.TimelinePeriods;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface TimelinePeriodRepository extends CrudRepository<TimelinePeriods, Long> {
    List<TimelinePeriods> findAllByOrderByOrderIndexAsc();
}

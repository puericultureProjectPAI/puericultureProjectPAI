package com.puericulture.forwardtrading.repository;

import com.puericulture.forwardtrading.entity.ChildrenEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;

public interface ChildrenRepository extends CrudRepository<ChildrenEntity, Integer> {
    List<ChildrenEntity> findAllByPersonIdAndNameNull(UUID personId);

    List<ChildrenEntity> findByPersonId(UUID personId);
}

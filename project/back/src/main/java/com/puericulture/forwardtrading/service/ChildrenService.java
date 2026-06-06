package com.puericulture.forwardtrading.service;

import com.puericulture.common.repository.PersonRepository;
import com.puericulture.forwardtrading.dto.children.CreateChildren;
import com.puericulture.forwardtrading.entity.ChildrenEntity;
import com.puericulture.forwardtrading.entity.Timelines;
import com.puericulture.forwardtrading.mapper.ChildrenMapper;
import com.puericulture.forwardtrading.mapper.TimeLineGeneratorMapper;
import com.puericulture.forwardtrading.repository.ChildrenRepository;
import com.puericulture.forwardtrading.repository.TimelineEventRepository;
import com.puericulture.forwardtrading.repository.TimelineRepository;
import com.puericulture.forwardtrading.utils.timeline.generator.TimelineGenerator;
import jakarta.transaction.Transactional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChildrenService {
    private final ChildrenRepository childrenRepository;
    private final ChildrenMapper childrenMapper;
    private final PersonRepository personRepository;
    private final TimelineGenerator timelineGenerator;
    private final TimeLineGeneratorMapper timeLineGeneratorMapper;
    private final TimelineRepository timelineRepository;
    private final TimelineEventRepository timelineEventRepository;

    @Transactional
    public void createChildren(CreateChildren children, String userId) {
        ChildrenEntity childrenEntity = childrenMapper.toChildrenEntity(children);
        childrenEntity.setPerson(personRepository.getReferenceById(UUID.fromString(userId)));
        childrenRepository.save(childrenEntity);
        Timelines timeline =
                timelineGenerator.generateTimeline(
                        timeLineGeneratorMapper.toTimeLineGeneratorCreateDto(children));
        timeline.setChildren(childrenEntity);
        Timelines savedTimeline = timelineRepository.save(timeline);
    }
}

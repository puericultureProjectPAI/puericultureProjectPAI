package com.puericulture.forwardtrading.service;

import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.PersonPreferences;
import com.puericulture.common.mapper.PersonPreferencesMapper;
import com.puericulture.common.repository.PersonPreferencesRepository;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.config.errormanager.exception.ForbiddenException;
import com.puericulture.forwardtrading.dto.OnBoardingDto;
import com.puericulture.forwardtrading.dto.OnBoardingDto.ChildDto;
import com.puericulture.forwardtrading.entity.ChildrenEntity;
import com.puericulture.forwardtrading.entity.Timelines;
import com.puericulture.forwardtrading.mapper.ChildrenMapper;
import com.puericulture.forwardtrading.mapper.TimeLineGeneratorMapper;
import com.puericulture.forwardtrading.repository.ChildrenRepository;
import com.puericulture.forwardtrading.repository.TimelineEventRepository;
import com.puericulture.forwardtrading.repository.TimelineRepository;
import com.puericulture.forwardtrading.utils.timeline.generator.TimelineGenerator;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OnBoardingService {

    private final PersonRepository personRepository;
    private final TimelineGenerator timelineGenerator;
    private final TimeLineGeneratorMapper timeLineGeneratorMapper;
    private final ChildrenMapper childrenMapper;
    private final PersonPreferencesMapper personPreferencesMapper;
    private final PersonPreferencesRepository personPreferencesRepository;
    private final ChildrenRepository childrenRepository;
    private final TimelineEventRepository timelineEventRepository;
    private final TimelineRepository timelineRepository;

    @Transactional
    public OnBoardingDto createOnBoarding(@Valid OnBoardingDto onBoardingDto, String userId) {
        Person person =
                personRepository
                        .findById(UUID.fromString(userId))
                        .orElseThrow(ForbiddenException::new);

        PersonPreferences personPreferences =
                personPreferencesMapper.toPersonPreferences(onBoardingDto);
        personPreferences.setPerson(person);
        personPreferencesRepository.save(personPreferences);
        if (onBoardingDto.getDueDate() != null) {
            ChildDto childDto = new ChildDto();
            childDto.setBirthDate(onBoardingDto.getDueDate());
            childDto.setName(
                    "Enfant sans nom %d"
                            .formatted(
                                    childrenRepository
                                                    .findAllByPersonIdAndNameNull(person.getId())
                                                    .size()
                                            + 1));
            onBoardingDto.getChildren().add(childDto);
        }
        List<ChildrenEntity> children =
                Optional.ofNullable(onBoardingDto.getChildren()).orElse(new ArrayList<>()).stream()
                        .map(
                                child -> {
                                    ChildrenEntity childrenEntity =
                                            childrenMapper.toChildrenEntity(child);
                                    childrenEntity.setPerson(person);

                                    // 1. sauver le child d'abord pour avoir son id
                                    ChildrenEntity savedChild =
                                            childrenRepository.save(childrenEntity);

                                    // 2. générer + rattacher la timeline au child sauvé
                                    Timelines timeline =
                                            timelineGenerator.generateTimeline(
                                                    timeLineGeneratorMapper
                                                            .toTimeLineGeneratorCreateDto(child));
                                    timeline.setChildren(savedChild);

                                    // 3. sauver la timeline -> cascade vers les events
                                    Timelines savedTimeline = timelineRepository.save(timeline);

                                    savedChild.setTimelines(List.of(savedTimeline));
                                    return savedChild;
                                })
                        .toList();

        return null;
    }
}

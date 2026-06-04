package com.puericulture.forwardtrading.service;

import com.puericulture.common.entity.Person;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.forwardtrading.dto.children.CreateChildren;
import com.puericulture.forwardtrading.dto.family.FamilyFormDto;
import com.puericulture.forwardtrading.entity.ChildrenEntity;
import com.puericulture.forwardtrading.entity.PersonPreferencesEntity;
import com.puericulture.forwardtrading.entity.Timelines;
import com.puericulture.forwardtrading.mapper.ChildrenMapper;
import com.puericulture.forwardtrading.repository.ChildrenRepository;
import com.puericulture.forwardtrading.repository.PersonPreferencesRepository;
import com.puericulture.forwardtrading.utils.timeline.generator.TimelineGenerator;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FamilyRegistrationService {

    private final ChildrenMapper childrenMapper;
    private final ChildrenRepository childrenRepository;
    private final PersonRepository personRepository;
    private final TimelineGenerator timelineGenerator;
    // On injecte le nouveau repository
    private final PersonPreferencesRepository personPreferencesRepository;

    @Transactional
    public void processFamilyForm(FamilyFormDto form, String userId) {
        Person person = personRepository.getReferenceById(UUID.fromString(userId));

        // 1. Règles métiers globales pour la date
        if ("parent".equals(form.getFamilyStatus())) {
            form.setDueDate(null);
        }
        if ("expecting".equals(form.getFamilyStatus()) && form.getChildren() != null) {
            form.getChildren().clear();
        }

        // 2. Sauvegarde des préférences du parent (La nouveauté est ici)
        PersonPreferencesEntity preferences = new PersonPreferencesEntity();
        preferences.setPerson(person);
        preferences.setFamilyStatus(form.getFamilyStatus());
        preferences.setDueDate(form.getDueDate());

        // Traduction du String (front) vers Boolean (Supabase)
        if ("yes".equalsIgnoreCase(form.getFuturePlans())) {
            preferences.setWantsMoreChildren(true);
        } else if ("no".equalsIgnoreCase(form.getFuturePlans())) {
            preferences.setWantsMoreChildren(false);
        } else {
            preferences.setWantsMoreChildren(null); // Pour "undecided"
        }

        personPreferencesRepository.save(preferences);

        // 3. Gestion des enfants
        if (form.getChildren() != null && !form.getChildren().isEmpty()) {
            List childrenEntitiesToSave = new ArrayList<>();

            for (CreateChildren childDto : form.getChildren()) {
                ChildrenEntity childEntity = childrenMapper.toChildrenEntity(childDto);
                childEntity.setPerson(person);

                Timelines generatedTimeline = timelineGenerator.generateTimeline(childEntity);
                // Sauvegarde de la timeline ici si nécessaire

                childrenEntitiesToSave.add(childEntity);
            }
            childrenRepository.saveAll(childrenEntitiesToSave);
        }
    }
}

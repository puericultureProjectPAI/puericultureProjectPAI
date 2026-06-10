package com.puericulture.forwardtrading.service;

import com.puericulture.common.dto.PersonProfileDto;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.forwardtrading.dto.children.CreateChildren;
import com.puericulture.forwardtrading.entity.ChildrenEntity;
import com.puericulture.forwardtrading.mapper.ChildrenMapper;
import com.puericulture.forwardtrading.repository.ChildrenRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChildrenService {
    private final ChildrenRepository childrenRepository;
    private final ChildrenMapper childrenMapper;
    private final PersonRepository personRepository;

    @Transactional
    public void createChildren(CreateChildren children, String userId) {
        ChildrenEntity childrenEntity = childrenMapper.toChildrenEntity(children);
        childrenEntity.setPerson(personRepository.getReferenceById(UUID.fromString(userId)));
        childrenRepository.save(childrenEntity);
    }

    public List<PersonProfileDto.ChildPersonProfileDto> getChildren(String userId) {
        UUID personId = UUID.fromString(userId);
        List<ChildrenEntity> childrenEntities = childrenRepository.findByPersonId(personId);
        return childrenMapper.toChildrenPersonProfileDto(childrenEntities);
    }
}

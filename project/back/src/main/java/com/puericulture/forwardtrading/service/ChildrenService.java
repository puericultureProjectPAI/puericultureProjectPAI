package com.puericulture.forwardtrading.service;

import com.puericulture.forwardtrading.dto.children.CreateChildren;
import com.puericulture.forwardtrading.mapper.ChildrenMapper;
import com.puericulture.forwardtrading.repository.ChildrenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChildrenService {
    private final ChildrenRepository childrenRepository;
    private final ChildrenMapper childrenMapper;

    @Transactional
    public void createChildren(CreateChildren children) {
        childrenRepository.save(childrenMapper.toChildrenEntity(children));
    }
}

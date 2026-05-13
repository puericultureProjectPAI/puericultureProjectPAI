package com.puericulture.troc.mapper;

import com.puericulture.troc.dto.PostImageDto;
import com.puericulture.troc.entity.PostImage;
import org.springframework.stereotype.Component;

@Component
public class PostImageMapper {
    public PostImageDto toDto(PostImage entity) {
        if (entity == null) return null;
        PostImageDto dto = new PostImageDto();
        dto.setId(entity.getId());
        dto.setPostId(entity.getPostId());
        dto.setUrl(entity.getUrl());
        dto.setCreatedAt(entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null);
        return dto;
    }

    public PostImage toEntity(PostImageDto dto) {
        if (dto == null) return null;
        PostImage entity = new PostImage();
        entity.setId(dto.getId());
        entity.setPostId(dto.getPostId());
        entity.setUrl(dto.getUrl());
        // createdAt is set by DB, not mapped from DTO
        return entity;
    }
}

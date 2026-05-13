package com.puericulture.troc.mapper;

import com.puericulture.troc.dto.TrocDto;
import com.puericulture.troc.entity.Troc;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TrocMapper {

    @Mapping(target = "postId", source = "id")
    @Mapping(target = "trocId", source = "id")
    @Mapping(target = "title", source = "postTitle")
    @Mapping(target = "open", constant = "true")
    @Mapping(target = "authorName", constant = "Auteur")
    @Mapping(target = "imagesReferences", ignore = true)
    TrocDto toDto(Troc troc);
}

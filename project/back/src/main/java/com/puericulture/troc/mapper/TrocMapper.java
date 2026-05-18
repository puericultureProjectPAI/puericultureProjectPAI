package com.puericulture.troc.mapper;

import com.puericulture.troc.dto.TrocDto;
import com.puericulture.troc.entity.Troc;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TrocMapper {

    @Mapping(target = "productId", source = "id")
    @Mapping(target = "title", source = "postTitle")
    @Mapping(target = "authorId", source = "author.id")
    @Mapping(target = "authorName", source = "author.name")
    TrocDto toDto(Troc troc);
}

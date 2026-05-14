package com.puericulture.troc.mapper;

import com.puericulture.common.mapper.PersonMapper;
import com.puericulture.troc.dto.TrocPostDto;
import com.puericulture.troc.entity.TrocPost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {PersonMapper.class})
public interface TrocPostMapper {

    @Mapping(target = "author", source = "author")
    TrocPostDto toDto(TrocPost trocPost);

    @Mapping(target = "author", source = "author")
    TrocPost toEntity(TrocPostDto trocPostDto);
}

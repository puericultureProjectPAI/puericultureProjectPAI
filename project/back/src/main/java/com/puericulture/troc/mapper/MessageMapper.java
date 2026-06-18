package com.puericulture.troc.mapper;

import com.puericulture.troc.dto.MessageDto;
import com.puericulture.troc.entity.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    @Mapping(target = "senderId", source = "sender.id")
    @Mapping(target = "sentAt", source = "messageTime")
    @Mapping(target = "read", source = "messageRead")
    MessageDto toDto(Message message);
}

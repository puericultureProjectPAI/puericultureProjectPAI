package com.puericulture.troc.dto;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {

    private Long id;
    private UUID senderId;
    private String content;
    private OffsetDateTime sentAt;
    private Boolean read;
}

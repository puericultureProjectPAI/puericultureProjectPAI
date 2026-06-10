package com.puericulture.troc.dto;

import com.puericulture.troc.entity.ExchangeStatus;
import java.time.OffsetDateTime;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDto {

    private Long exchangeId;
    private ExchangeStatus status;
    private ProductTrocDto proposerProduct;
    private ProductTrocDto receiverProduct;
    private String lastMessageContent;
    private OffsetDateTime lastMessageTime;
    private boolean proposer;
    private int unreadCount;
}

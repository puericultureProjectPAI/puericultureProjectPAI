package com.puericulture.troc.controller;

import com.puericulture.troc.dto.ConversationDto;
import com.puericulture.troc.dto.MessageDto;
import com.puericulture.troc.dto.SendMessageRequest;
import com.puericulture.troc.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/troc/conversations")
@RequiredArgsConstructor
@Tag(name = "TROC Conversations", description = "Messages liés aux échanges TROC")
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    @Operation(summary = "Liste toutes les conversations de l'utilisateur connecté")
    public List<ConversationDto> getConversations(@AuthenticationPrincipal String userId) {
        return messageService.getConversations(UUID.fromString(userId));
    }

    @GetMapping("/{exchangeId}/messages")
    @Operation(summary = "Récupère les messages d'un échange")
    public List<MessageDto> getMessages(
            @PathVariable Long exchangeId, @AuthenticationPrincipal String userId) {
        return messageService.getMessages(exchangeId, UUID.fromString(userId));
    }

    @PostMapping("/{exchangeId}/messages")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Envoie un message dans un échange")
    public MessageDto sendMessage(
            @PathVariable Long exchangeId,
            @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal String userId) {
        return messageService.sendMessage(
                exchangeId, request.getContent(), UUID.fromString(userId));
    }
}

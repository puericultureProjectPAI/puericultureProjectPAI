package com.puericulture.troc.service;

import com.puericulture.common.entity.Person;
import com.puericulture.config.errormanager.exception.ForbiddenException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.ConversationDto;
import com.puericulture.troc.dto.MessageDto;
import com.puericulture.troc.entity.Exchange;
import com.puericulture.troc.entity.Message;
import com.puericulture.troc.mapper.MessageMapper;
import com.puericulture.troc.mapper.ProductTrocMapper;
import com.puericulture.troc.repository.ExchangeRepository;
import com.puericulture.troc.repository.MessageRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ExchangeRepository exchangeRepository;
    private final ProductTrocMapper productTrocMapper;
    private final MessageMapper messageMapper;

    @PersistenceContext private EntityManager em;

    public List<ConversationDto> getConversations(UUID userId) {
        List<Exchange> asProposer = exchangeRepository.findByProposerProductAuthorId(userId);
        List<Exchange> asReceiver = exchangeRepository.findByReceiverProductAuthorId(userId);

        return Stream.concat(
                        asProposer.stream().map(e -> toConversationDto(e, true, userId)),
                        asReceiver.stream().map(e -> toConversationDto(e, false, userId)))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<MessageDto> getMessages(Long exchangeId, UUID userId) {
        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Échange introuvable"));
        assertUserInExchange(exchange, userId);
        messageRepository.markAllAsReadForUser(exchangeId, userId);

        return messageRepository.findByExchangeIdOrderByMessageTimeAsc(exchangeId).stream()
                .map(messageMapper::toDto)
                .collect(Collectors.toList());
    }

    public MessageDto sendMessage(Long exchangeId, String content, UUID senderId) {
        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() -> new NotFoundException("Échange introuvable"));
        assertUserInExchange(exchange, senderId);

        Message message = new Message();
        message.setSender(em.getReference(Person.class, senderId));
        message.setExchange(exchange);
        message.setContent(content);

        return messageMapper.toDto(messageRepository.save(message));
    }

    private void assertUserInExchange(Exchange exchange, UUID userId) {
        UUID proposerId = exchange.getProposerProduct().getAuthor().getId();
        UUID receiverId = exchange.getReceiverProduct().getAuthor().getId();
        if (!userId.equals(proposerId) && !userId.equals(receiverId)) {
            throw new ForbiddenException("Accès non autorisé à cet échange");
        }
    }

    private ConversationDto toConversationDto(
            Exchange exchange, boolean isProposer, UUID currentUserId) {
        Optional<Message> last =
                messageRepository.findTopByExchangeIdOrderByMessageTimeDesc(exchange.getId());
        int unread =
                messageRepository.countUnreadByExchangeIdForUser(exchange.getId(), currentUserId);
        return ConversationDto.builder()
                .exchangeId(exchange.getId())
                .status(exchange.getStatus())
                .proposerProduct(productTrocMapper.toDto(exchange.getProposerProduct()))
                .receiverProduct(productTrocMapper.toDto(exchange.getReceiverProduct()))
                .lastMessageContent(last.map(Message::getContent).orElse(null))
                .lastMessageTime(last.map(Message::getMessageTime).orElse(null))
                .proposer(isProposer)
                .unreadCount(unread)
                .build();
    }
}

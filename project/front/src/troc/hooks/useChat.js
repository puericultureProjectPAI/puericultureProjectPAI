import { useEffect, useState, useCallback } from "react";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../utils/messagesApi";
import { acceptExchange, refuseExchange } from "../utils/exchangeApi";

export default function useChat(exchangeId) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const fetchConversation = useCallback(() => {
    return getConversations()
      .then((res) => {
        const conv = res.data.find(
          (c) => c.exchangeId === parseInt(exchangeId),
        );
        setConversation(conv ?? null);
      })
      .catch(console.error);
  }, [exchangeId]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  useEffect(() => {
    const fetch = () =>
      getMessages(exchangeId)
        .then((res) => setMessages(res.data))
        .catch(console.error);
    fetch();
    const interval = setInterval(fetch, 3000);
    return () => clearInterval(interval);
  }, [exchangeId]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    await sendMessage(exchangeId, text.trim());
  };

  const handleAccept = async () => {
    await acceptExchange(exchangeId);
    await fetchConversation();
  };

  const handleRefuse = async () => {
    await refuseExchange(exchangeId);
    await fetchConversation();
  };

  return {
    conversation,
    messages,
    handleSend,
    handleAccept,
    handleRefuse,
  };
}

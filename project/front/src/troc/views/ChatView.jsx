import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../common/security/AuthContext";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../utils/messagesApi";
import { acceptExchange, refuseExchange } from "../utils/exchangeApi";
import sendIcon from "../../assets/send-icon-inverse-m.svg";
import exchangeIcon from "../../assets/exchange-icon-info-m.svg";

function formatTime(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(author) {
  if (!author) return "?";
  const f = (author.firstName || "")[0] || "";
  const n = (author.name || "")[0] || "";
  return (f + n).toUpperCase() || "?";
}

function formatName(author) {
  if (!author) return "";
  const first = author.firstName || "";
  const initial = author.name ? author.name[0].toUpperCase() + "." : "";
  return [first, initial].filter(Boolean).join(" ");
}

function getOtherUser(conv) {
  return conv.proposer
    ? conv.receiverProduct?.author
    : conv.proposerProduct?.author;
}

export default function ChatView() {
  const { exchangeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Charge les infos de l'échange une seule fois
  useEffect(() => {
    getConversations()
      .then((res) => {
        const conv = res.data.find(
          (c) => c.exchangeId === parseInt(exchangeId),
        );
        setConversation(conv ?? null);
      })
      .catch(console.error);
  }, [exchangeId]);

  // Polling messages toutes les 3s
  useEffect(() => {
    const fetch = () =>
      getMessages(exchangeId)
        .then((res) => setMessages(res.data))
        .catch(console.error);
    fetch();
    const interval = setInterval(fetch, 3000);
    return () => clearInterval(interval);
  }, [exchangeId]);

  // Auto-scroll vers le bas à chaque nouveau message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const refreshConversation = () =>
    getConversations()
      .then((res) => {
        const conv = res.data.find(
          (c) => c.exchangeId === parseInt(exchangeId),
        );
        setConversation(conv ?? null);
      })
      .catch(console.error);

  const handleAccept = async () => {
    try {
      await acceptExchange(exchangeId);
      await refreshConversation();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefuse = async () => {
    try {
      await refuseExchange(exchangeId);
      await refreshConversation();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    try {
      await sendMessage(exchangeId, text);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const otherUser = conversation ? getOtherUser(conversation) : null;
  const status = conversation?.status;
  const isReceiver = conversation != null && !conversation.proposer;

  return (
    <div className="flex flex-col bg-white w-full h-full">
      {/* Header */}
      <div className="flex flex-row items-center gap-4 pt-5 pb-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center px-5"
          aria-label="Retour"
        >
          <svg
            width="16"
            height="28"
            viewBox="0 0 16 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 14L12 24"
              stroke="#040037"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="w-14 h-14 rounded-full bg-[#F2F2F9] flex items-center justify-center flex-shrink-0">
          <span className="text-[14px] font-semibold text-[#040037]">
            {getInitials(otherUser)}
          </span>
        </div>
        <span className="text-[20px] font-bold text-[#33323D]">
          {formatName(otherUser) || "…"}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#E3E3E3] mx-6" />

      {/* Blocs fixes : card produits + bannières état */}
      <div className="flex flex-col gap-3 px-6 pt-2.5">
        {/* Card produits */}
        {conversation && (
          <div className="flex flex-row items-center justify-center gap-2.5 py-5 rounded-xl border-2 border-[#757388] bg-[rgba(232,243,255,0.75)]">
            <div className="w-[164px] px-2 py-1">
              <p className="text-[16px] font-bold text-[#33323D] text-center">
                {conversation.proposerProduct?.postTitle}
              </p>
            </div>
            <img src={exchangeIcon} alt="" width={25} height={25} />
            <div className="w-[164px] px-2.5 py-1">
              <p className="text-[16px] font-bold text-[#33323D] text-center">
                {conversation.receiverProduct?.postTitle}
              </p>
            </div>
          </div>
        )}

        {/* Bannière ACCEPTED */}
        {status === "ACCEPTED" && (
          <div className="flex flex-row items-center w-full shadow-[0_2px_2px_rgba(0,0,0,0.1)]">
            <div className="w-5 h-[50px] bg-[#188638] flex-shrink-0" />
            <p className="flex-1 px-4 text-[16px] font-bold text-[#33323D]">
              {isReceiver
                ? "Vous avez accepté cet échange"
                : `${formatName(otherUser)} a accepté cet échange`}
            </p>
          </div>
        )}

        {/* Bannière REFUSED */}
        {status === "REFUSED" && (
          <div className="flex flex-row items-center w-full shadow-[0_2px_2px_rgba(0,0,0,0.1)]">
            <div className="w-5 h-[50px] bg-[#E91C2E] flex-shrink-0" />
            <p className="flex-1 px-4 text-[16px] font-bold text-[#33323D]">
              {isReceiver
                ? "Vous avez refusé cet échange"
                : `${formatName(otherUser)} a refusé cet échange`}
            </p>
          </div>
        )}

        {/* Bannière CONFIRMED */}
        {status === "CONFIRMED" && (
          <div className="flex flex-row items-center w-full shadow-[0_2px_2px_rgba(0,0,0,0.1)]">
            <div className="w-5 h-[50px] bg-[#3A51C9] flex-shrink-0" />
            <p className="flex-1 px-4 text-[16px] font-bold text-[#33323D]">
              Échange terminé
            </p>
          </div>
        )}
      </div>

      {/* Zone scrollable */}
      <div className="flex flex-col flex-1 overflow-y-auto gap-4 px-6 pt-2.5 pb-2">
        {/* Messages */}
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.id;
          return isMe ? (
            <div
              key={msg.id}
              className="flex flex-row justify-end items-end gap-3"
            >
              <div className="flex flex-col items-end gap-1">
                <div
                  className="bg-[#E8F3FF] px-3 py-3 max-w-[75%]"
                  style={{ borderRadius: "16px 16px 0px 16px" }}
                >
                  <p className="text-[16px] text-[#33323D]">{msg.content}</p>
                </div>
                <span className="text-[12px] text-[#757388]">
                  {formatTime(msg.sentAt)}
                </span>
              </div>
              <div className="w-14 h-14 rounded-full bg-[#E8F3FF] flex items-center justify-center flex-shrink-0">
                <span className="text-[13px] font-semibold text-[#040037]">
                  Moi
                </span>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex flex-row items-end gap-3">
              <div className="w-14 h-14 rounded-full bg-[#F2F2F9] flex items-center justify-center flex-shrink-0">
                <span className="text-[13px] font-semibold text-[#040037]">
                  {getInitials(otherUser)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div
                  className="bg-[#F2F2F9] px-3 py-3 max-w-[75%]"
                  style={{ borderRadius: "16px 16px 16px 0px" }}
                >
                  <p className="text-[16px] text-[#33323D]">{msg.content}</p>
                </div>
                <span className="text-[12px] text-[#757388]">
                  {formatTime(msg.sentAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Card proposition (PENDING + receiver) — fixée en bas */}
      {status === "PENDING" && isReceiver && (
        <div className="flex flex-col gap-2 p-3 mx-6 mb-2 rounded-lg border border-[#757388]">
          <p className="text-[16px] text-[#33323D] text-center">
            Voulez-vous accepter définitivement l&apos;échange ?
          </p>
          <div className="h-px bg-[#E3E3E3]" />
          <div className="flex flex-row gap-2.5">
            <button
              type="button"
              onClick={handleRefuse}
              className="flex-1 h-[40px] border border-[#E91C2E] text-[#E91C2E] rounded-lg text-[16px] font-semibold flex items-center justify-center"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 h-[40px] bg-[#188638] text-white rounded-lg text-[16px] font-semibold flex items-center justify-center"
            >
              Accepter
            </button>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-[#E3E3E3] mx-6" />

      {/* Barre d'input */}
      <div className="flex flex-row items-center gap-2.5 px-2.5 pb-3 pt-2">
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center flex-shrink-0"
          aria-label="Joindre"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="#040037"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrire un message..."
          className="flex-1 border border-[#757388] rounded-lg px-3 py-3 text-[16px] text-[#33323D] placeholder:text-[#757388] outline-none bg-white"
        />
        <button
          type="button"
          onClick={handleSend}
          className="w-10 h-10 rounded-full bg-[#040037] flex items-center justify-center flex-shrink-0"
          aria-label="Envoyer"
        >
          <img src={sendIcon} alt="" width={20} height={18} />
        </button>
      </div>
    </div>
  );
}

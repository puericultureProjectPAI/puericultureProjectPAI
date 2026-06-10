import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getConversations } from "../utils/messagesApi";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((today - msgDay) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function getOtherUser(conv) {
  return conv.proposer
    ? conv.receiverProduct?.author
    : conv.proposerProduct?.author;
}

function formatName(author) {
  if (!author) return "Utilisateur";
  const first = author.firstName || "";
  const initial = author.name ? author.name[0].toUpperCase() + "." : "";
  return [first, initial].filter(Boolean).join(" ");
}

function getInitials(author) {
  if (!author) return "?";
  const f = (author.firstName || "")[0] || "";
  const n = (author.name || "")[0] || "";
  return (f + n).toUpperCase() || "?";
}

export default function MessagesListView() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConversations()
      .then((res) => setConversations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = conversations
    .filter((conv) => {
      if (!search) return true;
      const other = getOtherUser(conv);
      const name = formatName(other).toLowerCase();
      const t1 = (conv.proposerProduct?.postTitle || "").toLowerCase();
      const t2 = (conv.receiverProduct?.postTitle || "").toLowerCase();
      const q = search.toLowerCase();
      return name.includes(q) || t1.includes(q) || t2.includes(q);
    })
    .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

  return (
    <div className="flex flex-col bg-white w-full min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 px-6 py-5">
        <h1 className="text-[40px] font-bold text-[#33323D]">Messagerie</h1>

        {/* Search bar */}
        <div className="flex items-center gap-2.5 px-5 py-2.5 border border-[#757388] rounded-[20px]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8C1 4.134 4.134 1 8 1C11.866 1 15 4.134 15 8Z"
              stroke="#757388"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une conversation..."
            className="flex-1 text-[16px] text-[#33323D] bg-transparent outline-none placeholder:text-[#757388]"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#E3E3E3] mx-6" />

      {/* List */}
      <div className="flex flex-col gap-2.5 px-6 py-5">
        {loading && (
          <p className="text-[16px] text-[#757388] text-center py-8">
            Chargement…
          </p>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-[16px] text-[#757388] text-center py-8">
            Aucune conversation.
          </p>
        )}
        {!loading &&
          filtered.map((conv) => {
            const other = getOtherUser(conv);
            const unread = conv.unreadCount > 0;
            return (
              <button
                key={conv.exchangeId}
                type="button"
                onClick={() => navigate(`/troc/chat/${conv.exchangeId}`)}
                className={`flex items-center justify-between w-full px-2.5 py-2.5 rounded-lg bg-white text-left ${
                  unread
                    ? "border-2 border-[#040037]"
                    : "border border-[#757388]"
                }`}
              >
                {/* Avatar + nom + aperçu */}
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-full bg-[#F2F2F9] flex items-center justify-center flex-shrink-0">
                    <span className="text-[13px] font-semibold text-[#040037]">
                      {getInitials(other)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[16px] text-[#33323D]">
                      {formatName(other)}
                    </span>
                    {conv.lastMessageContent && (
                      <span className="text-[14px] text-[#757388] truncate max-w-[180px]">
                        {conv.lastMessageContent}
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge non-lu ou date */}
                {unread ? (
                  <div className="w-8 h-8 rounded-full bg-[#757388] flex items-center justify-center flex-shrink-0 ml-2">
                    <span className="text-[14px] font-bold text-white">
                      {conv.unreadCount}
                    </span>
                  </div>
                ) : (
                  <span className="text-[14px] text-[#757388] flex-shrink-0 ml-2">
                    {formatDate(conv.lastMessageTime)}
                  </span>
                )}
              </button>
            );
          })}
      </div>
    </div>
  );
}

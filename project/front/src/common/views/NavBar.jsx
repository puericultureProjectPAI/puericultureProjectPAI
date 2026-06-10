import searchIcon from "../../assets/icons/button/navbar/menu-search-icon-subtle.svg";
import postIcon from "../../assets/icons/button/navbar/menu-post-icon-subtle.svg";
import profileIcon from "../../assets/icons/button/navbar/menu-profile-icon-subtle.svg";
import messageIcon from "../../assets/icons/button/navbar/menu-message-icon-subtle.svg";
import homeIcon from "../../assets/icons/button/navbar/menu-home-icon-subtle.svg";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../security/AuthContext";
import { getConversations } from "../../troc/utils/messagesApi";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = () => {
      getConversations()
        .then((res) => setHasUnread(res.data.some((c) => c.unreadCount > 0)))
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const buttons = [
    { path: "/", label: "Accueil", icon: homeIcon },
    { path: "/", label: "Rechercher", icon: searchIcon },
    { path: "/", label: "Publier", icon: postIcon },
    {
      path: "/troc/messages",
      label: "Messages",
      icon: messageIcon,
      badge: hasUnread,
    },
    { path: "/me", label: "Profil", icon: profileIcon },
  ];

  const isActive = (path) =>
    path === "/troc/messages"
      ? location.pathname.startsWith("/troc/messages") ||
        location.pathname.startsWith("/troc/chat")
      : location.pathname === path;

  return (
    <div className="shrink-0 z-50 bg-white border-t border-gray-200 flex justify-between px-6 py-3">
      {buttons.map((b) => (
        <IconButton
          key={b.label}
          active={isActive(b.path)}
          onClick={() => navigate(b.path)}
          icon={b.icon}
          label={b.label}
          badge={b.badge}
        />
      ))}
    </div>
  );
}

function IconButton({ active, onClick, icon, label, badge }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer"
    >
      <div className="relative">
        <img
          src={icon}
          className={active ? "text-text-brand" : "text-text-subtle"}
        />
        {badge && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E91C2E]" />
        )}
      </div>
      <div
        className={
          active ? "text-text-brand text-xs" : "text-text-subtle text-xs"
        }
      >
        {label}
      </div>
    </div>
  );
}

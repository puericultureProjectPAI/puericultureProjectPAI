import MenuSearchIcon from "../../assets/icons/button/navbar/menu-search-icon-subtle.jsx";
import MenuPostIcon from "../../assets/icons/button/navbar/menu-post-icon-subtle.jsx";
import MenuProfileIcon from "../../assets/icons/button/navbar/menu-profile-icon-subtle.jsx";
import MenuMessageIcon from "../../assets/icons/button/navbar/menu-message-icon-subtle.jsx";
import MenuHomeIcon from "../../assets/icons/button/navbar/menu-home-icon-subtle.jsx";
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
  }, [user, location.pathname]);

  const buttons = [
    { path: "/", label: "Accueil", Icon: MenuHomeIcon },
    { path: "/", label: "Rechercher", Icon: MenuSearchIcon },
    { path: "/product/create", label: "Publier", Icon: MenuPostIcon },
    {
      path: "/troc/messages",
      label: "Messages",
      Icon: MenuMessageIcon,
      badge: hasUnread,
    },
    { path: "/me", label: "Profil", Icon: MenuProfileIcon },
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
          Icon={b.Icon}
          label={b.label}
          badge={b.badge}
        />
      ))}
    </div>
  );
}

function IconButton({ active, onClick, Icon, label, badge }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer"
    >
      <div className="h-7 flex items-center justify-center">
        <Icon
          className={active ? "text-icon-brand" : "text-feedback-icon-subtle"}
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

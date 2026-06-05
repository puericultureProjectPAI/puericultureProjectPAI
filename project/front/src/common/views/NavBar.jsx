import searchIcon from "../../assets/icons/button/navbar/menu-search-icon-subtle.svg";
import postIcon from "../../assets/icons/button/navbar/menu-post-icon-subtle.svg";
import profileIcon from "../../assets/icons/button/navbar/menu-profile-icon-subtle.svg";
import messageIcon from "../../assets/icons/button/navbar/menu-message-icon-subtle.svg";
import homeIcon from "../../assets/icons/button/navbar/menu-home-icon-subtle.svg";
import { useLocation, useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    { path: "/", label: "Accueil", icon: homeIcon },
    { path: "/", label: "Rechercher", icon: searchIcon },
    { path: "/", label: "Publier", icon: postIcon },
    { path: "/", label: "Messages", icon: messageIcon },
    { path: "/me", label: "Profil", icon: profileIcon },
  ];

  return (
    <div className="sticky bottom-0 z-50 bg-white border-t border-gray-200 flex justify-between px-6 py-3">
      {buttons.map((b) => (
        <IconButton
          key={b.label}
          active={location.pathname === b.path}
          onClick={() => navigate(b.path)}
          icon={b.icon}
          label={b.label}
        />
      ))}
    </div>
  );
}

function IconButton({ active, onClick, icon, label }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer"
    >
      <img
        src={icon}
        className={active ? "text-text-brand" : "text-text-subtle"}
      />

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

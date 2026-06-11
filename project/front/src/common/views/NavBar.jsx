import MenuSearchIcon from "../../assets/icons/button/navbar/menu-search-icon-subtle.jsx";
import MenuPostIcon from "../../assets/icons/button/navbar/menu-post-icon-subtle.jsx";
import MenuProfileIcon from "../../assets/icons/button/navbar/menu-profile-icon-subtle.jsx";
import MenuMessageIcon from "../../assets/icons/button/navbar/menu-message-icon-subtle.jsx";
import MenuHomeIcon from "../../assets/icons/button/navbar/menu-home-icon-subtle.jsx";
import { useLocation, useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    { path: "/", label: "Accueil", Icon: MenuHomeIcon },
    { path: "/", label: "Rechercher", Icon: MenuSearchIcon },
    { path: "/product/create", label: "Publier", Icon: MenuPostIcon },
    { path: "/", label: "Messages", Icon: MenuMessageIcon },
    { path: "/me", label: "Profil", Icon: MenuProfileIcon },
  ];

  return (
    <div className="shrink-0 z-50 bg-white border-t border-gray-200 flex justify-between px-6 py-3">
      {buttons.map((b) => (
        <IconButton
          key={b.label}
          active={location.pathname === b.path}
          onClick={() => navigate(b.path)}
          Icon={b.Icon}
          label={b.label}
        />
      ))}
    </div>
  );
}

function IconButton({ active, onClick, Icon, label }) {
  console.log(label, active);
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer"
    >
      <Icon
        className={active ? "text-icon-brand" : "text-feedback-icon-subtle"}
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

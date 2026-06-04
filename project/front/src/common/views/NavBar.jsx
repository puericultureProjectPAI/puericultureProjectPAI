import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Accueil", icon: "⌂" },
  { to: "/search", label: "Rechercher", icon: "⌕" },
  { to: "/product/create", label: "Publier", icon: "⊕" },
  { to: "/messages", label: "Messages", icon: "✉" },
  { to: "/profile", label: "Profil", icon: "♙" },
];

export default function NavBar() {
  const location = useLocation();

  return (
    <nav className="app-bottom-nav" aria-label="Navigation principale">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`app-bottom-nav__item ${
              isActive ? "app-bottom-nav__item--active" : ""
            }`}
          >
            <span className="app-bottom-nav__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="app-bottom-nav__label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

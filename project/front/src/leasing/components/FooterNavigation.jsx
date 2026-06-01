import React from "react";

export default function FooterNavigation() {
  const navItems = [
    { icon: "home", label: "Accueil", active: true },
    { icon: "search", label: "Rechercher" },
    { icon: "add_circle", label: "Publier" },
    { icon: "mail", label: "Messages" },
    { icon: "person", label: "Profil" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 flex h-[42px] w-[260px] -translate-x-1/2 items-center justify-around border-t border-[#E6E6E6] bg-white z-20">
      {navItems.map((item) => (
        <div
          key={item.label}
          className={`flex flex-col items-center justify-center gap-[2px] text-[7px] leading-none cursor-pointer ${
            item.active ? "text-[#040037]" : "text-[#7C7A8A]"
          }`}
        >
          <span className="material-symbols-rounded text-[16px]">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </div>
      ))}
    </nav>
  );
}

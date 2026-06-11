import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import pour la redirection
import { useChildren } from "../hooks/useChildren";

const DropdownEnfant = ({ timelineId }) => {
  const { children, loading, error } = useChildren();
  const navigate = useNavigate(); // Initialisation du hook de navigation

  const [isOpen, setIsOpen] = useState(false);
  const [manuallySelectedChild, setManuallySelectedChild] = useState(null);

  const activeChild =
    manuallySelectedChild ||
    (children?.length > 0
      ? children.filter((child) => child.timelineId == timelineId)[0]
      : null);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (child) => {
    setManuallySelectedChild(child);
    setIsOpen(false);
    navigate(`../${child.timelineId}`, { relative: "path" });
  };

  // Redirection vers la page d'ajout
  const handleAddChild = () => {
    setIsOpen(false);
    navigate("/forward/create-children"); // Remplace par ta vraie route React
  };

  if (loading) {
    return (
      <div className="text-center font-figtree text-neutral">Chargement...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center font-figtree text-feedback-background-alert-bold">
        Erreur : {error}
      </div>
    );
  }

  // On filtre la liste pour ENLEVER l'enfant actuellement sélectionné
  const availableChildren =
    children?.filter((child) => child.id !== activeChild?.id) || [];

  return (
    <div className="relative w-[330px] font-figtree mx-auto z-50">
      {/* BOUTON DÉCLENCHEUR */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex w-full p-[12px] items-center justify-between rounded-[8px] border border-feedback-border-neutral bg-bg-base cursor-pointer focus:outline-none"
      >
        <span className="text-neutral text-base">
          {activeChild?.firstName || "Sélectionner..."}
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-neutral transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* MENU DÉROULANT */}
      {isOpen && (
        <ul className="absolute z-10 w-full mt-2 bg-bg-base border border-feedback-border-neutral rounded-[8px] shadow-lg overflow-hidden">
          {/* 1. Liste des autres enfants (filtrée) */}
          {availableChildren.map((child, index) => (
            <li key={child.id}>
              <button
                type="button"
                onClick={() => handleSelect(child)}
                className={`w-full text-left px-[12px] py-[10px] text-subtle focus:outline-none transition-colors hover:bg-bg-alternate ${
                  index % 2 !== 0
                    ? "bg-feedback-background-neutral"
                    : "bg-bg-base"
                }`}
              >
                {child.firstName}
              </button>
            </li>
          ))}

          {/* 2. Bouton "Ajouter un enfant +" fixé à la fin */}
          <li>
            <button
              type="button"
              onClick={handleAddChild}
              className="flex w-full items-center justify-between px-[12px] py-[10px] text-subtle hover:bg-bg-alternate focus:bg-info focus:outline-none transition-colors bg-feedback-background-neutral-low"
            >
              <span>Ajouter un enfant</span>
              <span className="text-xl leading-none">+</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropdownEnfant;

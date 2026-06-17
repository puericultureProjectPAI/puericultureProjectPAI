import { useNavigate } from "react-router";

import kiabiLogo from "../../assets/logo-complet-couleur-brand.svg";
import scanIcon from "../../assets/app-bar-scanqr-icon-inverse.svg";
import calendarIcon from "../../assets/calendar-icon-inverse-m.svg";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between bg-text-brand px-4 z-50">
      <button onClick={() => navigate("/home")} aria-label="Accueil">
        <img src={kiabiLogo} alt="Kiabi" className="h-8" />
      </button>
      <div className="flex items-center gap-5">
        <img
          onClick={() => navigate("/second-hand/scan")}
          src={scanIcon}
          alt=""
          className="h-6 w-6"
          aria-hidden="true"
        />
        {/* TODO: brancher la nav vers la timeline du 1er enfant
                  quand le hook useChildren de Baptiste sera mergé */}
        <button aria-label="Timeline">
          <img src={calendarIcon} alt="" className="h-6" />
        </button>
      </div>
    </header>
  );
}

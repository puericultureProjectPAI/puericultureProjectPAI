import { Link, useNavigate } from "react-router";
import kiabiLogo from "../../assets/kiabi-logo.svg";

function QrScannerIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[30px] w-[30px]"
      fill="none"
      viewBox="0 0 32 32"
    >
      <path
        d="M5 11V7.5A2.5 2.5 0 0 1 7.5 5H11M21 5h3.5A2.5 2.5 0 0 1 27 7.5V11M27 21v3.5a2.5 2.5 0 0 1-2.5 2.5H21M11 27H7.5A2.5 2.5 0 0 1 5 24.5V21"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
      <path
        d="M10 10h4v4h-4zM18 10h4v4h-4zM10 18h4v4h-4z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d="M19 18h3v3h-3zM23 22h3M18 25h3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function CalendarClockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[31px] w-[31px]"
      fill="none"
      viewBox="0 0 34 34"
    >
      <path
        d="M8 6v4M22 6v4M6 13h18M8 8h14a3 3 0 0 1 3 3v10.5A3.5 3.5 0 0 1 21.5 25H9a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.3"
      />
      <circle
        cx="25.5"
        cy="24.5"
        r="5.5"
        fill="#080036"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M25.5 21.5v3.3l2.2 1.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="z-50 flex h-[66px] shrink-0 items-center justify-between bg-[#080036] px-4 text-white shadow-[0_1px_3px_rgba(8,0,54,0.20)]">
      <Link
        aria-label="Retour à l'accueil"
        className="flex items-center"
        to="/home"
      >
        <img
          alt="KIABI"
          className="h-[33px] w-[150px] object-contain"
          src={kiabiLogo}
        />
      </Link>

      <div className="flex items-center gap-[15px]">
        <button
          aria-label="Scanner un produit"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-white transition active:scale-95"
          onClick={() => navigate("/second-hand/scan")}
          type="button"
        >
          <QrScannerIcon />
        </button>

        <button
          aria-label="Consulter les locations"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-white transition active:scale-95"
          onClick={() => navigate("/leasing/catalog")}
          type="button"
        >
          <CalendarClockIcon />
        </button>
      </div>
    </header>
  );
}

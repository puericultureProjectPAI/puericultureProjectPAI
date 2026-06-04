import PublicationStepper from "./PublicationStepper.jsx";

const navItems = [
  { icon: "home", label: "Accueil" },
  { icon: "search", label: "Rechercher" },
  { icon: "add_circle", label: "Publier", active: true },
  { icon: "mail", label: "Messages" },
  { icon: "person", label: "Profil" },
];

export default function PublicationMobileShell({
  children,
  currentStep,
  error,
  onBack,
  success,
}) {
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-[414px] flex-col overflow-hidden bg-white text-[#080036] shadow-[0_0_18px_rgba(8,0,54,0.08)]">
      <header className="flex h-[64px] shrink-0 items-center justify-between bg-[#080036] px-[18px] text-white shadow-[0_2px_8px_rgba(8,0,54,0.22)]">
        <div className="publication-kiabi-wordmark" aria-label="KIABI">
          <img
            src="/kiabi-logo.svg"
            alt="KIABI"
            className="publication-mobile-shell__logo"
          />
        </div>
        <div className="flex items-center gap-[20px]" aria-hidden="true">
          <span className="material-symbols-rounded text-[29px] leading-none text-white">
            qr_code_scanner
          </span>
          <span className="material-symbols-rounded text-[34px] leading-none text-white">
            favorite
          </span>
        </div>
      </header>

      <div className="flex flex-1 flex-col px-[24px] pb-[22px] pt-[39px]">
        <div className="mb-[28px] flex items-center gap-[24px]">
          <button
            aria-label="Retour"
            className="-ml-[8px] flex h-[44px] w-[36px] shrink-0 items-center justify-center text-[#080036]"
            onClick={onBack}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-[34px] w-[22px]"
              fill="none"
              viewBox="0 0 21 35"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.5 2.5L3.5 17.5L18.5 32.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="5"
              />
            </svg>
          </button>
          <h1 className="text-[30px] font-extrabold leading-none tracking-[-0.035em] text-[#080036]">
            Publie ton article
          </h1>
        </div>

        <div className="mx-[24px] h-px bg-[#e5e2ea]" />

        <PublicationStepper currentStep={currentStep} />

        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-[12px] font-bold leading-snug text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-bold leading-snug text-red-600">
            {error}
          </div>
        )}

        <div className="flex-1">{children}</div>
      </div>

      <nav className="grid h-[72px] shrink-0 grid-cols-5 border-t border-[#e2e0e8] bg-white px-[12px] pb-[7px] pt-[9px] shadow-[0_-2px_8px_rgba(8,0,54,0.12)]">
        {navItems.map((item) => (
          <button
            className={`flex flex-col items-center justify-center gap-[5px] ${
              item.active ? "text-[#080036]" : "text-[#777388]"
            }`}
            key={item.label}
            type="button"
          >
            <span className="material-symbols-rounded text-[30px] leading-none">
              {item.icon}
            </span>
            <span className="text-[12px] font-medium leading-none">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </section>
  );
}

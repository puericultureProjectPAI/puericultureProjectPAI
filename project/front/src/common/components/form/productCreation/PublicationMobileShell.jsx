import PublicationStepper from "./PublicationStepper.jsx";

export default function PublicationMobileShell({
  children,
  currentStep,
  error,
  success,
}) {
  return (
    <section className="mx-auto max-w-[390px] overflow-hidden rounded-[1.6rem] border border-[#e6e6ef] bg-white shadow-sm">
      <div className="px-7 pb-4 pt-5">
        <div className="mb-1 flex items-center gap-4">
          <span className="text-3xl leading-none text-[#080036]">‹</span>
          <h1 className="text-2xl font-extrabold text-[#080036]">
            Publie ton article
          </h1>
        </div>
        <div className="ml-11 h-px bg-[#efedf5]" />

        <PublicationStepper currentStep={currentStep} />

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {children}
      </div>

      {/* Navbar -- footer sur mobile */}
      <nav className="grid grid-cols-5 border-t border-[#efedf5] bg-white px-4 pb-3 pt-2 text-[10px] text-[#7d7b93]">
        {[
          ["⌂", "Accueil"],
          ["⌕", "Rechercher"],
          ["⊕", "Publier"],
          ["✉", "Messages"],
          ["♙", "Profil"],
        ].map(([icon, label]) => (
          <div
            className={`flex flex-col items-center gap-1 ${
              label === "Publier" ? "font-bold text-[#080036]" : ""
            }`}
            key={label}
          >
            <span className="text-xl leading-none">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </nav>
    </section>
  );
}

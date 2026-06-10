import { Link, useNavigate } from "react-router";

export default function Header() {
  //A adapter plus tard avec la version PC
  const navigate = useNavigate();
  return (
    <header className="flex h-14 shrink-0 items-center justify-between bg-[#080036] px-4 text-white z-50">
      {/* Link évite le hard reload qui réinitialise la session Supabase */}
      <Link
        className="text-2xl font-extrabold tracking-wide text-white"
        to="/home"
      >
        KIABI
      </Link>
      <div className="flex items-center gap-3 text-xl" aria-hidden="true">
        <button
          onClick={() => navigate("/second-hand/scan")}
          className="cursor-pointer bg-transparent border-none p-0 text-white text-xl outline-none focus:outline-none"
        >
          ⌘
        </button>
        <span>♡</span>
      </div>
    </header>
  );
}

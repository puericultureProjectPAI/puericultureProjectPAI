import { useNavigate } from "react-router";

export default function Header() {
  //A adapter plus tard avec la version PC
  const navigate = useNavigate();
  return (
    <header className="flex h-14 shrink-0 items-center justify-between bg-[#080036] px-4 text-white z-50">
      {/* le logo kiabi m'envoie vers la home page */}
      <a className="text-2xl font-extrabold tracking-wide" href="/home">
        KIABI
      </a>
      <div className="flex items-center gap-3 text-xl" aria-hidden="true">
        <span
          onClick={() => navigate("/second-hand/scan")}
          className="cursor-pointer"
        >
          ⌘
        </span>
        <span>♡</span>
      </div>
    </header>
  );
}

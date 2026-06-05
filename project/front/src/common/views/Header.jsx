export default function Header() {
  //A adapter plus tard avec la version PC
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-[#080036] px-4 text-white">
      {/* le logo kiabi m'envoie vers la home page */}
      <a className="text-2xl font-extrabold tracking-wide" href="/home">
        KIABI
      </a>
      <div className="flex items-center gap-3 text-xl" aria-hidden="true">
        <span>⌘</span>
        <span>♡</span>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Header className="flex h-14 items-center justify-between bg-[#080036] px-4 text-white">
      <div className="text-2xl font-extrabold tracking-wide">KIABI</div>
      <div className="flex items-center gap-3 text-xl" aria-hidden="true">
        <span>⌘</span>
        <span>♡</span>
      </div>
    </Header>
  );
}

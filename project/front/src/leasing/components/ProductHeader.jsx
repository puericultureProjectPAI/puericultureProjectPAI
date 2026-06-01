export default function ProductHeader({ onBack }) {
  return (
    <header className="sticky top-0 z-10 w-full bg-white">
      {/* Top Brand Banner */}
      <div className="flex h-[39px] items-center justify-between bg-[#040037] px-[10px] text-white">
        <span className="text-[14px] font-bold tracking-widest">KIABI</span>
        <div className="flex items-center gap-[10px]">
          <span className="material-symbols-rounded text-[17px] cursor-pointer">
            qr_code_scanner
          </span>
          <span className="material-symbols-rounded text-[17px] cursor-pointer">
            favorite
          </span>
        </div>
      </div>

      {/* Navigation Sub-header */}
      <div className="flex items-center justify-between px-[10px] py-[8px] bg-white border-b border-[#F2F2F5]">
        <button
          onClick={onBack}
          className="flex items-center justify-center text-[#040037] focus:outline-none hover:opacity-75 transition-opacity"
        >
          <span className="material-symbols-rounded text-[20px] font-bold">
            chevron_left
          </span>
        </button>

        <button className="flex items-center justify-center text-[#040037] focus:outline-none hover:opacity-75 transition-opacity">
          <span className="material-symbols-rounded text-[18px]">share</span>
        </button>
      </div>
    </header>
  );
}

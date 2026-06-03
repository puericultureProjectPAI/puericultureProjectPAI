export default function ProductImage({ src, alt }) {
  return (
    <div className="w-full bg-white px-[12px] pt-[8px] flex flex-col items-center">
      {/* Product Image Frame */}
      <div className="w-full h-[140px] bg-[#F7F7F9] rounded-[8px] overflow-hidden flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="h-full w-auto object-contain max-w-full"
        />
      </div>

      {/* Carousel Dots Indicators */}
      <div className="flex items-center gap-[4px] mt-[6px] justify-center">
        <span className="w-[5px] h-[5px] rounded-full bg-[#040037]"></span>
        <span className="w-[5px] h-[5px] rounded-full bg-[#7C7A8A]/30"></span>
      </div>

      {/* Seconde main Badge Container (aligned to the right) */}
      <div className="w-full flex justify-end mt-[8px]">
        <span className="rounded-[4px] border border-[#040037] px-[8px] py-[3px] text-[7px] font-bold leading-none text-[#040037] uppercase tracking-wide">
          Seconde main
        </span>
      </div>
    </div>
  );
}

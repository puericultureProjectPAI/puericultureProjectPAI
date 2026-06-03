function formatAgeRange(minMonths, maxMonths) {
  if (minMonths == null && maxMonths == null) return null;
  const fmt = (m) => {
    if (m === 0) return "0";
    const y = Math.floor(m / 12);
    const r = m % 12;
    if (r === 0) return `${y} ans`;
    return `${y} ans ${r} mois`;
  };
  return `${fmt(minMonths ?? 0)} - ${fmt(maxMonths ?? 0)}`;
}

export default function ProductInfo({
  title,
  price,
  description,
  condition,
  brand,
  dimensions,
  minAgeMonths,
  maxAgeMonths,
  maxWeightKg,
}) {
  const ageRange = formatAgeRange(minAgeMonths, maxAgeMonths);

  return (
    <div className="w-full px-[12px] pt-[8px] flex flex-col font-['Figtree',sans-serif]">
      {/* Title and Price */}
      <div className="flex justify-between items-baseline">
        <h1 className="text-[#040037] font-extrabold text-[16px] tracking-tight leading-none">
          {title}
        </h1>
        <span className="text-[#040037] font-extrabold text-[13px] leading-none">
          {price}€
        </span>
      </div>

      {/* Description Label */}
      <span className="text-[#7C7A8A] font-bold text-[9px] mt-[10px] leading-none">
        Description
      </span>

      {/* Description Box */}
      <div className="border border-[#E6E6E6] rounded-[6px] p-[8px] mt-[4px] bg-white">
        <p className="text-[8px] leading-relaxed text-[#040037]">
          {description}
        </p>
      </div>

      {/* Characteristics Table */}
      <div className="mt-[10px] flex flex-col w-full text-[9px] text-[#040037]">
        {/* Etat */}
        <div className="flex justify-between items-center py-[6px] border-b border-[#F2F2F5]">
          <span className="font-bold">Etat</span>
          <span className="text-[#2E7D32] font-semibold">
            {condition || "Très bon état"}
          </span>
        </div>

        {/* Marque */}
        <div className="flex justify-between items-center py-[6px] border-b border-[#F2F2F5]">
          <span className="font-bold">Marque</span>
          <span className="text-[#7C7A8A]">{brand || "Kitchoun"}</span>
        </div>

        {/* Dimension */}
        <div className="flex justify-between items-center py-[6px] border-b border-[#F2F2F5]">
          <span className="font-bold">Dimension</span>
          <span className="text-[#7C7A8A]">
            {dimensions || "15 x 6 x 4 cm"}
          </span>
        </div>

        {/* Tranche d'âge */}
        {ageRange && (
          <div className="flex justify-between items-center py-[6px] border-b border-[#F2F2F5]">
            <span className="font-bold">Tranche d'âge</span>
            <span className="text-[#7C7A8A]">{ageRange}</span>
          </div>
        )}

        {/* Poids max */}
        <div className="flex justify-between items-center py-[6px]">
          <span className="font-bold">Poids max</span>
          <span className="text-[#7C7A8A]">
            {maxWeightKg ? `${maxWeightKg} kg` : "15 kg"}
          </span>
        </div>
      </div>
    </div>
  );
}

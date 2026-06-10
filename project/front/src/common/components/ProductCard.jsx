import { useNavigate } from "react-router";

const fallbackImage = (title) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(title || "Produit")}`;

export default function ProductCard({ p }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/leasing/products/${p.id}`)}
      className="self-stretch h-auto w-52 shrink-0 pb-4 bg-white rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.10)] inline-flex flex-col justify-start items-start gap-2.5 cursor-pointer transition-transform active:scale-95 snap-start"
    >
      <div className="self-stretch rounded-lg inline-flex justify-start items-center gap-2.5 overflow-hidden bg-gray-100 shrink-0">
        <img
          className="w-52 h-44 object-cover"
          src={p.firstImageUrl || fallbackImage(p.postTitle)}
          alt={p.postTitle}
        />
      </div>
      <div className="self-stretch flex-1 px-3 flex flex-col justify-start items-start gap-1">
        <div className="self-stretch inline-flex justify-end items-start gap-2">
          <div className="px-3 py-1 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-[#080036] flex justify-center items-center">
            <div className="justify-start text-[#080036] text-sm font-normal font-['Figtree'] leading-tight">
              Location
            </div>
          </div>
        </div>
        <div className="text-center justify-start text-[#080036] text-base font-normal font-['Figtree'] truncate w-full">
          {p.postTitle}
        </div>
        <div className="text-center justify-start text-[#080036] text-base font-semibold font-['Figtree']">
          {p.pricePerMonth}€/mois
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router";

export default function GlobalCatalogView() {
  const navigate = useNavigate();

  // Données fictives basées sur la maquette
  const products = [
    {
      id: 1,
      title: "Pyjama gris",
      price: "8.90€",
      type: "Location",
      image: "https://placehold.co/182x243",
    },
    {
      id: 2,
      title: "Pyjama gris",
      price: "8.90€",
      type: "Location",
      image: "https://placehold.co/182x182",
    },
    {
      id: 3,
      title: "Pyjama gris",
      price: "8.90€",
      type: "Location",
      image: "https://placehold.co/182x182",
    },
    {
      id: 4,
      title: "Pyjama gris",
      price: "8.90€",
      type: "Location",
      image: "https://placehold.co/182x182",
    },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-white font-['Figtree']">
      {/* Header section (Title & count) */}
      <div className="px-6 py-4 flex flex-col gap-1">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            {
              label: "Échange",
              img: "https://placehold.co/80x160?text=Echange",
            },
            {
              label: "Location",
              img: "https://placehold.co/80x160?text=Location",
            },
            {
              label: "2nde Main",
              img: "https://placehold.co/80x160?text=2nde\nMain",
            },
            {
              label: "Forward",
              img: "https://placehold.co/80x160?text=Forward",
            },
          ].map((cat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="w-full aspect-[1/2] rounded-lg object-cover shadow-sm border border-gray-200"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-6 pb-6 grid grid-cols-2 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg shadow-sm pb-4 flex flex-col gap-2 overflow-hidden border border-gray-100 cursor-pointer transition-transform active:scale-95"
            onClick={() => navigate(`/leasing/products/${p.id}`)}
          >
            <div className="h-44 w-full bg-gray-100 overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={p.image}
                alt={p.title}
              />
            </div>
            <div className="px-3 flex flex-col gap-1">
              <div className="flex justify-end">
                <span className="px-3 py-1 rounded-xl border border-[#080036] text-[#080036] text-[10px] font-medium">
                  {p.type}
                </span>
              </div>
              <div className="text-center text-black text-sm font-normal">
                {p.title}
              </div>
              <div className="text-center text-[#080036] text-sm font-bold">
                {p.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

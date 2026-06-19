import { useNavigate } from "react-router";
import ongletSec from "../../assets/catalog/onglet-sec.png";
import ongletTroc from "../../assets/catalog/onglet-troc.png";
import ongletLeas from "../../assets/catalog/onglet-leas.png";
import ongletFt from "../../assets/catalog/onglet-ft.png";

const CATALOG_TABS = [
  {
    label: "Seconde main",
    img: ongletSec,
    path: "/second-hand/catalog",
    pb: "pb-5",
  },
  {
    label: "Échange",
    img: ongletTroc,
    path: "/troc/catalog",
    pb: "pb-8",
  },
  {
    label: "Location",
    img: ongletLeas,
    path: "/leasing/catalog",
    pb: "pb-8",
  },
  {
    label: "Forward trading",
    img: ongletFt,
    path: "/forward/catalog",
    pb: "pb-5",
  },
];

export default function CatalogTabs() {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <div className="flex gap-3 px-6 py-4 w-max mx-auto">
        {CATALOG_TABS.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => navigate(cat.path)}
            className={`w-20 h-48 min-w-20 min-h-48 px-2 ${cat.pb} rounded-lg inline-flex flex-col justify-end items-center gap-2.5 overflow-hidden cursor-pointer transition-transform active:scale-95 bg-cover bg-center border border-gray-200`}
            style={{ backgroundImage: `url(${cat.img})` }}
          >
            <div className="w-full max-w-16 inline-flex justify-center items-center gap-2.5">
              <div className="flex-1 text-center text-[#080036] text-base font-normal font-['Figtree'] leading-tight">
                {cat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

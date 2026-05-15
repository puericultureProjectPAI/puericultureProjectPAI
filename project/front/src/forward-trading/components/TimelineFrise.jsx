import { useState } from "react";
import { QUARTERLY_DATA } from "../utils/recommendations";

export default function TimelineFrise() {
  const [activeTab, setActiveTab] = useState(QUARTERLY_DATA[0]);

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-10">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-b-3xl shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-800">Ma Timeline</h2>
        <p className="text-sm text-gray-500">
          Anticipez les besoins de votre enfant
        </p>
      </div>

      {/* FRISE */}
      <div className="relative px-6 mb-10">
        <div className="absolute top-5 left-10 right-10 h-0.5 bg-gray-200"></div>
        <div className="flex justify-between relative z-10">
          {QUARTERLY_DATA.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                  activeTab.id === item.id
                    ? "bg-blue-600 border-blue-100 scale-110"
                    : "bg-white border-gray-100 text-gray-400"
                }`}
              >
                <span
                  className={`text-xs font-bold ${activeTab.id === item.id ? "text-white" : ""}`}
                >
                  {item.type}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold uppercase ${activeTab.id === item.id ? "text-blue-600" : "text-gray-400"}`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU */}
      <div className="px-6">
        <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
          {/* Etoile en SVG Natif */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#EAB308"
            stroke="#EAB308"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Articles recommandés
        </h3>

        <div className="space-y-4">
          {activeTab.products.map((product, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-transparent hover:border-blue-100"
            >
              {/* Carré de couleur au lieu d'une icône sac */}
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-300 font-bold text-xl">
                {product.name.charAt(0)}
              </div>

              <div className="flex-1">
                <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded-md">
                  {product.tag}
                </span>
                <h4 className="text-sm font-bold text-gray-800 mt-1">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-400">Prix : {product.price}</p>
              </div>

              {/* Flèche en caractère texte simple */}
              <span className="text-gray-300 text-xl font-light">›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

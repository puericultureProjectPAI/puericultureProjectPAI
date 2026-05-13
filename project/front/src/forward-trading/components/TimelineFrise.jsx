import { useState } from "react";
import { ShoppingBag, ChevronRight, Star } from "lucide-react";
import { QUARTERLY_DATA } from "../utils/recommendations";

export default function TimelineFrise() {
  const [activeTab, setActiveTab] = useState(QUARTERLY_DATA[0]);

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-10">
      {/* HEADER VISUEL */}
      <div className="bg-white p-6 rounded-b-3xl shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-800">Ma Timeline</h2>
        <p className="text-sm text-gray-500">
          Anticipez les besoins de votre enfant
        </p>
      </div>

      {/* LA FRISE HORIZONTALE */}
      <div className="relative px-6 mb-10">
        <div className="absolute top-5 left-10 right-10 h-0.5 bg-gray-200 -z-0"></div>
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
                    ? "bg-blue-600 border-blue-100 scale-110 shadow-lg shadow-blue-200"
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
                className={`text-[10px] font-bold uppercase tracking-tighter ${
                  activeTab.id === item.id ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU : RECOMMANDATIONS */}
      <div className="px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          Articles recommandés
        </h3>

        <div className="space-y-4">
          {activeTab.products.map((product, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-transparent hover:border-blue-100 transition-all"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                <ShoppingBag size={20} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded-md">
                  {product.tag}
                </span>
                <h4 className="text-sm font-bold text-gray-800 mt-1">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-400">
                  Prix indicatif : {product.price}
                </p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

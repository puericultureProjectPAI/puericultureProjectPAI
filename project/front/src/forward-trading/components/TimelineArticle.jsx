export default function TimelineArticle({ article }) {
  return (
    <div className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-transparent hover:border-blue-100">
      {/* Carré de couleur au lieu d'une icône sac */}
      <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-300 font-bold text-xl">
        {article.name.charAt(0)}
      </div>

      <div className="flex-1">
        <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded-md">
          {article.tag}
        </span>
        <h4 className="text-sm font-bold text-gray-800 mt-1">{article.name}</h4>
        <p className="text-xs text-gray-400">Prix : {article.price}</p>
      </div>

      {/* Flèche en caractère texte simple */}
      <span className="text-gray-300 text-xl font-light">›</span>
    </div>
  );
}

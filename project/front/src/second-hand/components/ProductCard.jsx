const ProductCard = ({ product }) => {
  return (
    <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      {/* Image produit */}
      <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-gray-50">
        <img
          src={product.imageUrl || "https://via.placeholder.com/150"}
          alt={product.name}
          className="h-full w-full object-contain p-2 mix-blend-multiply"
        />
      </div>

      {/* Badges */}
      <div className="mb-2 flex gap-1">
        <span className="rounded border border-gray-300 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gray-500">
          Location
        </span>

        <span className="rounded border border-gray-300 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gray-500">
          Troc
        </span>
      </div>

      {/* Infos produit */}
      <h3 className="line-clamp-1 text-xs font-medium text-gray-700">
        {product.name}
      </h3>

      <p className="text-sm font-bold text-[#000033]">
        {product.price || "8.90"}€
      </p>
    </div>
  );
};

export default ProductCard;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TrocPostCard from "../components/TrocPostCard";
import { useTrocPosts } from "../hooks/useTrocPosts";

const CATEGORIES = [
  "Poussette",
  "Siège auto",
  "Vêtements",
  "Jouets",
  "Mobilier",
  "Autre",
];

export default function TrocListView() {
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const { data: posts, isLoading, isError } = useTrocPosts({ category, city });

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Offres de troc</h1>

      <div className="flex flex-col gap-3 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
        >
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filtrer par ville..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
        />
      </div>

      {isLoading && (
        <p className="text-center text-gray-500 py-12">Chargement...</p>
      )}

      {isError && (
        <p className="text-center text-red-500 py-12">
          Une erreur est survenue. Veuillez réessayer.
        </p>
      )}

      {!isLoading && !isError && posts?.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          Aucune offre disponible pour ces critères.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {posts?.map((post) => (
          <TrocPostCard
            key={post.id}
            post={post}
            onClick={() => navigate(`/troc/${post.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

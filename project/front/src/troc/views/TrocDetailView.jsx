import { useNavigate, useParams } from "react-router-dom";
import { useTrocPost } from "../hooks/useTrocPosts";

export default function TrocDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, isError } = useTrocPost(id);

  if (isLoading) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <p className="text-center text-gray-500 py-12">Chargement...</p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <p className="text-center text-red-500 py-12">
          Cette annonce est introuvable ou une erreur est survenue.
        </p>
        <button
          onClick={() => navigate("/troc")}
          className="block mx-auto text-blue-600 text-sm underline"
        >
          Retour aux offres
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate("/troc")}
        className="text-blue-600 text-sm mb-4 inline-block"
      >
        ← Retour aux offres
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex justify-between items-start gap-2 mb-3">
          <h1 className="text-xl font-bold text-gray-900">{post.postTitle}</h1>
          <span className="shrink-0 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {post.category}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-4">{post.city}</p>

        <p className="text-gray-700 mb-6">{post.description}</p>

        {(post.brand || post.model) && (
          <p className="text-sm text-gray-500 mb-2">
            {post.brand && (
              <span>
                Marque :{" "}
                <span className="font-medium text-gray-800">{post.brand}</span>
              </span>
            )}
            {post.brand && post.model && " — "}
            {post.model && (
              <span>
                Modèle :{" "}
                <span className="font-medium text-gray-800">{post.model}</span>
              </span>
            )}
          </p>
        )}

        {post.estimatedPrice != null && (
          <p className="text-sm text-gray-500">
            Valeur estimée :{" "}
            <span className="font-medium text-gray-800">
              {post.estimatedPrice} €
            </span>
          </p>
        )}

        {post.author && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">Publié par</p>
            <p className="text-sm font-medium text-gray-700">
              {post.author.firstName} {post.author.name}
            </p>
            {post.author.city && (
              <p className="text-xs text-gray-500">{post.author.city}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

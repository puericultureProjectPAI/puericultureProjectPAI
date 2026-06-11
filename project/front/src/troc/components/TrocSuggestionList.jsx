const productTitle = (product) => product?.postTitle || "Article sans titre";

const authorName = (author) => {
  const firstName = author?.firstName || "";
  const name = author?.name || "";
  const fullName = `${firstName} ${name}`.trim();
  return fullName || author?.email || "Autre utilisateur";
};

const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "Prix non renseigné";
  }
  return `${price} €`;
};

const TrocSuggestionList = ({ suggestions = [], loading, onRefresh }) => {
  if (!loading && suggestions.length === 0) {
    return (
      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#080036]">
              Suggestions de troc
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Aucune suggestion disponible pour le moment.
            </p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="rounded-lg bg-[#080036] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1a1157]"
              type="button"
            >
              Actualiser
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#080036]">
            Suggestions de troc
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Les articles les plus pertinents sont calculés automatiquement à
            partir de vos annonces de troc.
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="rounded-lg bg-[#080036] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1a1157] disabled:bg-gray-400"
            type="button"
          >
            {loading ? "Chargement..." : "Actualiser"}
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {suggestions.map((suggestion) => (
          <article
            key={suggestion.id}
            className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Article suggéré
                </p>
                <h3 className="mt-1 line-clamp-2 text-lg font-bold text-[#080036]">
                  {productTitle(suggestion)}
                </h3>
              </div>
              <div className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">
                {suggestion.indicePertinence}%
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Catégorie :</span>{" "}
                {suggestion.category || "Non renseignée"}
              </p>
              <p>
                <span className="font-semibold">Ville :</span>{" "}
                {suggestion.city || "Non renseignée"}
              </p>
              <p>
                <span className="font-semibold">Prix estimé :</span>{" "}
                {formatPrice(suggestion.estimatedPrice)}
              </p>
              <p>
                <span className="font-semibold">Par :</span>{" "}
                {authorName(suggestion.author)}
              </p>
            </div>

            {suggestion.pertinenceReason && (
              <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                {suggestion.pertinenceReason}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default TrocSuggestionList;

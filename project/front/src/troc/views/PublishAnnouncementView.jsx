import PublishAnnouncementForm from "../components/PublishAnnouncementForm";
import { useTrocPosts } from "../hooks/useTrocPosts";

export default function PublishAnnouncementView() {
  const { posts, loading, error, success, publishPost } = useTrocPosts();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">Troc · US 1</p>
          <h1 className="mb-3 text-3xl font-bold text-slate-900">Publier une annonce</h1>
          <p className="mb-6 text-sm leading-6 text-slate-600">
            Créez une annonce de type troc. Une fois validée, elle est enregistrée en base et
            visible dans la liste des offres.
          </p>
          <PublishAnnouncementForm onSubmit={publishPost} />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Liste des offres</h2>
              <p className="text-sm text-slate-500">Vérification du critère d’acceptation.</p>
            </div>
          </div>

          {success && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Chargement des annonces...
            </p>
          ) : posts.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Aucune annonce pour le moment.
            </p>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <article key={post.productId} className="rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{post.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{post.description}</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                      {post.category || "TROC"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                    <span>Prix estimé : {post.estimatedPrice ?? 0} €</span>
                    {post.imageUrl && <span>Image : {post.imageUrl}</span>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

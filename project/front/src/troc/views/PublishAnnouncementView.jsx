import PublishAnnouncementForm from "../components/PublishAnnouncementForm"; // 引入发布公告表单组件。
import { useTrocPosts } from "../hooks/useTrocPosts"; // 引入 Troc 公告 hook，集中管理 API 数据。

export default function PublishAnnouncementView() { // 定义 US1 发布公告页面。
  const { posts, loading, error, success, publishPost } = useTrocPosts(); // 读取公告列表、加载状态、错误信息、成功信息和发布方法。

  return ( // 返回页面结构。
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      {/* 页面主容器，使用浅色背景和移动端优先间距。 */}
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* 页面内容区域，大屏幕下左右两列布局。 */}
        <div>
          {/* 左侧表单区域。 */}
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
            {/* 模块标签。 */}
            Troc · US 1
          </p>
          <h1 className="mb-3 text-3xl font-bold text-slate-900">
            {/* 页面标题。 */}
            Publier une annonce
          </h1>
          <p className="mb-6 text-sm leading-6 text-slate-600">
            {/* 页面说明文字。 */}
            Créez une annonce de type troc. Une fois validée, elle est enregistrée en base et visible dans la liste des offres.
          </p>
          {/* 发布公告表单。 */}
          <PublishAnnouncementForm onSubmit={publishPost} />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          {/* 右侧列表区域。 */}
          <div className="mb-4 flex items-center justify-between gap-3">
            {/* 列表标题行。 */}
            <div>
              {/* 列表标题文字容器。 */}
              <h2 className="text-xl font-bold text-slate-900">
                {/* 列表标题。 */}
                Liste des offres
              </h2>
              <p className="text-sm text-slate-500">
                {/* 列表副标题。 */}
                Vérification du critère d’acceptation.
              </p>
            </div>
          </div>

          {success && ( // 如果有成功信息则显示成功提示。
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {/* 成功提示内容。 */}
              {success}
            </div>
          )}

          {error && ( // 如果有错误信息则显示错误提示。
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {/* 错误提示内容。 */}
              {error}
            </div>
          )}

          {loading ? ( // 如果正在加载列表，则显示加载提示。
            <p className="text-sm text-slate-500">
              {/* 加载状态文案。 */}
              Chargement des annonces...
            </p>
          ) : posts.length === 0 ? ( // 如果没有公告，则显示空状态。
            <p className="rounded-xl bg-slate-50 px-3 py-6 text-center text-sm text-slate-500">
              {/* 空列表文案。 */}
              Aucune annonce pour le moment.
            </p>
          ) : ( // 如果存在公告，则渲染公告列表。
            <div className="space-y-3">
              {/* 公告卡片列表容器。 */}
              {posts.map((post) => ( // 遍历每条公告并生成卡片。
                <article className="rounded-xl border border-gray-200 p-4" key={post.postId}>
                  {/* 单条公告卡片。 */}
                  <div className="mb-2 flex items-start justify-between gap-3">
                    {/* 公告标题和状态行。 */}
                    <h3 className="font-semibold text-slate-900">
                      {/* 公告标题。 */}
                      {post.title}
                    </h3>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                      {/* 公告类型标签。 */}
                      Troc
                    </span>
                  </div>
                  <p className="mb-3 text-sm leading-6 text-slate-600">
                    {/* 公告描述。 */}
                    {post.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    {/* 公告辅助信息区域。 */}
                    <span className="rounded-full bg-slate-100 px-2 py-1">
                      {/* 估计价格展示。 */}
                      Prix estimé : {post.estimatedPrice} €
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">
                      {/* 作者展示。 */}
                      Auteur : {post.authorName}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">
                      {/* 开放状态展示。 */}
                      {post.open ? "Ouverte" : "Fermée"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  ); // 结束 return。
} // 结束 PublishAnnouncementView 组件。

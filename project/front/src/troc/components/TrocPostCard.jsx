export default function TrocPostCard({ post, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md active:scale-95 transition-all"
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h2 className="font-semibold text-gray-900 line-clamp-2">
          {post.postTitle}
        </h2>
        <span className="shrink-0 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {post.category}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-2">{post.city}</p>
      <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
    </button>
  );
}

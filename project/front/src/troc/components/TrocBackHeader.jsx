import { useNavigate } from "react-router";

export default function TrocBackHeader({ title, rightElement }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <span className="material-symbols-rounded text-[20px]">
            arrow_back
          </span>
        </button>
        {title && <div className="text-base font-semibold">{title}</div>}
      </div>

      <div>{rightElement ?? <div />}</div>
    </div>
  );
}

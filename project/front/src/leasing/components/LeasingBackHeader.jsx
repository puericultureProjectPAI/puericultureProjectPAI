import { useNavigate } from "react-router";

export default function LeasingBackHeader({ rightElement }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-[12px] py-[10px] shrink-0">
      <button onClick={() => navigate(-1)} className="p-[2px]">
        <span className="material-symbols-rounded text-[20px]">arrow_back</span>
      </button>
      {rightElement ?? <div />}
    </div>
  );
}

import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import DropdownHeader from "./DropdownHeader";
import DropdownArticleCard from "./DropdownArticleCard";

export default function Dropdown({
  title,
  articles = [],
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen && articles.length > 0);
  const navigate = useNavigate();
  const location = useLocation();

  const reservedNoms = useMemo(() => {
    const stored = sessionStorage.getItem("reservedArticleNoms");
    return new Set(stored ? JSON.parse(stored) : []);
  }, [location.key]);

  const deletedNoms = useMemo(() => {
    const stored = sessionStorage.getItem("deletedArticleNoms");
    return new Set(stored ? JSON.parse(stored) : []);
  }, [location.key]);

  return (
    <div className="self-stretch flex flex-col">
      <DropdownHeader
        title={title}
        count={articles.length}
        open={open}
        onToggle={() => setOpen((prev) => !prev)}
      />

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-2 flex flex-col gap-2">
          {articles
            .filter((article) => !deletedNoms.has(article.nom))
            .map((article, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  navigate("/forward/article", { state: { article } })
                }
                className="text-left"
              >
                <DropdownArticleCard
                  {...article}
                  reserved={reservedNoms.has(article.nom)}
                />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

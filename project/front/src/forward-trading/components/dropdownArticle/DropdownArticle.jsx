import { useState } from "react";
import DropdownHeader from "./DropdownHeader";
import DropdownArticleCard from "./DropdownArticleCard";

export default function Dropdown({
  title,
  articles = [],
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen && articles.length > 0);

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
          {articles.map((article, i) => (
            <DropdownArticleCard key={i} {...article} />
          ))}
        </div>
      </div>
    </div>
  );
}

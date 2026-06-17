export default function DropdownArticleCard({ name, price, age }) {
  return (
    <div className="w-full p-5 bg-bg-base rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-feedback-border-neutral inline-flex justify-start items-center gap-3 overflow-hidden">
      {/* Thumbnail placeholder */}
      <div className="size-16 p-2.5 bg-feedback-background-neutral rounded-lg flex flex-col justify-center items-center gap-2.5 overflow-hidden shrink-0">
        <div className="size-12 bg-feedback-icon-subtle" />
      </div>

      {/* Infos */}
      <div className="flex-1 max-w-52 flex flex-col justify-start items-start gap-2">
        <span className="text-brand text-xl font-bold font-figtree">
          {name}
        </span>
        <span className="text-neutral text-base font-normal font-figtree">
          {price}
        </span>
        {age && (
          <span className="text-neutral text-base font-normal font-figtree">
            {age}
          </span>
        )}
      </div>
    </div>
  );
}

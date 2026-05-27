import ChildCard from "./ChildCard";

export default function ChildList({ children }) {
  return (
    <div className="w-[96%] inline-flex flex-col justify-start items-start gap-3.5">
      <div className="justify-start text-neutral text-xl font-bold font-figtree">
        Ma famille
      </div>

      {children.map((child) => (
        <ChildCard key={child.firstName} child={child} />
      ))}
    </div>
  );
}

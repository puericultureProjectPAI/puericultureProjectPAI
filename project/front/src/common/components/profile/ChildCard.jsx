import ChildIcon from "../../../assets/icons/profile/profile-picture-blue.svg";

export default function ChildCard({ child }) {
  return (
    <div className="self-stretch px-4 py-[3px] bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-black/10 inline-flex justify-start items-center gap-3">
      <div className="size-8  bg-feedback-background-neutral rounded-[32px] outline outline-1 outline-feedback-background-info flex justify-center items-center gap-2.5 overflow-hidden">
        <img className="size-7 " src={ChildIcon} />
      </div>
      <div className="size- inline-flex flex-col justify-center items-start gap-0.5">
        <div className="w-min-40 flex flex-col justify-start items-start">
          <div className="justify-start text-black text-xl font-bold font-figtree">
            {child.firstName}
          </div>
          <div className="w-min-12 h-5 justify-start text-subtle text-base font-normal font-figtree">
            {child.age
              ? `${child.age} an${child.age > 1 ? "s" : ""}`
              : "Bébé attendu"}{" "}
          </div>
          {child.age ? (
            <div className="w-min-40 h-5 justify-start text-subtle text-base font-normal font-figtree">
              {`(née le
                            ${new Intl.DateTimeFormat("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }).format(new Date(child.birthDate))})`}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

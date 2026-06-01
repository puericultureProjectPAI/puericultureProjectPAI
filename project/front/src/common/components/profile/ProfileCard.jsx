import { getMonth } from "../../utils/month";
import orangeProfile from "../../../assets/icons/profile/profile-picture-orange.svg";
import editIcon from "../../../assets/icons/edit.svg";
export default function ProdileCard({ person }) {
  return (
    <div className="w-[96%] m-2 p-3 bg-bg-alternate rounded-lg outline outline-1 outline-offset-[-1px] outline-black/0 inline-flex flex-col justify-start items-start gap-3 font-figtree">
      <div className="justify-start text-neutral text-xl font-bold font-figtree">
        Mon profil
      </div>
      <div className="self-stretch rounded-2xl inline-flex justify-start items-center gap-8">
        <div className="size-16 bg-feedback-background-neutral rounded-[32px] outline outline-1 outline-feedback-background-warning-bold flex justify-center items-center overflow-hidden">
          <img className="size-7" src={orangeProfile} />
        </div>
        <div className="size- inline-flex flex-col justify-center items-start gap-2">
          <div className="w-36 justify-start text-brand text-2xl font-extrabold">{`${person.firstName}.${person.lastName[0]}`}</div>
          <div className="w-min-[48%] h-5 justify-start text-subtle text-base font-normal">{`Membre depuis ${getMonth(person.memberSinceMonth)} ${person.memberSinceYear}`}</div>
        </div>
        <img className="size-5" src={editIcon} />
      </div>
    </div>
  );
}

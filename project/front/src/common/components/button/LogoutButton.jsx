import logoutIcon from "../../../assets/icons/button/logout.svg";
export default function LogoutButton() {
  return (
    <div className="w-80 h-10 p-2 bg-bg-base rounded-lg outline outline-1 outline-offset-[-1px] outline-feedback-background-alert-bold inline-flex justify-center items-center gap-3 overflow-hidden">
      <div className="size- inline-flex flex-col justify-start items-start overflow-hidden">
        <img className="size-6 relative" src={logoutIcon} />
      </div>
      <div className="text-center justify-start text-feedback-background-alert-bold text-base font-semibold font-figtree">
        Se déconnecter
      </div>
    </div>
  );
}

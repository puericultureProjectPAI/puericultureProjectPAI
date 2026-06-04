import { useNavigate } from "react-router-dom";
import successBg from "../../assets/onboarding/success_onboarding.png";

export const SuccessScreenOnBoarding = ({ onComplete }) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full max-w-[430px] min-h-[932px] mx-auto px-5 inline-flex flex-col justify-start items-center gap-5 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${successBg})` }}
    >
      <div className="self-stretch flex-1 p-2.5 flex flex-col justify-end items-center gap-2.5 overflow-hidden">
        <div className="text-center justify-start text-feedback-text-inverse text-4xl font-bold font-figtree">
          Bienvenue !
        </div>
        <div className="max-w-96 text-center justify-start text-feedback-text-inverse text-xl font-bold font-figtree mt-2">
          Votre compte a été créé avec succès.
        </div>
      </div>
      <div className="flex-1 p-2.5 inline-flex justify-start items-start gap-2.5 overflow-hidden">
        <button
          type="button"
          onClick={() => {
            if (onComplete) onComplete();
            //Redirect
            navigate("/me");
          }}
          className="w-80 h-10 p-2 bg-bg-base rounded-lg inline-flex justify-center items-center gap-3 overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div className="text-center justify-start text-text-brand text-base font-semibold font-figtree">
            C&apos;est parti !
          </div>
        </button>
      </div>
    </div>
  );
};

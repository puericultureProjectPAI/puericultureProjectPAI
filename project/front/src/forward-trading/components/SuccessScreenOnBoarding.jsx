import { useNavigate } from "react-router-dom";
import successBg from "../../assets/onboarding/success_onboarding.png";

export const SuccessScreenOnBoarding = ({ onComplete }) => {
  const navigate = useNavigate();
  return (
    <div
      className="w-full min-h-screen px-5 flex flex-col justify-start items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${successBg})` }}
    >
      {/* Texte — flex-1 avec justify-end = collé au centre */}
      <div className="flex-1 p-2.5 flex flex-col justify-end items-center gap-2.5">
        <div className="text-center text-feedback-text-inverse text-4xl font-bold font-figtree">
          Bienvenue !
        </div>
        <div className="max-w-96 text-center text-feedback-text-inverse text-xl font-bold font-figtree">
          Votre compte a été créé avec succès.
        </div>
      </div>

      {/* Bouton — flex-1 avec items-start = collé au centre aussi */}
      <div className="flex-1 p-2.5 w-full flex justify-center items-start">
        <button
          type="button"
          onClick={() => {
            if (onComplete) onComplete();
            navigate("/home", { replace: true });
          }}
          className="w-full h-10 p-2 bg-bg-base rounded-lg flex justify-center items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <span className="text-text-brand text-base font-semibold font-figtree">
            {" "}
            C&apos;est parti !
          </span>
        </button>
      </div>
    </div>
  );
};

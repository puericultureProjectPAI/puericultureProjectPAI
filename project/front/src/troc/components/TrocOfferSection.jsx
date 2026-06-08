import { useNavigate } from "react-router";
import { useAuth } from "../../common/security/AuthContext";

export default function TrocOfferSection({ product }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePropose = () => {
    if (!isAuthenticated) {
      navigate("/connection");
      return;
    }
    navigate(`/troc/select-my-product/${product.id}`);
  };

  return (
    <div className="w-full px-4 py-3">
      <div className="max-w-3xl mx-auto">
        {/* separator above actions */}
        <div className="border-t border-[#F0F0F2] mb-3" />

        <div className="w-full max-w-[330px] mx-auto flex flex-col items-center gap-4">
          <button className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-md text-[16px] text-[#040037] font-normal">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                d="M20.8 4.6c-1.5-1.4-3.8-1.4-5.3 0l-.9.8-.9-.8c-1.5-1.4-3.8-1.4-5.3 0-1.5 1.4-1.5 3.8 0 5.2l6.2 5.6 6.2-5.6c1.5-1.4 1.5-3.8 0-5.2z"
                stroke="#040037"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Ajouter à ma wishlist
          </button>
          <div className="w-full border-t border-[#F0F0F2]" />

          <button
            type="button"
            onClick={handlePropose}
            className="bg-[#040037] text-white rounded-[8px] flex items-center gap-3 w-full justify-center shadow-sm h-[40px] px-4"
          >
            <svg
              width="26.667"
              height="26.667"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transform rotate-90"
            >
              <path d="M2 12L22 2v20L2 12z" fill="white" />
            </svg>
            <span className="text-[16px] font-semibold">
              Proposer un échange
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

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
      <div className="rounded-lg border border-feedback-border-neutral bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-neutral">
              Proposer un échange
            </p>
            <p className="text-sm text-subtle">
              Proposez l'un de vos produits en échange
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePropose}
          className="mt-4 h-11 rounded-lg w-full font-semibold text-base bg-[#040037] text-white hover:opacity-95 active:scale-[0.99] transition"
        >
          Proposer un échange
        </button>
      </div>
    </div>
  );
}

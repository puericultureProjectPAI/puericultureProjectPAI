import { useParams } from "react-router-dom";
import { usePriceComparison } from "../hooks/usePriceComparison";
import PriceComparisonResult from "../components/PriceComparisonResult";

const PriceComparisonView = () => {
  const { ean } = useParams();
  const { data, loading, error } = usePriceComparison(ean);

  // Déterminer le status pour le composant enfant
  let currentStatus = "SUCCESS";
  if (loading) currentStatus = "LOADING";
  if (error) currentStatus = "ERROR";

  return (
    <PriceComparisonResult
      status={currentStatus}
      product={data?.product}
      comparison={data?.comparison}
    />
  );
};

export default PriceComparisonView;

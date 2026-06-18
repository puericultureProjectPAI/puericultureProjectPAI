import { useParams, useNavigate } from "react-router";
import ReportFormModal from "../components/ReportFormModal";

const ReportPage = () => {
  const { exchangeId } = useParams();
  const navigate = useNavigate();

  const handleClose = () => navigate(-1);
  const handleSuccess = () => navigate("/troc");

  return (
    <ReportFormModal
      exchangeId={Number(exchangeId)}
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  );
};

export default ReportPage;

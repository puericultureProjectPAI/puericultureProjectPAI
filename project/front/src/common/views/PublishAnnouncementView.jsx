import PublishAnnouncementForm from "../components/form/productCreation/PublishAnnouncementForm.jsx";
import useTroc from "../../troc/hooks/useTroc.js";
import useSecondHand from "../../second-hand/hooks/useSecondHand.js";

export default function PublishAnnouncementView() {
  const { error: trocError, publishTroc, success: trocSuccess } = useTroc();
  const {
    error: secondHandError,
    publishSecondHand,
    success: secondHandSuccess,
  } = useSecondHand();

  const handleSubmit = (mode, payload) => {
    if (mode === "SECOND_HAND") {
      return publishSecondHand(payload);
    }
    return publishTroc(payload);
  };

  return (
    <PublishAnnouncementForm
      error={trocError || secondHandError}
      onSubmit={handleSubmit}
      success={trocSuccess || secondHandSuccess}
    />
  );
}

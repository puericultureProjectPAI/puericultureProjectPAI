import PublishAnnouncementForm from "../components/form/productCreation/PublishAnnouncementForm.jsx";
import useTroc from "../../troc/hooks/useTroc.js";

export default function PublishAnnouncementView() {
  const { error, publishTroc, success } = useTroc();

  return (
    <PublishAnnouncementForm
      error={error}
      onSubmit={(_mode, payload) => publishTroc(payload)}
      success={success}
    />
  );
}

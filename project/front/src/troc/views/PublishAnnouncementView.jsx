import PublishAnnouncementForm from "../../common/components/form/productCreation/PublishAnnouncementForm.jsx";
import useTroc from "../hooks/useTroc";

export default function PublishAnnouncementView() {
  const { error, publishTroc, success } = useTroc();

  return (
    <main className="min-h-screen bg-[#f6f6fb] px-4 py-6">
      <PublishAnnouncementForm
        error={error}
        onSubmit={publishTroc}
        success={success}
      />
    </main>
  );
}

const colorMap = {
  alert: "bg-feedback-background-alert",
  warning: "bg-feedback-background-warning",
  success: "bg-feedback-background-success",
};

const borderMap = {
  alert: "outline-feedback-background-alert-bold",
  warning: "outline-feedback-background-warning-bold",
  success: "outline-feedback-background-success-bold",
};

export default function TrustCard({ score }) {
  const type = getPropertyByScore(score);

  return (
    <div
      className={`
        m-2 p-3 self-stretch rounded-lg outline outline-1
        inline-flex flex-col gap-0.5 overflow-hidden
        ${colorMap[type]}
        ${borderMap[type]}
      `}
    >
      <div className="px-0.5 py-2">
        <div className="text-xl font-semibold text-feedback-text-brand font-figtree">
          Score de confiance
        </div>
      </div>

      <div className="px-12">
        <div className="text-3xl text-feedback-text-brand font-figtree">
          ★ {score} / 5
        </div>
      </div>
    </div>
  );
}

function getPropertyByScore(score) {
  if (score < 2) return "alert";
  if (score < 4) return "warning";
  return "success";
}

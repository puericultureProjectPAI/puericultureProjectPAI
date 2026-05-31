export default function ParticipantCard({ participant }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 12,
        width: 260,
        background: "#fafafa",
      }}
    >
      <h3>Step {participant.stepOrder}</h3>
      <p>
        <strong>Participant :</strong> {participant.participantName}
      </p>
      <p>
        <strong>Offers :</strong> {participant.offeredProductTitle}
      </p>
      <p>
        <strong>Wants :</strong> {participant.wantedProductTitle}
      </p>
      <p>
        <strong>Status :</strong> {participant.status}
      </p>
      {participant.acceptedAt && (
        <p>
          <strong>Accepted at :</strong> {participant.acceptedAt}
        </p>
      )}
    </div>
  );
}

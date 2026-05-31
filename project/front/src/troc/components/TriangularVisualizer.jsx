import ParticipantCard from "./ParticipantCard";

export default function TriangleVisualizer({ exchange }) {
  return (
    <div style={{ marginTop: 30 }}>
      <h2>Triangular Exchange #{exchange.id}</h2>
      <h3>Status : {exchange.status}</h3>
      <p>
        <strong>Created at :</strong> {exchange.createdAt}
      </p>

      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginTop: 20,
        }}
      >
        {exchange.participants.map((participant) => (
          <ParticipantCard key={participant.id} participant={participant} />
        ))}
      </div>
    </div>
  );
}

export default function ExchangeActions({ onAccept, onRefuse, onConfirm }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginTop: 20,
      }}
    >
      <button onClick={onAccept}>Accept</button>

      <button onClick={onRefuse}>Refuse</button>

      <button onClick={onConfirm}>Confirm</button>
    </div>
  );
}

import { useState } from "react";
import {
  createTriangularExchange,
  autoCreateTriangularExchange,
  acceptExchange,
  refuseExchange,
  confirmExchange,
} from "../services/triangularExchangeApi";

import TriangleVisualizer from "../components/TriangularVisualizer";
// Import temporaire ou vide si tu n'as pas encore créé ExchangeActions
const ExchangeActions = ({ onAccept, onRefuse, onConfirm }) => (
  <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
    <button
      onClick={onAccept}
      style={{
        background: "#22c55e",
        color: "white",
        padding: "8px 16px",
        borderRadius: 6,
      }}
    >
      Accept
    </button>
    <button
      onClick={onRefuse}
      style={{
        background: "#ef4444",
        color: "white",
        padding: "8px 16px",
        borderRadius: 6,
      }}
    >
      Refuse
    </button>
    <button
      onClick={onConfirm}
      style={{
        background: "#3b82f6",
        color: "white",
        padding: "8px 16px",
        borderRadius: 6,
      }}
    >
      Confirm
    </button>
  </div>
);

export default function TriangularExchangePage() {
  const [exchange, setExchange] = useState(null);

  const handleCreate = async () => {
    try {
      const payload = {
        participants: [
          {
            participantId: "UUID_USER_A",
            offeredProductId: 1,
            wantedProductId: 2,
            stepOrder: 1,
          },
          {
            participantId: "UUID_USER_B",
            offeredProductId: 2,
            wantedProductId: 3,
            stepOrder: 2,
          },
          {
            participantId: "UUID_USER_C",
            offeredProductId: 3,
            wantedProductId: 1,
            stepOrder: 3,
          },
        ],
      };
      const data = await createTriangularExchange(payload);
      setExchange(data);
    } catch (error) {
      console.error(error);
      alert("Error while creating exchange");
    }
  };

  const handleAutoCreate = async () => {
    try {
      const data = await autoCreateTriangularExchange(2);
      setExchange(data);
    } catch (error) {
      console.error(error);
      alert("No triangular exchange found");
    }
  };

  const handleAccept = async () => {
    try {
      await acceptExchange(exchange.id);
      alert("Exchange accepted");
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefuse = async () => {
    try {
      await refuseExchange(exchange.id);
      alert("Exchange refused");
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmExchange(exchange.id);
      alert("Exchange confirmed");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-xl font-bold mb-4">Triangular Exchange Prototype</h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        I
        <button
          onClick={handleCreate}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Create Manual Triangle
        </button>
        <button
          onClick={handleAutoCreate}
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          Auto Create Triangle
        </button>
      </div>

      {exchange && (
        <>
          <TriangleVisualizer exchange={exchange} />
          <ExchangeActions
            onAccept={handleAccept}
            onRefuse={handleRefuse}
            onConfirm={handleConfirm}
          />
        </>
      )}
    </div>
  );
}

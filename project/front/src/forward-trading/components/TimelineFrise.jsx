import { useState } from "react";
import { QUARTERLY_DATA } from "../utils/recommendations";
import TimelineNavigator from "./TimelineNavigator";
import TimelinePeriod from "./TimelinePeriod";

export default function TimelineFrise() {
  const [activePeriodId, setActivePeriodId] = useState(QUARTERLY_DATA[0].id);
  const activePeriod = QUARTERLY_DATA.find((p) => p.id === activePeriodId);

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-10">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-b-3xl shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-800">Ma Timeline</h2>
        <p className="text-sm text-gray-500">
          Anticipez les besoins de votre enfant
        </p>
      </div>

      {/* FRISE */}
      <TimelineNavigator
        periods={QUARTERLY_DATA}
        activePeriodId={activePeriodId}
        onSelectPeriod={setActivePeriodId}
      />

      {/* CONTENU */}
      <TimelinePeriod period={activePeriod} />
    </div>
  );
}

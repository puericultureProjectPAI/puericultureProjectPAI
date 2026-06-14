import { useState } from "react";
import { useTimelineData } from "../hooks/useTimelineData";
import TimelineNavigator from "./TimelineNavigator";
import TimelinePeriod from "./TimelinePeriod";
import Dropdown from "./dropdown/Dropdown";
export default function TimelineFrise({ timelineId }) {
  const { periods, isLoading, error } = useTimelineData(timelineId);
  const [activePeriodId, setActivePeriodId] = useState(null);

  const activePeriod =
    periods?.find((p) => p.id === activePeriodId) ?? periods?.[0] ?? null;

  const handleSelectPeriod = (periodId) => {
    setActivePeriodId(periodId);
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-10 flex items-center justify-center">
        <p className="text-gray-500">Chargement de la timeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-10 flex items-center justify-center">
        <p className="text-red-500">Erreur: {error.message}</p>
      </div>
    );
  }

  return (
    <div
      className="max-w-md mx-auto bg-gray-50 min-h-screen pb-10"
      style={{ overflowX: "clip" }}
    >
      {/* HEADER */}
      <div className="bg-white shadow-sm mb-8">
        <div className="p-6 rounded-b-3xl">
          <h2 className="text-xl font-bold text-gray-800">Ma Timeline</h2>
          <p className="text-sm text-gray-500">
            Anticipez les besoins de votre enfant
          </p>
        </div>
      </div>
      {/* FRISE */}
      <TimelineNavigator
        periods={periods}
        activePeriodId={activePeriodId}
        onSelectPeriod={handleSelectPeriod}
      />
      <Dropdown
        title="Articles de seconde main"
        articles={[
          { name: "Body manches longues x5", price: "14,99€", age: "3 mois" },
          { name: "Body manches longues x5", price: "14,99€", age: "3 mois" },
        ]}
        defaultOpen={true}
      />{" "}
      <Dropdown title="Articles en location" defaultOpen={true} />
      <Dropdown title="Articles KIABI" defaultOpen={true} />
      {/* CONTENU */}
      {activePeriod && <TimelinePeriod period={activePeriod} />}
    </div>
  );
}

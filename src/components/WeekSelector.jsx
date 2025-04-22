import { useState } from "react";

const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

export default function WeekSelector({ selectedWeek, setSelectedWeek }) {
  return (
    <div className="flex gap-2 my-4">
      {weeks.map((week) => (
        <button
          key={week}
          className={`px-4 py-2 rounded ${
            selectedWeek === week ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedWeek(week)}
        >
          {week}
        </button>
      ))}
    </div>
  );
}

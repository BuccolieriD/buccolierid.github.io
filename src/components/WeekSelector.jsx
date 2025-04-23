import { useState } from "react";
const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

export default function WeekSelector({ selectedWeek, setSelectedWeek }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 my-6">
      {weeks.map((week) => (
        <button
          key={week}
          className={`px-5 py-2 rounded-xl text-sm font-semibold shadow-md transition-all ${
            selectedWeek === week
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-purple-500 hover:text-white"
          }`}
          onClick={() => setSelectedWeek(week)}
        >
          {week}
        </button>
      ))}
    </div>
  );
}
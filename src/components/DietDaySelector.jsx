// components/DietDaySelector.js
import React from "react";

const DietDaySelector = ({ selectedDay, onSelectDay }) => {
  const daysOfWeek = [
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
    "Domenica",
  ];

  return (
    <div className="flex gap-4 justify-center mb-4">
      {daysOfWeek.map((day) => (
        <button
          key={day}
          onClick={() => onSelectDay(day)}
          className={`px-6 py-2 rounded-xl font-semibold transition text-sm ${
            selectedDay === day ? "bg-green-600" : "bg-gray-700"
          } hover:bg-green-500 focus:outline-none`}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default DietDaySelector;

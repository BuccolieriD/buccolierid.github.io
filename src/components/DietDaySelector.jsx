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
    <div className="flex flex-wrap justify-center gap-4 mb-4">
      {daysOfWeek.map((day) => (
        <button
          key={day}
          onClick={() => onSelectDay(day)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
            ${
              selectedDay === day
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-green-500 focus:outline-none"
            }
            md:px-6 md:py-3`} // Aggiungi padding maggiore per schermi più grandi
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default DietDaySelector;

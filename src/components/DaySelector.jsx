const days = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica",
];

const DaySelector = ({ selectedDay, onSelectDay, activeDays }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {days.map((day) => {
        const isActive = activeDays.includes(day);
        return (
          <button
            key={day}
            onClick={() => isActive && onSelectDay(day)}
            disabled={!isActive}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${
                selectedDay === day
                  ? "bg-blue-600 text-white"
                  : isActive
                  ? "bg-gray-800 text-gray-300 hover:bg-blue-500 hover:text-white"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
              }`}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
};

export default DaySelector;

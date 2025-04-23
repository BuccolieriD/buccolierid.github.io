const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DaySelector = ({ selectedDay, onSelectDay }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => onSelectDay(day)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedDay === day
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-blue-500 hover:text-white"
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default DaySelector;
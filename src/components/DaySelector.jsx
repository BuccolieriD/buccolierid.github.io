// src/components/DaySelector.jsx
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DaySelector = ({ selectedDay, onSelectDay }) => {
  return (
    <div className="flex gap-2 flex-wrap justify-center mb-4">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => onSelectDay(day)}
          className={`px-3 py-1 rounded ${
            selectedDay === day ? "bg-blue-600" : "bg-gray-700"
          } text-white hover:bg-blue-500 transition`}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default DaySelector;

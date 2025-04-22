import { useState } from "react";
import DaySelector from "../components/DaySelector";
import AddExerciseModal from "../components/AddExerciseModal";
import ExerciseTable from "../components/ExerciseTable";
import { supabase } from "../supabaseClient";

const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

const WorkoutPage = () => {
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleExerciseAdded = () => {
    setRefresh((r) => !r);
    setShowModal(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";  // O reindirizza come preferisci
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">📓 Scheda Palestra</h1>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
      >
        Logout
      </button>

      {/* Week Selector */}
      <div className="flex gap-2 flex-wrap justify-center mb-4">
        {weeks.map((week) => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              selectedWeek === week ? "bg-purple-600" : "bg-gray-700"
            } hover:bg-purple-500`}
          >
            {week}
          </button>
        ))}
      </div>

      {/* Day Selector */}
      <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />

      {/* Add Exercise Button */}
      <button
  onClick={() => setShowModal(true)}
  className="mb-4 mt-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-xl shadow-lg transition"
>
  ➕ Aggiungi Esercizio
</button>


      {/* Exercise Table */}
      <ExerciseTable  selectedWeek={selectedWeek} selectedDay={selectedDay} refresh={refresh} />

      {/* Add Exercise Modal */}
      <AddExerciseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onExerciseAdded={handleExerciseAdded}
        defaultDay={selectedDay}
        defaultWeek={selectedWeek}
      />
    </div>
  );
};

export default WorkoutPage;

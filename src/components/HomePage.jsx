import { useState, useEffect } from "react";
import DaySelector from "../components/DaySelector";
import AddExerciseModal from "../components/AddExerciseModal";
import ExerciseTable from "../components/ExerciseTable";
import { supabase } from "../supabaseClient";
import { UserCircle, LogOut } from "lucide-react";

const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

const WorkoutPage = () => {
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleExerciseAdded = () => {
    setRefresh((r) => !r);
    setShowModal(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <div className="flex items-center justify-between p-4 bg-gray-900 shadow-lg">
        <div className="text-lg font-bold text-blue-500">🏋️ GymTracker</div>

        <h1 className="text-xl font-semibold text-center flex-1">Scheda Palestra</h1>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl"
          >
            <UserCircle size={20} />
            {user?.email.split("@")[0] || "Utente"}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50">
              <div className="px-4 py-2 border-b border-gray-700">{user?.email}</div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-400 hover:bg-red-800 rounded-b-xl"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 flex flex-col items-center">
        {/* Week Selector */}
        <div className="flex gap-2 flex-wrap justify-center mb-4">
          {weeks.map((week) => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`px-4 py-2 rounded-xl font-semibold transition text-sm ${
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
          className="mb-4 mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-xl shadow-lg transition text-white"
        >
          ➕ Aggiungi Esercizio
        </button>

        {/* Exercise Table */}
        <ExerciseTable
          selectedWeek={selectedWeek}
          selectedDay={selectedDay}
          refresh={refresh}
        />
      </div>

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

import { useState, useEffect } from "react";
import DaySelector from "../components/DaySelector";
import AddExerciseModal from "../components/AddExerciseModal";
import ExerciseTable from "../components/ExerciseTable";
import { supabase } from "../supabaseClient";
import { UserCircle, LogOut } from "lucide-react";
import logo from "../assets/Screenshot 2025-04-23 110556.png"
const weeks = ["Settimana 1", "Settimana 2", "Settimana 3", "Settimana 4"];

const WorkoutPage = () => {
  const [selectedWeek, setSelectedWeek] = useState("Settimana 1");
  const [selectedDay, setSelectedDay] = useState("Lunedì");
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
    <div className="min-h-screen  text-white">
      {/* Navbar */}
      <div className="bg-gray-900 shadow-lg w-full">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      
      {/* Brand */}
      <div className="flex-shrink-0 flex items-center gap-2">
{/*         <span className="text-2xl">🏋️</span>
        <span className="text-blue-500 text-xl font-bold">GymTracker</span> */}
<img src={logo} alt="Logo" className="h-8 sm:h-10 md:h-12 object-contain" />
</div>

      {/* Titolo centrale - nascosto su mobile */}
      <div className="flex flex-1 justify-center">
  <h1 className="text-white text-lg font-semibold text-center sm:text-xl">Workout Base</h1>
</div>

      {/* Profilo utente */}
      <div className="relative">
      <button
  onClick={() => setDropdownOpen(!dropdownOpen)}
  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white shadow-md"
>
  <UserCircle size={24} />
</button>


        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-gray-800 text-white border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-700 truncate">
              {user?.email}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-red-800 text-red-400 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>

    </div>
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

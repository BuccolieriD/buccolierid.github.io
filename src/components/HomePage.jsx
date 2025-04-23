import { useState, useEffect, useRef } from "react";
import DaySelector from "../components/DaySelector";
import AddExerciseModal from "../components/AddExerciseModal";
import ExerciseTable from "../components/ExerciseTable";
import DietTable from "../components/DietTable";
import DietDaySelector from "../components/DietDaySelector";
import { supabase } from "../supabaseClient";
import { UserCircle, LogOut } from "lucide-react";
import logo from "../assets/Screenshot 2025-04-23 110556.png";

const weeks = ["Settimana 1", "Settimana 2", "Settimana 3", "Settimana 4"];

const WorkoutPage = () => {
  const [selectedWeek, setSelectedWeek] = useState("Settimana 1");
  const [selectedDay, setSelectedDay] = useState("Lunedì");
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mode, setMode] = useState("workout");
  const [activeDays, setActiveDays] = useState([]);

  // Riferimento per il dropdown
  const dropdownRef = useRef(null);

  // Effetto per chiudere la dropdown se si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Effetto per recuperare i giorni attivi per l'allenamento
  useEffect(() => {
    const fetchActiveDays = async () => {
      if (mode === "workout" && user) {
        const { data, error } = await supabase
          .from("exercises")
          .select("day")
          .eq("user_id", user.id)
          .contains("week", [selectedWeek]);

        if (!error) {
          const daysSet = new Set(data.map((ex) => ex.day));
          setActiveDays([...daysSet]);
        } else {
          console.error("Errore nel recupero dei giorni attivi", error);
        }
      }
    };

    fetchActiveDays();
  }, [selectedWeek, refresh, user, mode]);

  // Effetto per ottenere l'utente
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // Funzione per gestire l'aggiunta di un esercizio
  const handleExerciseAdded = () => {
    setRefresh((r) => !r);
    setShowModal(false);
  };

  // Funzione per il logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen text-white">
      {/* Navbar */}
      <div className="bg-gray-900 shadow-lg w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <img
                src={logo}
                alt="Logo"
                className="h-8 sm:h-10 md:h-12 object-contain"
              />
            </div>

            {/* Titolo centrale - nascosto su mobile */}
            <div className="flex flex-1 justify-center">
              <h1 className="text-white text-lg font-semibold text-center sm:text-xl">
                Workout Base
              </h1>
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
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-52 bg-gray-800 text-white border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-700 truncate">
                    {user?.email}
                  </div>
                  {/* Aggiungi il pulsante per cambiare modalità */}
                  <button
                    onClick={() =>
                      setMode(mode === "workout" ? "diet" : "workout")
                    }
                    className="w-full px-4 py-3 text-left hover:bg-blue-800 text-blue-400 transition"
                  >
                    {mode === "workout"
                      ? "Passa alla Dieta"
                      : "Passa all'Allenamento"}
                  </button>
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
        {/* Week Selector (visibile solo se modalità workout) */}
        {mode === "workout" && (
          <div className="flex gap-2 flex-wrap justify-center mb-4">
            {weeks.map((week) => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`px-6 py-2 rounded-xl font-semibold transition text-sm ${
                  selectedWeek === week ? "bg-purple-600" : "bg-gray-700"
                } hover:bg-purple-500 focus:outline-none`}
              >
                {week}
              </button>
            ))}
          </div>
        )}

        {/* Day Selector */}
        {mode === "workout" ? (
          <DaySelector
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            activeDays={activeDays} // Passiamo i giorni attivi per l'allenamento
          />
        ) : (
          <DietDaySelector
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        )}

        {/* Aggiungi esercizio se sei in modalità Allenamento */}
        {mode === "workout" && (
          <button
            onClick={() => setShowModal(true)}
            className="mb-4 mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-xl shadow-lg transition text-white"
          >
            ➕ Aggiungi Esercizio
          </button>
        )}

        {/* Mostra la tabella in base alla modalità */}
        {mode === "workout" ? (
          <ExerciseTable
            selectedWeek={selectedWeek}
            selectedDay={selectedDay}
            refresh={refresh}
            onExerciseDeleted={() => setRefresh((r) => !r)} // <-- ECCOLA
          />
        ) : (
          <DietTable selectedWeek={selectedWeek} selectedDay={selectedDay} />
        )}
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

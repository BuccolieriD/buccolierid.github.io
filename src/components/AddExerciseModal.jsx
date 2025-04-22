import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const muscleGroups = ["", "Petto", "Schiena", "Spalle", "Bicipiti", "Tricipiti", "Gambe", "Addominali", "Glutei", "Cardio"];

const AddExerciseModal = ({ isOpen, onClose, onExerciseAdded, defaultDay, defaultWeek }) => {
  const [form, setForm] = useState({
    week: [],
    day: defaultDay,
    name: "",
    sets: "",
    notes: "",
    muscle_group: ""
  });

  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

  useEffect(() => {
    if (isOpen) {
      setForm({
        week: [defaultWeek],
        day: defaultDay,
        name: "",
        sets: "",
        notes: "",
        muscle_group: ""
      });
    }
  }, [isOpen, defaultDay, defaultWeek]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "week") {
      setForm((prev) => {
        let newWeeks = [...prev.week];
        if (checked) {
          newWeeks.push(value);
        } else {
          newWeeks = newWeeks.filter((week) => week !== value);
        }
        return { ...prev, week: newWeeks };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const user = supabase.auth.getUser(); // async

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;
  
    const { data, error } = await supabase
      .from("exercises")
      .insert([{ ...form, user_id }]);
  
    if (error) {
      alert("Errore nel salvataggio");
      console.error(error);
    } else {
      alert("Esercizio aggiunto!");
      onExerciseAdded?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md text-white shadow-xl">
        <h2 className="text-xl font-bold mb-4">➕ Aggiungi Esercizio</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Settimana</label>
            <div className="flex gap-2 flex-wrap mt-1">
              {weeks.map((week) => (
                <label key={week} className="inline-flex items-center text-sm">
                  <input
                    type="checkbox"
                    name="week"
                    value={week}
                    checked={form.week.includes(week)}
                    onChange={handleChange}
                    className="form-checkbox bg-gray-800 p-2"
                  />
                  <span className="ml-2">{week}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm">Giorno</label>
            <select
              name="day"
              value={form.day}
              onChange={handleChange}
              className="w-full bg-gray-800 p-2 rounded mt-1"
            >
              {days.map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm">Nome Esercizio</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm">Serie (es: 4x10)</label>
            <input
              name="sets"
              value={form.sets}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm">Note</label>
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full bg-gray-800 p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm">Gruppo Muscolare</label>
            <select
              name="muscle_group"
              value={form.muscle_group}
              onChange={handleChange}
              className="w-full bg-gray-800 p-2 rounded mt-1"
            >
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group || "Seleziona gruppo"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExerciseModal;

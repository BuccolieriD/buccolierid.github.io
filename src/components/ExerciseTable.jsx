import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import toast, { Toaster } from "react-hot-toast";

const muscleGroups = ["Tutti", "Petto", "Schiena", "Spalle", "Bicipiti", "Tricipiti", "Gambe", "Addominali", "Glutei", "Cardio"];

const ExerciseTable = ({ selectedDay, refresh, selectedWeek }) => {
  const [exercises, setExercises] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("Tutti");
  const [multiDeleteMode, setMultiDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchExercises = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;

    let query = supabase
      .from("exercises")
      .select("*")
      .eq("user_id", user_id)
      .contains("week", [selectedWeek])
      .eq("day", selectedDay)
      .order("muscle_group", { ascending: true })
      .order("created_at", { ascending: false });

    if (selectedGroup !== "Tutti") {
      query = query.eq("muscle_group", selectedGroup);
    }

    const { data, error } = await query;

    if (!error) {
      setExercises(data);
    } else {
      toast.error("Errore nel fetch degli esercizi.");
      console.error("Errore nel fetch:", error.message);
    }
  };

  const updateExercise = async (id, field, value) => {
    const { error } = await supabase
      .from("exercises")
      .update({ [field]: value })
      .eq("id", id);

    if (!error) fetchExercises();
    else {
      toast.error("Errore aggiornamento.");
      console.error("Errore aggiornamento:", error.message);
    }
  };

  const deleteExercise = async (id, currentWeeks) => {
    const updatedWeeks = currentWeeks.filter((w) => w !== selectedWeek);

    if (updatedWeeks.length === 0) {
      const { error } = await supabase.from("exercises").delete().eq("id", id);
      if (!error) {
        toast.success("Esercizio eliminato.");
        fetchExercises();
      } else {
        toast.error("Errore eliminazione.");
        console.error("Errore eliminazione:", error.message);
      }
    } else {
      const { error } = await supabase
        .from("exercises")
        .update({ week: updatedWeeks })
        .eq("id", id);
      if (!error) {
        toast.success("Settimana rimossa dall'esercizio.");
        fetchExercises();
      } else {
        toast.error("Errore aggiornamento settimane.");
        console.error("Errore aggiornamento settimane:", error.message);
      }
    }
  };

  const deleteSelectedExercises = async () => {
    const promises = selectedIds.map(async (id) => {
      const exercise = exercises.find((e) => e.id === id);
      const updatedWeeks = exercise.week.filter((w) => w !== selectedWeek);

      if (updatedWeeks.length === 0) {
        return supabase.from("exercises").delete().eq("id", id);
      } else {
        return supabase
          .from("exercises")
          .update({ week: updatedWeeks })
          .eq("id", id);
      }
    });

    const results = await Promise.all(promises);
    const errors = results.filter((r) => r.error);

    if (errors.length > 0) {
      toast.error("Errore durante l'eliminazione di uno o più esercizi.");
    } else {
      toast.success("Esercizi selezionati eliminati con successo.");
    }

    setSelectedIds([]);
    setMultiDeleteMode(false);
    fetchExercises();
  };

  const toggleSelected = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (selectedDay && selectedWeek) {
      fetchExercises();
    }
  }, [selectedDay, selectedWeek, refresh, selectedGroup]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white shadow-md mt-4 overflow-x-auto">
      <h2 className="text-xl mb-4">Esercizi per {selectedDay} - {selectedWeek}</h2>

      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="mr-2 text-sm">Filtra per gruppo muscolare:</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="bg-gray-900 p-2 rounded"
          >
            {muscleGroups.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMultiDeleteMode(!multiDeleteMode)}
            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            {multiDeleteMode ? "Annulla selezione" : "Abilita eliminazione multipla"}
          </button>
          {multiDeleteMode && selectedIds.length > 0 && (
            <button
              onClick={deleteSelectedExercises}
              className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded text-sm"
            >
              Elimina selezionati ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {exercises.length === 0 ? (
        <p>Nessun esercizio inserito.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              {multiDeleteMode && <th>✔️</th>}
              <th>Nome</th>
              <th>Serie</th>
              <th>Gruppo</th>
              <th>Note</th>
              <th>W1</th>
              <th>W2</th>
              <th>W3</th>
              <th>W4</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((ex) => (
              <tr key={ex.id} className="border-t border-gray-700">
                {multiDeleteMode && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(ex.id)}
                      onChange={() => toggleSelected(ex.id)}
                    />
                  </td>
                )}
                <td>{ex.name}</td>
                <td>{ex.sets}</td>
                <td>{ex.muscle_group || ""}</td>
                <td>
                  <input
                    className="bg-gray-900 p-1 rounded"
                    value={ex.notes || ""}
                    onChange={(e) =>
                      updateExercise(ex.id, "notes", e.target.value)
                    }
                  />
                </td>
                {[1, 2, 3, 4].map((week) => (
                  <td key={week}>
                    <input
                      className="bg-gray-900 p-1 rounded w-16"
                      value={ex[`week${week}`] || ""}
                      onChange={(e) =>
                        updateExercise(
                          ex.id,
                          `week${week}`,
                          e.target.value
                        )
                      }
                    />
                  </td>
                ))}
                <td>
                  <button
                    onClick={() => deleteExercise(ex.id, ex.week)}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExerciseTable;

import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2, FiCheckSquare } from "react-icons/fi";

const muscleGroups = [
  "Tutti",
  "Petto",
  "Schiena",
  "Spalle",
  "Bicipiti",
  "Tricipiti",
  "Gambe",
  "Addominali",
  "Glutei",
  "Cardio",
];

const ExerciseTable = ({
  selectedDay,
  refresh,
  selectedWeek,
  onExerciseDeleted,
}) => {
  const [exercises, setExercises] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("Tutti");
  const [multiDeleteMode, setMultiDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteExercise, setNoteExercise] = useState(null);
  const [noteText, setNoteText] = useState("");

  const fetchExercises = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;

    let query = supabase
      .from("exercises")
      .select("*")
      .eq("user_id", user_id)
      .contains("week", [selectedWeek])
      .eq("day", selectedDay)
      .order("sort_order", { ascending: true });

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
        onExerciseDeleted?.(); // <-- AGGIUNGI QUESTO
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
    onExerciseDeleted?.();
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

  const groupedExercises = exercises.reduce((groups, ex) => {
    const group = ex.muscle_group || "Altro";
    if (!groups[group]) groups[group] = [];
    groups[group].push(ex);
    return groups;
  }, {});

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white shadow-md mt-4 w-full">
      <h2 className="text-xl mb-4 text-center sm:text-left">
        Esercizi per {selectedDay} - {selectedWeek}
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <label className="mr-2 text-sm">Filtra per gruppo muscolare:</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="bg-gray-900 p-2 rounded text-sm w-full sm:w-auto"
          >
            {muscleGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMultiDeleteMode(!multiDeleteMode)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              multiDeleteMode ? "bg-gray-600" : "bg-red-600 hover:bg-red-500"
            }`}
          >
            {multiDeleteMode ? (
              "Annulla selezione"
            ) : (
              <>
                <FiCheckSquare className="inline mr-1" /> Elimina multipla
              </>
            )}
          </button>
          {multiDeleteMode && selectedIds.length > 0 && (
            <button
              onClick={deleteSelectedExercises}
              className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded text-sm"
            >
              <FiTrash2 className="inline mr-1" /> Elimina selezionati (
              {selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {exercises.length === 0 ? (
        <p className="text-center">Nessun esercizio inserito.</p>
      ) : (
        <div className="overflow-x-auto">
          {Object.entries(groupedExercises).map(([group, groupExercises]) => (
            <div key={group} className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-blue-400">
                {group}
              </h3>
              <table className="min-w-full text-sm border border-gray-700 rounded">
                <thead className="bg-gray-700">
                  <tr>
                    {multiDeleteMode && <th className="p-2">✔️</th>}
                    <th className="p-2 text-left">Nome</th>
                    <th className="p-2 text-left">Serie</th>
                    <th className="p-2 text-left">Note</th>
                    <th className="p-2 text-center">W1 KG</th>
                    <th className="p-2 text-center">W2 KG</th>
                    <th className="p-2 text-center">W3 KG</th>
                    <th className="p-2 text-center">W4 KG</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {groupExercises.map((ex) => (
                    <tr key={ex.id} className="border-t border-gray-700">
                      {multiDeleteMode && (
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(ex.id)}
                            onChange={() => toggleSelected(ex.id)}
                          />
                        </td>
                      )}
                      <td className="p-2">{ex.name}</td>
                      <td className="p-2">{ex.sets}</td>
                      <td className="p-2">
                        <button
                          onClick={() => {
                            setNoteExercise(ex);
                            setNoteText(ex.notes || "");
                            setNoteModalOpen(true);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                          title="Modifica note"
                        >
                          <FiEdit size={18} />
                        </button>
                      </td>
                      {[1, 2, 3, 4].map((week) => (
                        <td key={week} className="p-2 text-center">
                          <input
                            className="bg-gray-900 p-1 rounded w-16 text-center"
                            value={ex[`week${week}`] || ""}
                            onChange={(e) =>
                              updateExercise(
                                ex.id,
                                `week${week}`,
                                e.target.value === ""
                                  ? null
                                  : parseFloat(e.target.value)
                              )
                            }
                          />
                        </td>
                      ))}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => deleteExercise(ex.id, ex.week)}
                          className="text-red-500 hover:text-red-400 text-sm"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {noteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] max-w-md text-white">
            <h3 className="text-lg mb-4 font-semibold">Modifica Note</h3>
            <textarea
              className="w-full h-40 p-2 bg-gray-900 rounded resize-none text-sm"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setNoteModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded text-sm"
              >
                Annulla
              </button>
              <button
                onClick={async () => {
                  await updateExercise(noteExercise.id, "notes", noteText);
                  setNoteModalOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-1 rounded text-sm"
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseTable;

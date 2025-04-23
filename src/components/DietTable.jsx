import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

const defaultMeals = {
  colazione: "",
  spuntino: "",
  pranzo: "",
  merenda: "",
  cena: "",
};

const DietTable = ({ selectedDay, selectedWeek }) => {
  const [meals, setMeals] = useState(defaultMeals);
  const [loading, setLoading] = useState(true);
  const [existingId, setExistingId] = useState(null);

  const fetchDiet = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;

    const { data, error } = await supabase
      .from("diet_plans")
      .select("*")
      .eq("user_id", user_id)
      .eq("day", selectedDay)
      .eq("week", selectedWeek)
      .single();

    if (error && error.code !== "PGRST116") {
      toast.error("Errore nel fetch della dieta");
      console.error(error.message);
    }

    if (data) {
      setMeals(data.meals);
      setExistingId(data.id);
    } else {
      setMeals(defaultMeals);
      setExistingId(null);
    }

    setLoading(false);
  };

  const saveDiet = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;

    const payload = {
      user_id,
      day: selectedDay,
      week: selectedWeek,
      meals,
    };

    let res;
    if (existingId) {
      res = await supabase
        .from("diet_plans")
        .update(payload)
        .eq("id", existingId);
    } else {
      res = await supabase.from("diet_plans").insert(payload);
    }

    if (res.error) {
      toast.error("Errore salvataggio dieta");
      console.error(res.error.message);
    } else {
      toast.success("Dieta salvata con successo!");
      fetchDiet();
    }
  };

  useEffect(() => {
    if (selectedDay && selectedWeek) {
      fetchDiet();
    }
  }, [selectedDay, selectedWeek]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white shadow-md mt-4 w-full">
      <h2 className="text-xl mb-4 text-center sm:text-left">
        Dieta per {selectedDay} - Settimana {selectedWeek}
      </h2>

      {loading ? (
        <p>Caricamento in corso...</p>
      ) : (
        <form className="space-y-4">
          {Object.keys(defaultMeals).map((mealKey) => (
            <div key={mealKey}>
              <label className="block capitalize mb-1">{mealKey}</label>
              <textarea
                value={meals[mealKey]}
                onChange={(e) =>
                  setMeals((prev) => ({ ...prev, [mealKey]: e.target.value }))
                }
                className="w-full bg-gray-900 p-2 rounded text-sm"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={saveDiet}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm"
          >
            Salva Dieta
          </button>
        </form>
      )}
    </div>
  );
};

export default DietTable;

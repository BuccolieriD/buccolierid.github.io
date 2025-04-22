import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

const UpdatePasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleRecovery = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        toast.error("Errore durante il recupero della sessione.");
        console.error(error);
      }
    };
    handleRecovery();
  }, []);

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error("Errore durante l'aggiornamento della password.");
    } else {
      toast.success("Password aggiornata!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Aggiorna la tua password</h2>
        <input
          type="password"
          className="w-full p-2 mb-4 rounded bg-gray-900"
          placeholder="Nuova password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handleUpdate}
          className="bg-blue-600 py-2 w-full rounded hover:bg-blue-700"
        >
          Aggiorna
        </button>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;

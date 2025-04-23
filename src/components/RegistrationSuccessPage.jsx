import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const RegistrationSuccessPage = () => {
  const location = useLocation();
  const [resent, setResent] = useState(false);
  const email = new URLSearchParams(location.search).get("email");
  const navigate = useNavigate();

  const handleGoBackToLogin = () => {
    navigate("/"); // Naviga alla pagina di login
  };
  const resendConfirmation = async () => {
    if (!email) {
      toast.error("Email non trovata.");
      return;
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) toast.error("Errore nell'invio dell'email.");
    else {
      toast.success("Email di conferma inviata di nuovo!");
      setResent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
      <motion.div
        className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 12 }}
          className="flex justify-center mb-4"
        >
          <CheckCircle className="text-green-400 w-16 h-16" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-3">Registrazione completata 🎉</h2>
        <p className="mb-2">
          Abbiamo inviato un'email a{" "}
          <span className="text-blue-300">{email}</span>.
          <br />
          Clicca sul link per confermare la tua identità.
        </p>
        <p className="text-sm text-gray-400 mb-5">
          (Controlla anche nella cartella spam!)
        </p>

        <button
          onClick={resendConfirmation}
          disabled={resent}
          className="text-blue-400 underline hover:text-blue-300 disabled:opacity-40"
        >
          {!resent
            ? "Non hai ricevuto la conferma? Invia di nuovo"
            : "Email reinviata!"}
        </button>
        <button
          onClick={handleGoBackToLogin}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Torna alla login
        </button>
      </motion.div>
    </div>
  );
};

export default RegistrationSuccessPage;

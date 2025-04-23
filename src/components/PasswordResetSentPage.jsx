import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MailCheck } from "lucide-react";

const PasswordResetSentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = new URLSearchParams(location.search).get("email");

  const handleGoBackToLogin = () => {
    navigate("/");  // Naviga alla pagina di login
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
          <MailCheck className="text-blue-400 w-16 h-16" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-3">Controlla la tua email 📩</h2>
        <p className="mb-2">
          Abbiamo inviato un'email a <span className="text-blue-300">{email}</span> per reimpostare la password.
        </p>
        <p className="text-sm text-gray-400">
          Segui il link all'interno dell'email per impostare una nuova password.
        </p>

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

export default PasswordResetSentPage;

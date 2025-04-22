import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (!email || !password) return toast.error("Inserisci email e password");

    const response = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (response.error) {
      toast.error(response.error.message);
    } else {
      if (isLogin) {
        navigate("/"); // Redirect dopo login
      } else {
        navigate(`/registration-success?email=${encodeURIComponent(email)}`);
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!email) return toast.error("Inserisci l'email per il reset.");
  
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/update-password",
    });
  
    if (error) toast.error("Errore durante l'invio.");
    else
      toast.success("Email inviata per il reset!", {
        duration: 5000,
        position: "top-center",
      });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl mb-4">
          {isLogin ? "Accedi alla tua scheda" : "Registrati"}
        </h2>

        <input
          disabled={disabled}
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded bg-gray-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          disabled={disabled}
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded bg-gray-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          disabled={disabled}
          className="bg-blue-600 w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLogin ? "Accedi" : "Registrati"}
        </button>

        <div className="text-sm text-blue-300 mt-4 space-y-2">
          <button onClick={() => setIsLogin(!isLogin)} className="underline">
            {isLogin
              ? "Non hai un account? Registrati"
              : "Hai già un account? Accedi"}
          </button>

          {isLogin && (
            <button onClick={handlePasswordReset} className="block underline">
              Hai dimenticato la password?
            </button>
          )}

          {!isLogin && (
            <button
              onClick={() => setIsLogin(true)}
              className="block text-blue-400 underline mt-2"
            >
              Non hai ricevuto l'email? Invia di nuovo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

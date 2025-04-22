import { useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleAuth = async () => {
    setError("");
    if (!email || !password) return setError("Inserisci email e password");

    let response;
    if (isLogin) {
      response = await supabase.auth.signInWithPassword({ email, password });
    } else {
      response = await supabase.auth.signUp({ email, password });
    }

    if (response.error) {
      setError(response.error.message);
    } else {
      if (!isLogin) {
        toast.success("Registrazione completata! Controlla la mail per confermare.", {
          duration: 7000,
          position: "top-center",
        });
        setRegistrationComplete(true);
      } else {
        window.location.href = "/";
      }
    }
  };

  const handleGoToLogin = () => {
    setIsLogin(true);
    setRegistrationComplete(false);
    setEmail("");
    setPassword("");
  };

  const resendConfirmationEmail = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) {
      toast.error("Errore nell'invio della mail. Riprova.");
    } else {
      toast.success("Mail di conferma inviata di nuovo!", {
        duration: 5000,
        position: "top-center",
      });
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl mb-4">
          {isLogin ? "Accedi alla tua scheda" : "Registrati"}
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded bg-gray-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={registrationComplete}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded bg-gray-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={registrationComplete}
        />

        {!registrationComplete ? (
          <button
            onClick={handleAuth}
            className="bg-blue-600 w-full py-2 rounded hover:bg-blue-700"
          >
            {isLogin ? "Accedi" : "Registrati"}
          </button>
        ) : (
          <>
            <button
              onClick={handleGoToLogin}
              className="bg-green-600 w-full py-2 rounded hover:bg-green-700"
            >
              Vai al login
            </button>
            <p
              onClick={resendConfirmationEmail}
              className="text-sm text-blue-300 mt-4 underline cursor-pointer text-center"
            >
              Non hai ricevuto la mail di conferma? Invia di nuovo
            </p>
          </>
        )}

        {!registrationComplete && (
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-300 mt-4 underline"
          >
            {isLogin
              ? "Non hai un account? Registrati"
              : "Hai già un account? Accedi"}
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

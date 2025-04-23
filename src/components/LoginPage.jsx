import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock } from "lucide-react";
import sfondo from "../assets/Garage-Gym-6x6_full_mod_logo.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate("/");
    };
    checkSession();
  }, [navigate]);

  const handleAuth = async () => {
    if (!email || !password) return toast.error("Inserisci email e password");

    setDisabled(true);

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    const response = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setDisabled(false);

    if (response.error) {
      toast.error(response.error.message);
    } else {
      if (isLogin) {
        navigate("/");
      } else {
        navigate(`/registration-success?email=${encodeURIComponent(email)}`);
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!email) return toast.error("Inserisci l'email per il reset.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://buccolierid.github.io/update-password",
    });

    if (error) toast.error("Errore durante l'invio.");
    else {
      navigate(`/password-reset-sent?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <img
        src={sfondo}
        alt="Gym background"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md bg-zinc-800 bg-opacity-70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl space-y-6 mx-4">
        <h2 className="text-3xl font-bold text-white text-center">
          {isLogin ? "Accedi alla tua scheda" : "Registrati"}
        </h2>

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            <input
              disabled={disabled}
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            <input
              disabled={disabled}
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAuth();
              }}
            />
          </div>

          <div className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label htmlFor="rememberMe">Ricorda il mio accesso</label>
          </div>

          <button
            onClick={handleAuth}
            disabled={disabled}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {isLogin ? "Accedi" : "Registrati"}
          </button>
        </div>

        <div className="text-sm text-center text-zinc-400 space-y-2">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="underline hover:text-blue-400"
          >
            {isLogin
              ? "Non hai un account? Registrati"
              : "Hai già un account? Accedi"}
          </button>

          {isLogin && (
            <div>
              <button
                onClick={handlePasswordReset}
                className="underline hover:text-blue-400"
              >
                Hai dimenticato la password?
              </button>
            </div>
          )}

          {!isLogin && (
            <button
              onClick={() => setIsLogin(true)}
              className="block text-blue-300 underline hover:text-blue-400 mt-2"
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

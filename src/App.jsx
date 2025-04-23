import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import LoginPage from "./components/LoginPage";
import WorkoutPage from "./components/HomePage";
import UpdatePasswordPage from "./components/UpdatePasswordPage";
import { Toaster } from "react-hot-toast";
import RegistrationSuccessPage from "./components/RegistrationSuccessPage";
import PasswordResetSentPage from "./components/PasswordResetSentPage";
// Importa l'immagine
import backgroundImage from './assets/Garage-Gym-6x6_full_mod_logo.jpg';

const AppRoutes = ({ session }) => {
  const location = useLocation();
  const isRecovery = location.pathname === "/update-password";

  return (
    <Routes>
      <Route path="/password-reset-sent" element={<PasswordResetSentPage />} />
      <Route path="/registration-success" element={<RegistrationSuccessPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      <Route path="/" element={session && !isRecovery ? <WorkoutPage /> : <LoginPage />} />
    </Routes>
  );
};

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirect = sessionStorage.redirectTo;
    if (redirect) {
      sessionStorage.removeItem("redirectTo");
      window.history.replaceState(null, "", redirect);
    }
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <p className="text-white text-center mt-20">Caricamento...</p>;

  return (
    <Router>
      <div
        className="app-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,  // Usa l'immagine importata
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <Toaster position="top-center" />
        <AppRoutes session={session} />
      </div>
    </Router>
  );
};

export default App;

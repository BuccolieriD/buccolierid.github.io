import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import LoginPage from "./components/LoginPage";
import WorkoutPage from "./components/HomePage";
import UpdatePasswordPage from "./components/UpdatePasswordPage";
import { Toaster } from "react-hot-toast";
import RegistrationSuccessPage from "./components/RegistrationSuccessPage";

const AppRoutes = ({ session }) => {
  const location = useLocation();
  const isRecovery = location.pathname === "/update-password";

  return (
    <Routes>
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
      <Toaster position="top-center" />
      <AppRoutes session={session} />
    </Router>
  );
};

export default App;

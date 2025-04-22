import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import LoginPage from "./components/LoginPage";
import WorkoutPage from "./components/HomePage";
import { Toaster } from "react-hot-toast";

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
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {session ? <WorkoutPage /> : <LoginPage />}
    </>
  );
};

export default App;

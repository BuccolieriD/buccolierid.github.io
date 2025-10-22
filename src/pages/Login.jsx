import React, { useState } from 'react';
import supabase from '../lib/supabaseClient';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import logo from '../asset/logo.png';
import sfondo from '../asset/sfondobackground.png';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18" className="inline-block mr-2">
    <path fill="#fbc02d" d="M43.6 20.5H42V20H24v8h11.3C34.6 32.4 30 36 24 36c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.3 0 6.3 1.3 8.5 3.4l6-6C34.6 2.9 29.6 1 24 1 11.8 1 2 10.8 2 23s9.8 22 22 22 22-9.8 22-22c0-1.5-.2-2.9-.4-4.5z"/>
    <path fill="#e53935" d="M6.3 14.7l6.6 4.8C14.1 16 18.6 13 24 13c3.3 0 6.3 1.3 8.5 3.4l6-6C34.6 2.9 29.6 1 24 1 16.9 1 10.6 4.8 6.3 14.7z"/>
    <path fill="#4caf50" d="M24 47c5.9 0 11.1-2 15.3-5.4l-7.1-5.9C28.8 37.3 26.5 38 24 38c-6 0-10.6-3.6-12.3-8.7l-6.6 5.1C6 39.8 14.3 47 24 47z"/>
    <path fill="#1565c0" d="M43.6 20.5H42V20H24v8h11.3c-1 2.8-3 5.2-5.8 6.6l7.1 5.9C41.6 37.3 46 29.5 46 23c0-1.5-.2-2.9-.4-4.5z"/>
  </svg>
);

const Spinner = ({ size = 20 }) => (
  <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    if (!email) return 'Inserisci un indirizzo email.';
    // simple email regex
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    if (!re.test(email)) return 'Indirizzo email non valido.';
    if (!password) return 'Inserisci la password.';
    if (password.length < 6) return 'La password deve avere almeno 6 caratteri.';
    return null;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const validationError = validate();
    if (validationError) return setErrorMsg(validationError);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setErrorMsg(error.message || 'Errore durante il login.');
      dispatch(setUser(data.user));
      navigate('/blog');
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Errore di rete.');
    }
  };

  const handleGoogle = async () => {
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) setErrorMsg(error.message);
    } catch (err) {
      setErrorMsg(err.message || 'Errore OAuth.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: `url(${sfondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-md" />
          <div>
            <h1 className="text-2xl font-semibold">Accedi al tuo account</h1>
            <p className="text-sm text-slate-500">Bentornato! Inserisci le tue credenziali per procedere.</p>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@esempio.com"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {errorMsg && <div className="text-sm text-red-600">{errorMsg}</div>}

          <div className="flex items-center justify-between">
            <button
              disabled={loading}
              type="submit"
              className="inline-flex items-center gap-3 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow"
            >
              {loading ? <Spinner size={18} /> : null}
              <span>{loading ? 'Accesso...' : 'Accedi'}</span>
            </button>

            <button
              type="button"
              onClick={handleGoogle}
              className="inline-flex items-center px-3 py-2 border rounded-lg text-slate-700 hover:bg-slate-50"
            >
              <GoogleIcon /> Accedi con Google
            </button>
          </div>
        </form>

        <p className="text-sm text-slate-500 mt-4">Usa le credenziali admin per gestire gli articoli.</p>
      </div>
    </div>
  );
};

export default Login;

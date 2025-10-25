import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import logonero from '../asset/logonero.png';

// Background dedicato alla pagina Login (tema: accesso/chiavi/porta)
const loginBg = 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=1920&auto=format&fit=crop';

const Spinner = ({ size = 20 }) => (
  <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Carica le credenziali salvate all'avvio
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

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
      
      // Salva o rimuovi le credenziali in base alla checkbox
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }
      
      dispatch(setUser(data.user));
      navigate('/');
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Errore di rete.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <img src={logonero} alt="Logo" className="w-24 h-24 rounded-md" />
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

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 focus:ring-2"
            />
            <label className="ml-2 text-sm text-slate-700">
              Vuoi ricordare le tue credenziali?
            </label>
          </div>

          {errorMsg && <div className="text-sm text-red-600">{errorMsg}</div>}

          <button
            disabled={loading}
            type="submit"
            className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow"
          >
            {loading ? <Spinner size={18} /> : null}
            <span>{loading ? 'Accesso...' : 'Accedi'}</span>
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-4">Usa le credenziali admin per gestire gli articoli.</p>
      </div>
    </div>
  );
};

export default Login;

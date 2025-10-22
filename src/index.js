import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import App from './App';
import store from './app/store';
import './index.css';
import supabase from './lib/supabaseClient';
import { setUser } from './slices/authSlice';
import { ToastProvider } from './components/Toast';

const InitApp = ({ children }) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } })=> {
      if (session && session.user) dispatch(setUser(session.user));
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) dispatch(setUser(session.user));
      else dispatch(setUser(null));
    });
    return () => {
      try { if (listener && listener.subscription) supabase.removeChannel(listener.subscription); } catch(e){}
    };
  }, [dispatch]);
  return children;
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <InitApp>
          <ToastProvider>
            <App />
          </ToastProvider>
        </InitApp>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

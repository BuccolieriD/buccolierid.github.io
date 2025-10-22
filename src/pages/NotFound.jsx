import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <NavBar current="" />

      <main className="flex items-center justify-center px-6 py-20">
        <section className="relative max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative overflow-hidden rounded-2xl p-8 shadow-2xl">
            <div className="absolute -top-20 -left-20 w-[360px] h-[360px] bg-gradient-to-br from-indigo-600 to-violet-500 opacity-30 rounded-full blur-3xl animate-blob" />
            <div className="absolute -bottom-20 -right-20 w-[320px] h-[320px] bg-gradient-to-br from-sky-500 to-emerald-400 opacity-20 rounded-full blur-3xl animate-blob animation-delay-2000" />

            <div className="relative bg-white/6 backdrop-blur-sm border border-white/8 rounded-2xl p-8">
              <div className="flex items-start gap-6">
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-white/8 border border-white/10 shadow-lg">
                  <span className="text-4xl font-extrabold text-white">404</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Ops! Non ho trovato questa pagina</h2>
                  <p className="mt-2 text-slate-300">Potrebbe essere stata rimossa, rinominata o temporaneamente non disponibile.</p>
                  <div className="mt-4 flex gap-3">
                    <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-md shadow-lg transform transition hover:-translate-y-0.5">Torna alla Home</Link>
                    <a href="mailto:admin@example.com" className="inline-flex items-center gap-2 px-4 py-3 border border-white/10 rounded-md text-slate-200 hover:bg-white/5">Segnala il problema</a>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm text-slate-400">Puoi tornare alla homepage oppure inviare una segnalazione: controlleremo il problema al più presto.</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md p-6">
              <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <defs>
                  <linearGradient id="gradA" x1="0" x2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="600" height="400" rx="32" fill="url(#gradA)" opacity="0.08" />
                <g transform="translate(60,40)">
                  <path d="M120 0 C160 30 180 90 160 140 C140 190 80 220 40 240 L120 320 L200 240 C180 220 200 180 220 160 C240 140 260 120 260 80 C260 40 200 -10 120 0 Z" fill="#fff" opacity="0.9" />
                  <circle cx="180" cy="80" r="26" fill="#7c3aed" />
                </g>
              </svg>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NotFound;

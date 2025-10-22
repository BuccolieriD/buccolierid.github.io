import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../asset/logo.png';

export default function Footer() {
  const pages = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/blog', label: 'Blog' },
    { to: '/counter', label: 'Counter' },
    { to: '/login', label: 'Login' },
  ];

  return (
    <footer className="bg-gray-900 text-slate-200 mt-8">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
          {/* left: logo */}
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Link to="/">
              <img src={logo} alt="logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* center: social icons */}
          <div className="flex items-center gap-6 justify-center">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white"
            >
              {/* Instagram svg */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M12 7h.01M17 7h.01M7 12h.01M12 12h.01M17 12h.01M7 17h.01M12 17h.01M17 17h.01" />
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </a>

            <a
              href="mailto:info@example.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email"
              className="hover:text-white"
            >
              {/* Mail svg */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 8V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" />
              </svg>
            </a>

            <a
              href="https://www.immobiliare.it/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Immobiliare"
              className="hover:text-white"
            >
              {/* House / site svg */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 11l9-7 9 7v8a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4H9v4a2 2 0 01-2 2H3a2 2 0 01-2-2v-8z" />
              </svg>
            </a>
          </div>

          {/* right: page links */}
          <nav className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
            {pages.map((p) => (
              <Link key={p.to} to={p.to} className="text-sm text-slate-300 hover:text-white">
                {p.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} AngeloJackowski. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
}

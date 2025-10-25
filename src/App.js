import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import CounterPage from './pages/CounterPage';
import Blog from './pages/Blog';
import Article from './pages/Article';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ComeLavoriamo from './pages/ComeLavoriamo';
import DiventaSegnalatore from './pages/DiventaSegnalatore';
import ProprietaVendita from './pages/ProprietaVendita';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <NavBar /> */}
      <main className="  ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/counter" element={<CounterPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Article />} />
          <Route path="/come-lavoriamo" element={<ComeLavoriamo />} />
          <Route path="/diventa-segnalatore" element={<DiventaSegnalatore />} />
          <Route path="/proprieta-vendita" element={<ProprietaVendita />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

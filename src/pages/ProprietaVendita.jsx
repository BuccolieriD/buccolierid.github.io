import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import sfondo from '../asset/sfondobackground.png';

const ProprietaVendita = () => {
  const [filtri, setFiltri] = useState({
    tipo: '',
    prezzo: '',
    citta: '',
    camere: ''
  });

  // Dati di esempio - in futuro verranno caricati da Supabase
  const proprieta = [
    {
      id: 1,
      tipo: 'Appartamento',
      prezzo: 250000,
      citta: 'Milano',
      camere: 3,
      metri: 95,
      immagine: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
      descrizione: 'Elegante appartamento nel centro di Milano, completamente ristrutturato.',
      caratteristiche: ['Terrazzo', 'Aria condizionata', 'Parcheggio']
    },
    {
      id: 2,
      tipo: 'Villa',
      prezzo: 450000,
      citta: 'Roma',
      camere: 4,
      metri: 180,
      immagine: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500',
      descrizione: 'Villa indipendente con giardino privato in zona residenziale.',
      caratteristiche: ['Giardino', 'Garage', 'Cantina']
    },
    {
      id: 3,
      tipo: 'Appartamento',
      prezzo: 180000,
      citta: 'Torino',
      camere: 2,
      metri: 70,
      immagine: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
      descrizione: 'Appartamento moderno in zona ben servita dai mezzi pubblici.',
      caratteristiche: ['Balcone', 'Ascensore', 'Riscaldamento autonomo']
    },
    {
      id: 4,
      tipo: 'Casa',
      prezzo: 320000,
      citta: 'Firenze',
      camere: 3,
      metri: 120,
      immagine: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500',
      descrizione: 'Casa storica nel centro di Firenze con vista panoramica.',
      caratteristiche: ['Centro storico', 'Vista panoramica', 'Soffitti affrescati']
    }
  ];

  const handleFiltroChange = (e) => {
    setFiltri({
      ...filtri,
      [e.target.name]: e.target.value
    });
  };

  const proprietaFiltrate = proprieta.filter(prop => {
    return (
      (filtri.tipo === '' || prop.tipo === filtri.tipo) &&
      (filtri.citta === '' || prop.citta.toLowerCase().includes(filtri.citta.toLowerCase())) &&
      (filtri.camere === '' || prop.camere.toString() === filtri.camere) &&
      (filtri.prezzo === '' || 
        (filtri.prezzo === '0-200' && prop.prezzo <= 200000) ||
        (filtri.prezzo === '200-300' && prop.prezzo > 200000 && prop.prezzo <= 300000) ||
        (filtri.prezzo === '300-500' && prop.prezzo > 300000 && prop.prezzo <= 500000) ||
        (filtri.prezzo === '500+' && prop.prezzo > 500000)
      )
    );
  });

  return (
    <div className="min-h-screen">
      <NavBar current="Proprietà in Vendita" />
      
      <div
        className="bg-gray-900 pb-20 relative"
        style={{
          backgroundImage: `url(${sfondo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* darker veil to improve title/nav contrast */}
        <div aria-hidden className="absolute inset-0 bg-black/50 pointer-events-none" />

        <div className="max-w-7xl mx-auto py-12 px-6 flex items-center justify-center relative z-10">
          <h1 className="text-5xl pt-14 font-bold text-white text-center">Proprietà in Vendita</h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Filtri */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Filtra le Proprietà</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                name="tipo"
                value={filtri.tipo}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tutti i tipi</option>
                <option value="Appartamento">Appartamento</option>
                <option value="Villa">Villa</option>
                <option value="Casa">Casa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prezzo (€)</label>
              <select
                name="prezzo"
                value={filtri.prezzo}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tutti i prezzi</option>
                <option value="0-200">0 - 200.000</option>
                <option value="200-300">200.000 - 300.000</option>
                <option value="300-500">300.000 - 500.000</option>
                <option value="500+">500.000+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Città</label>
              <input
                type="text"
                name="citta"
                value={filtri.citta}
                onChange={handleFiltroChange}
                placeholder="Cerca per città..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Camere</label>
              <select
                name="camere"
                value={filtri.camere}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Qualsiasi</option>
                <option value="1">1 camera</option>
                <option value="2">2 camere</option>
                <option value="3">3 camere</option>
                <option value="4">4+ camere</option>
              </select>
            </div>
          </div>
        </div>

        {/* Risultati */}
        <div className="mb-6">
          <p className="text-gray-600">
            Trovate <span className="font-semibold">{proprietaFiltrate.length}</span> proprietà
          </p>
        </div>

        {/* Grid delle proprietà */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proprietaFiltrate.map((prop) => (
            <div key={prop.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={prop.immagine}
                alt={prop.descrizione}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{prop.tipo} - {prop.citta}</h3>
                  <span className="text-2xl font-bold text-blue-600">
                    €{prop.prezzo.toLocaleString()}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{prop.descrizione}</p>
                
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>{prop.camere} camere</span>
                  <span>{prop.metri} m²</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {prop.caratteristiche.map((car, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {car}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                    Maggiori Info
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    ❤️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {proprietaFiltrate.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nessuna proprietà trovata</h3>
            <p className="text-gray-500">Prova a modificare i filtri di ricerca</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-blue-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Non trovi quello che cerchi?</h2>
          <p className="text-lg mb-6">
            Il nostro team di esperti può aiutarti a trovare la proprietà perfetta per le tue esigenze
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contatta un Consulente
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProprietaVendita;
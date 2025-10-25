import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import PageHero from '../components/PageHero';
import supabase from '../lib/supabaseClient';
import { useSelector } from 'react-redux';
import PropertyForm from '../components/PropertyForm';
import { useToasts } from '../components/Toast';
// Background dedicato (tema: esterni case/skyline real estate)
const listingBg = 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1920&auto=format&fit=crop';

const ProprietaVendita = () => {
  const [filtri, setFiltri] = useState({
    tipo: '',
    prezzo: '',
    citta: '',
    camere: '',
    superficieDa: '',
    superficieA: ''
  });

  const [proprieta, setProprieta] = useState([]);
  const [tipiDisponibili, setTipiDisponibili] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);
  
  // Paginazione
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const user = useSelector((state) => state.auth.user);
  const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
  const { add } = useToasts();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch proprietà da Supabase
  const fetchProprieta = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('disponibile', true)
      .order('created_at', { ascending: false }); // Ordinamento per data aggiunta (più recenti prima)
    
    if (error) {
      console.error('Errore nel caricamento proprietà:', error);
      setProprieta([]);
      setTipiDisponibili([]);
    } else {
      setProprieta(data || []);
      // Estrai tutti i tipi unici dalle proprietà caricate
      const tipi = [...new Set((data || []).map(prop => prop.tipo))].sort();
      setTipiDisponibili(tipi);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProprieta();

    // Realtime subscription per le proprietà
    const channel = supabase
      .channel('public:properties')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'properties' },
        () => fetchProprieta()
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {}
    };
  }, []);

  // Gestione eliminazione proprietà
  const handleDelete = async (id) => {
    setConfirmDeleteModal(id);
  };

  const confirmDelete = async () => {
    const id = confirmDeleteModal;
    setConfirmDeleteModal(null);
    
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      add('Proprietà eliminata con successo', 'success');
      fetchProprieta();
    } catch (err) {
      add('Errore durante l\'eliminazione: ' + err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFiltroChange = (e) => {
    setFiltri({
      ...filtri,
      [e.target.name]: e.target.value
    });
    // Reset alla prima pagina quando cambiano i filtri
    setCurrentPage(1);
  };

  const proprietaFiltrate = proprieta.filter(prop => {
    // Filtro tipo
    const tipoMatch = filtri.tipo === '' || prop.tipo === filtri.tipo;
    
    // Filtro città
    const cittaMatch = filtri.citta === '' || prop.citta.toLowerCase().includes(filtri.citta.toLowerCase());
    
    // Filtro camere
    const camereMatch = filtri.camere === '' || prop.camere?.toString() === filtri.camere;
    
    // Filtro prezzo
    const prezzoMatch = filtri.prezzo === '' || 
      (filtri.prezzo === '0-200' && prop.prezzo <= 200000) ||
      (filtri.prezzo === '200-300' && prop.prezzo > 200000 && prop.prezzo <= 300000) ||
      (filtri.prezzo === '300-500' && prop.prezzo > 300000 && prop.prezzo <= 500000) ||
      (filtri.prezzo === '500+' && prop.prezzo > 500000);
    
    // Filtro superficie Da-A
    const superficieDaMatch = filtri.superficieDa === '' || prop.superficie >= parseInt(filtri.superficieDa);
    const superficieAMatch = filtri.superficieA === '' || prop.superficie <= parseInt(filtri.superficieA);
    
    return tipoMatch && cittaMatch && camereMatch && prezzoMatch && superficieDaMatch && superficieAMatch;
  });

  // Calcolo paginazione
  const totalPages = Math.ceil(proprietaFiltrate.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const proprietaPaginate = proprietaFiltrate.slice(startIndex, endIndex);

  // Funzioni paginazione
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Modale per visualizzazione dettagliata proprietà
  const PropertyModal = ({ property, onClose }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    
    if (!property) return null;
    
    const immagini = property.immagini && property.immagini.length > 0 ? property.immagini : [];
    
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="relative max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
            {immagini.length > 0 && (
              <div className="relative">
                <img
                  src={immagini[selectedImageIndex]}
                  alt={property.titolo}
                  className="w-full h-64 md:h-96 object-cover cursor-zoom-in transition-transform hover:scale-[1.02]"
                  onClick={() => setFullscreenImage(immagini[selectedImageIndex])}
                />
                {immagini.length > 1 && (
                  <>
                    {/* Frecce navigazione */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : immagini.length - 1);
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(selectedImageIndex < immagini.length - 1 ? selectedImageIndex + 1 : 0);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-all"
                    >
                      →
                    </button>
                    
                    {/* Thumbnails carosello sotto */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/40 px-4 py-2 rounded-full">
                      {immagini.map((img, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex(index);
                          }}
                          className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                            index === selectedImageIndex ? 'border-white scale-110' : 'border-white/50 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.titolo}</h2>
                <p className="text-lg text-gray-600">{property.tipo} - {property.citta}</p>
                {property.indirizzo && (
                  <p className="text-sm text-gray-500">{property.indirizzo}</p>
                )}
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-blue-600">
                  €{property.prezzo.toLocaleString()}
                </span>
                {property.in_evidenza && (
                  <div className="mt-2">
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      In Evidenza
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-medium">Camere</span>
                <p className="text-lg">{property.camere || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-medium">Bagni</span>
                <p className="text-lg">{property.bagni || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-medium">Superficie</span>
                <p className="text-lg">{property.superficie} m²</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-medium">Piano</span>
                <p className="text-lg">{property.piano !== null ? property.piano : 'N/A'}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Descrizione</h3>
              <p className="text-gray-600 leading-relaxed">{property.descrizione}</p>
            </div>
            
            {property.caratteristiche && property.caratteristiche.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Caratteristiche</h3>
                <div className="flex flex-wrap gap-2">
                  {property.caratteristiche.map((caratteristica, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {caratteristica}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {(property.anno_costruzione || property.stato_conservazione || property.classe_energetica) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Informazioni Aggiuntive</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {property.anno_costruzione && (
                    <div>
                      <span className="font-medium">Anno di costruzione:</span>
                      <p>{property.anno_costruzione}</p>
                    </div>
                  )}
                  {property.stato_conservazione && (
                    <div>
                      <span className="font-medium">Stato:</span>
                      <p>{property.stato_conservazione}</p>
                    </div>
                  )}
                  {property.classe_energetica && (
                    <div>
                      <span className="font-medium">Classe energetica:</span>
                      <p>{property.classe_energetica}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    const subject = `Info proprietà: ${property.titolo}`;
                    const body = `Salve,\n\nSono interessato/a alla proprietà:\n\n` +
                      `Titolo: ${property.titolo}\n` +
                      `Tipo: ${property.tipo}\n` +
                      `Città: ${property.citta}\n` +
                      `Prezzo: €${property.prezzo.toLocaleString()}\n` +
                      `Superficie: ${property.superficie} mq\n\n` +
                      `Potete contattarmi per maggiori informazioni?\n\n` +
                      `Grazie.`;
                    
                    window.location.href = `mailto:pippo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Contatta per Info
                </button>
                {property.link_esterno && (
                  <button 
                    onClick={() => window.open(property.link_esterno, '_blank')}
                    className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50 transition-colors"
                  >
                    Vedi su Idealista
                  </button>
                )}
              </div>
              <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
                Chiudi
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal fullscreen per immagine */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
          >
            ×
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
    );
  };

  return (
    <div className="min-h-screen">
      <NavBar current="Proprietà in Vendita" />
      
  <PageHero title="Proprietà in Vendita" bgImage={listingBg} />

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Filtri */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Filtra le Proprietà</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                name="tipo"
                value={filtri.tipo}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tutti i tipi</option>
                {tipiDisponibili.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Superficie Da (mq)</label>
              <input
                type="number"
                name="superficieDa"
                value={filtri.superficieDa}
                onChange={handleFiltroChange}
                min="0"
                placeholder="Min mq"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Superficie A (mq)</label>
              <input
                type="number"
                name="superficieA"
                value={filtri.superficieA}
                onChange={handleFiltroChange}
                min="0"
                placeholder="Max mq"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Caricamento proprietà...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Trovate <span className="font-semibold">{proprietaFiltrate.length}</span> proprietà
                {totalPages > 1 && (
                  <span className="text-sm ml-2">
                    (Pagina {currentPage} di {totalPages})
                  </span>
                )}
              </p>
              
              {user && user.email === adminEmail && (
                <button
                  onClick={() => setEditingProperty({})}
                  className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors"
                >
                  + Aggiungi Proprietà
                </button>
              )}
            </div>

            {/* Grid delle proprietà */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {proprietaPaginate.map((prop, index) => (
                <div 
                  key={prop.id} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 opacity-0 translate-y-8 animate-fadeInUp"
                  style={{
                    animationDelay: `${index * 350}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  {prop.immagini && prop.immagini.length > 0 ? (
                    <img
                      src={prop.immagini[0]}
                      alt={prop.titolo}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => setSelectedProperty(prop)}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-400 cursor-pointer"
                         onClick={() => setSelectedProperty(prop)}>
                      No image
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold line-clamp-2 cursor-pointer hover:text-blue-600"
                            onClick={() => setSelectedProperty(prop)}>
                          {prop.titolo}
                        </h3>
                        <p className="text-sm text-gray-500">{prop.tipo} - {prop.citta}</p>
                      </div>
                      <div className="text-right ml-2">
                        <span className="text-xl font-bold text-blue-600">
                          €{prop.prezzo.toLocaleString()}
                        </span>
                        {prop.in_evidenza && (
                          <div className="mt-1">
                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              In Evidenza
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{prop.descrizione}</p>
                    
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>{prop.camere || 0} camere</span>
                      <span>{prop.bagni || 0} bagni</span>
                      <span>{prop.superficie} m²</span>
                    </div>
                    
                    {prop.caratteristiche && prop.caratteristiche.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {prop.caratteristiche.slice(0, 3).map((car, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {car}
                            </span>
                          ))}
                          {prop.caratteristiche.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              +{prop.caratteristiche.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedProperty(prop)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        Maggiori Info
                      </button>
                      
                      {user && user.email === adminEmail && (
                        <>
                          <button 
                            onClick={() => setEditingProperty(prop)}
                            className="px-3 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm"
                          >
                            Modifica
                          </button>
                          <button 
                            onClick={() => handleDelete(prop.id)}
                            disabled={deletingId === prop.id}
                            className="px-3 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
                          >
                            {deletingId === prop.id ? '...' : 'Elimina'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {proprietaFiltrate.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Nessuna proprietà trovata</h3>
                <p className="text-gray-500">Prova a modificare i filtri di ricerca</p>
              </div>
            )}

            {/* Controlli Paginazione */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Precedente
                </button>
                
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!showPage) {
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-3 py-2">...</span>;
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-4 py-2 border rounded-md ${
                          isCurrentPage
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Successiva →
                </button>
              </div>
            )}
          </>
        )}

        {/* Form di Contatto */}
        <div className="mt-16 bg-blue-600 text-white p-8 rounded-lg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Contattaci</h2>
            <p className="text-lg mb-8 text-center">
              Hai domande su una proprietà specifica o necessiti di supporto nella ricerca?
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sezione Contatti */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">I Nostri Contatti</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:pippo@gmail.com" className="text-blue-100 hover:text-white transition-colors">
                        pippo@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Telefono</p>
                      <a href="tel:+393333333333" className="text-blue-100 hover:text-white transition-colors">
                        +39 333 333 3333
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Indirizzo</p>
                      <p className="text-blue-100">Via Roma 123, Milano</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Orari</p>
                      <p className="text-blue-100">Lun-Ven: 9:00-18:00</p>
                      <p className="text-blue-100">Sab: 9:00-13:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Social</p>
                      <div className="flex space-x-2">
                        <button type="button" className="text-blue-100 hover:text-white transition-colors">Instagram</button>
                        <span className="text-blue-200">•</span>
                        <button type="button" className="text-blue-100 hover:text-white transition-colors">Facebook</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Form di Contatto */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Invia un Messaggio</h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData);
                    
                    const subject = data.proprieta_id && data.proprieta_id !== '' 
                      ? `Richiesta info proprietà: ${proprieta.find(p => p.id === data.proprieta_id)?.titolo || 'Proprietà selezionata'}`
                      : 'Richiesta informazioni generali';
                    
                    const body = `Nome: ${data.nome}\n` +
                      `Email: ${data.email}\n` +
                      `Telefono: ${data.telefono || 'Non fornito'}\n\n` +
                      (data.proprieta_id && data.proprieta_id !== '' 
                        ? `Proprietà di interesse:\n${proprieta.find(p => p.id === data.proprieta_id)?.titolo} - ${proprieta.find(p => p.id === data.proprieta_id)?.citta}\n\n`
                        : '') +
                      `Messaggio:\n${data.messaggio}`;
                    
                    window.location.href = `mailto:pippo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Nome *
                      </label>
                      <input
                        type="text"
                        name="nome"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Telefono
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Proprietà di interesse
                      </label>
                      <select
                        name="proprieta_id"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
                      >
                        <option value="">Richiesta generica</option>
                        {proprieta.map((prop) => (
                          <option key={prop.id} value={prop.id}>
                            {prop.titolo} - {prop.citta} (€{prop.prezzo.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Messaggio *
                    </label>
                    <textarea
                      name="messaggio"
                      rows="4"
                      required
                      placeholder="Descrivi le tue esigenze o fai una domanda specifica..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
                    />
                  </div>
                  
                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Invia Richiesta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Form creazione/modifica proprietà */}
      {editingProperty && (
        <PropertyForm
          isOpen={true}
          onClose={() => setEditingProperty(null)}
          propertyToEdit={Object.keys(editingProperty).length === 0 ? null : editingProperty}
          onPropertySaved={() => {
            setEditingProperty(null);
            fetchProprieta();
          }}
        />
      )}

      {/* Modale per visualizzazione proprietà */}
      <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
      
      {/* Modal conferma eliminazione */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmDeleteModal(null)} />
          <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Conferma Eliminazione</h3>
            <p className="text-gray-600 mb-6">
              Sei sicuro di voler eliminare questa proprietà? Questa azione non può essere annullata.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProprietaVendita;
import React, { useEffect, useRef, useState } from 'react';
import NavBar from '../components/NavBar';
import PageHero from '../components/PageHero';
import { useToasts } from '../components/Toast';

// Background da URL, tema: meeting/strategia/processo di lavoro
const workBg = 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1920&auto=format&fit=crop';

const ComeLavoriamo = () => {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});
  const { add } = useToasts();

  // State per il form di contatto
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    messaggio: ''
  });

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Qui andrà la logica per inviare il messaggio
    console.log('Form data:', formData);
    add('Messaggio inviato con successo! Ti contatteremo presto.', 'success');
    setFormData({
      nome: '',
      email: '',
      telefono: '',
      messaggio: ''
    });
  };

  useEffect(() => {
    const observers = {};
    
    // Crea un observer per ogni sezione
    Object.keys(sectionRefs.current).forEach(key => {
      const element = sectionRefs.current[key];
      if (element) {
        observers[key] = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleSections(prev => ({ ...prev, [key]: true }));
            }
          },
          { threshold: 0.2 }
        );
        observers[key].observe(element);
      }
    });

    return () => {
      Object.values(observers).forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen">
      <NavBar current="Come Lavoriamo" />
      
      <PageHero title="Come Lavoriamo" bgImage={workBg} />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {/* Sezione 1 */}
          <section className="text-center">
            <h2 
              ref={el => sectionRefs.current.processTitle = el}
              className={`text-3xl font-bold text-gray-900 mb-8 transform transition-all duration-1000 ${
                visibleSections.processTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
              }`}
            >
              Il Nostro Processo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 (Sinistra) - Scorre da SINISTRA */}
              <div 
                ref={el => sectionRefs.current.process1 = el}
                className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-1000 ${
                  visibleSections.process1 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-20'
                }`}
              >
                <div className={`text-4xl mb-4 transform transition-all duration-700 delay-300 ${
                  visibleSections.process1 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 rotate-180'
                }`}>🔍</div>
                <h3 className="text-xl font-semibold mb-3">1. Analisi</h3>
                <p className="text-gray-600">
                  Analizziamo il mercato immobiliare locale e identifichiamo le migliori opportunità 
                  di investimento nella tua zona.
                </p>
              </div>
              
              {/* Card 2 (Centrale) - Scorre dal BASSO */}
              <div 
                ref={el => sectionRefs.current.process2 = el}
                className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-1000 ${
                  visibleSections.process2 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-20 scale-95'
                }`}
              >
                <div className={`text-4xl mb-4 transform transition-all duration-700 delay-300 ${
                  visibleSections.process2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}>🤝</div>
                <h3 className="text-xl font-semibold mb-3">2. Collaborazione</h3>
                <p className="text-gray-600">
                  Lavoriamo insieme ai nostri segnalatori per individuare proprietà con 
                  alto potenziale di crescita e rendimento.
                </p>
              </div>
              
              {/* Card 3 (Destra) - Scorre da DESTRA */}
              <div 
                ref={el => sectionRefs.current.process3 = el}
                className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-1000 ${
                  visibleSections.process3 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-20'
                }`}
              >
                <div className={`text-4xl mb-4 transform transition-all duration-700 delay-300 ${
                  visibleSections.process3 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'
                }`}>💰</div>
                <h3 className="text-xl font-semibold mb-3">3. Realizzazione</h3>
                <p className="text-gray-600">
                  Completiamo l'operazione garantendo il massimo valore per tutte le parti 
                  coinvolte nel processo.
                </p>
              </div>
            </div>
          </section>

          {/* Sezione 2 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center transform transition-all duration-700 opacity-100">La Nostra Metodologia</h2>
            
            <div className="space-y-16">
              {/* Punto 1 - Immagine a sinistra, testo a destra */}
              <div 
                ref={el => sectionRefs.current.step1 = el}
                className={`flex flex-col lg:flex-row items-center gap-8 transform transition-all duration-700 ${
                  visibleSections.step1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
              >
                <div className={`lg:w-1/2 transform transition-all duration-700 delay-200 ${
                  visibleSections.step1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}>
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop" 
                    alt="Ricerca di Mercato" 
                    className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  />
                </div>
                <div className={`lg:w-1/2 space-y-4 transform transition-all duration-700 delay-300 ${
                  visibleSections.step1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl transform transition-all duration-500 delay-400 ${
                      visibleSections.step1 ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-45 scale-0'
                    }`}>1</div>
                    <h3 className="text-2xl font-bold text-gray-900">Ricerca di Mercato</h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Utilizziamo dati di mercato avanzati e analisi comparative per identificare le zone con maggiore potenziale. 
                    Il nostro team di esperti studia attentamente le tendenze del mercato immobiliare, analizza i prezzi storici 
                    e monitora gli sviluppi urbanistici per fornire una panoramica completa delle opportunità di investimento.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Analisi comparative di mercato (CMA)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Studio delle tendenze di crescita</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Valutazione del potenziale di apprezzamento</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Punto 2 - Immagine a destra, testo a sinistra */}
              <div 
                ref={el => sectionRefs.current.step2 = el}
                className={`flex flex-col lg:flex-row-reverse items-center gap-8 transform transition-all duration-700 ${
                  visibleSections.step2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
              >
                <div className={`lg:w-1/2 transform transition-all duration-700 delay-200 ${
                  visibleSections.step2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}>
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop" 
                    alt="Valutazione Professionale" 
                    className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  />
                </div>
                <div className={`lg:w-1/2 space-y-4 transform transition-all duration-700 delay-300 ${
                  visibleSections.step2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl transform transition-all duration-500 delay-400 ${
                      visibleSections.step2 ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-45 scale-0'
                    }`}>2</div>
                    <h3 className="text-2xl font-bold text-gray-900">Valutazione Professionale</h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Ogni proprietà viene valutata da esperti qualificati per determinare il valore reale e il potenziale di crescita. 
                    Utilizziamo metodologie consolidate e strumenti professionali per garantire valutazioni accurate e affidabili, 
                    considerando tutti i fattori che influenzano il valore immobiliare.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      <span>Perizie tecniche dettagliate</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      <span>Valutazione dello stato di conservazione</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      <span>Stima del potenziale di rendimento</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Punto 3 - Immagine a sinistra, testo a destra */}
              <div 
                ref={el => sectionRefs.current.step3 = el}
                className={`flex flex-col lg:flex-row items-center gap-8 transform transition-all duration-700 ${
                  visibleSections.step3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
              >
                <div className={`lg:w-1/2 transform transition-all duration-700 delay-200 ${
                  visibleSections.step3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}>
                  <img 
                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop" 
                    alt="Strategia Personalizzata" 
                    className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  />
                </div>
                <div className={`lg:w-1/2 space-y-4 transform transition-all duration-700 delay-300 ${
                  visibleSections.step3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl transform transition-all duration-500 delay-400 ${
                      visibleSections.step3 ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-45 scale-0'
                    }`}>3</div>
                    <h3 className="text-2xl font-bold text-gray-900">Strategia Personalizzata</h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Sviluppiamo una strategia su misura per ogni cliente, considerando obiettivi specifici e budget disponibile. 
                    Non esiste una soluzione universale: ogni situazione richiede un approccio dedicato che tenga conto delle 
                    esigenze personali, delle tempistiche e degli obiettivi di investimento del cliente.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      <span>Consulenza personalizzata one-to-one</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      <span>Piano di investimento su misura</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      <span>Ottimizzazione fiscale e finanziaria</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Punto 4 - Immagine a destra, testo a sinistra */}
              <div 
                ref={el => sectionRefs.current.step4 = el}
                className={`flex flex-col lg:flex-row-reverse items-center gap-8 transform transition-all duration-700 ${
                  visibleSections.step4 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
              >
                <div className={`lg:w-1/2 transform transition-all duration-700 delay-200 ${
                  visibleSections.step4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}>
                  <img 
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop" 
                    alt="Supporto Continuo" 
                    className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  />
                </div>
                <div className={`lg:w-1/2 space-y-4 transform transition-all duration-700 delay-300 ${
                  visibleSections.step4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl transform transition-all duration-500 delay-400 ${
                      visibleSections.step4 ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-45 scale-0'
                    }`}>4</div>
                    <h3 className="text-2xl font-bold text-gray-900">Supporto Continuo</h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Offriamo assistenza completa durante tutto il processo, dalla ricerca alla finalizzazione dell'acquisto. 
                    Il nostro impegno non si ferma alla firma del contratto: continuiamo a supportare i nostri clienti anche 
                    nelle fasi successive, garantendo un servizio completo e professionale.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                      <span>Assistenza legale e burocratica</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                      <span>Supporto post-vendita</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                      <span>Monitoraggio investimenti</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Sezione Contatti */}
          <section className="bg-blue-600 text-white p-8 lg:p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-8 text-center">Pronto a Iniziare?</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sezione Contatti - Sinistra */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-6">I Nostri Contatti</h3>
                  
                  <div className="space-y-4">
                    {/* Telefono */}
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-lg">📞</span>
                      </div>
                      <div>
                        <p className="font-medium">Telefono</p>
                        <p className="text-blue-100">+39 123 456 7890</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-lg">✉️</span>
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-blue-100">info@tuodominio.com</p>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-lg">💬</span>
                      </div>
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <p className="text-blue-100">+39 123 456 7890</p>
                      </div>
                    </div>

                    {/* Indirizzo */}
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-lg">📍</span>
                      </div>
                      <div>
                        <p className="font-medium">Indirizzo</p>
                        <p className="text-blue-100">Via Roma 123, 00100 Roma</p>
                      </div>
                    </div>

                    {/* Orari */}
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-lg">🕒</span>
                      </div>
                      <div>
                        <p className="font-medium">Orari di Apertura</p>
                        <p className="text-blue-100">Lun-Ven: 9:00-18:00</p>
                        <p className="text-blue-100">Sab: 9:00-13:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form di Contatto - Destra */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Scrivici Subito</h3>
                
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Il tuo nome..."
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="la.tua@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium mb-2">
                      Telefono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="+39 123 456 7890"
                    />
                  </div>

                  <div>
                    <label htmlFor="messaggio" className="block text-sm font-medium mb-2">
                      Messaggio *
                    </label>
                    <textarea
                      id="messaggio"
                      name="messaggio"
                      required
                      rows={4}
                      value={formData.messaggio}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                      placeholder="Raccontaci le tue esigenze..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-blue-600 py-3 px-4 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200"
                  >
                    Invia Messaggio
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ComeLavoriamo;
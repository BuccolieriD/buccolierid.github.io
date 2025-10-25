import React, { useEffect, useRef, useState } from 'react';
import NavBar from '../components/NavBar';
import PageHero from '../components/PageHero';
import { useToasts } from '../components/Toast';
// Background dedicato (tema: networking/collaborazione)
const segnBg = 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1920&auto=format&fit=crop';

const DiventaSegnalatore = () => {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});
  const { add } = useToasts();

  // State per il form di candidatura
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    citta: '',
    esperienza: '',
    motivazione: ''
  });

  // State per il form di contatto
  const [contactData, setContactData] = useState({
    nome: '',
    email: '',
    telefono: '',
    messaggio: ''
  });

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    add('Candidatura inviata con successo! Ti contatteremo presto.', 'success');
    setFormData({
      nome: '',
      email: '',
      telefono: '',
      citta: '',
      esperienza: '',
      motivazione: ''
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact data:', contactData);
    add('Messaggio inviato con successo! Ti contatteremo presto.', 'success');
    setContactData({
      nome: '',
      email: '',
      telefono: '',
      messaggio: ''
    });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      <NavBar current="Diventa Segnalatore" />
      <PageHero title="Diventa Segnalatore" bgImage={segnBg} />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {/* Sezione 1 - I vantaggi di diventare segnalatore */}
          <section className="text-center">
            <h2 
              ref={el => sectionRefs.current.benefitsTitle = el}
              className={`text-3xl font-bold text-gray-900 mb-8 transform transition-all duration-1000 ${
                visibleSections.benefitsTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
              }`}
            >
              Perché Diventare Segnalatore
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 (Sinistra) - Scorre da SINISTRA */}
              <div 
                ref={el => sectionRefs.current.benefit1 = el}
                className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-1000 ${
                  visibleSections.benefit1 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-20'
                }`}
              >
                <div className={`text-4xl mb-4 transform transition-all duration-700 delay-300 ${
                  visibleSections.benefit1 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 rotate-180'
                }`}>💰</div>
                <h3 className="text-xl font-semibold mb-3">Commissioni</h3>
                <p className="text-gray-600">
                  Guadagna commissioni competitive per ogni segnalazione che si trasforma 
                  in vendita con percentuali interessanti.
                </p>
              </div>
              
              {/* Card 2 (Centrale) - Scorre dal BASSO */}
              <div 
                ref={el => sectionRefs.current.benefit2 = el}
                className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-1000 ${
                  visibleSections.benefit2 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-20 scale-95'
                }`}
              >
                <div className={`text-4xl mb-4 transform transition-all duration-700 delay-300 ${
                  visibleSections.benefit2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}>🤝</div>
                <h3 className="text-xl font-semibold mb-3">Supporto</h3>
                <p className="text-gray-600">
                  Ti forniamo tutti gli strumenti e il supporto necessario per 
                  avere successo nel tuo territorio.
                </p>
              </div>
              
              {/* Card 3 (Destra) - Scorre da DESTRA */}
              <div 
                ref={el => sectionRefs.current.benefit3 = el}
                className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-1000 ${
                  visibleSections.benefit3 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-20'
                }`}
              >
                <div className={`text-4xl mb-4 transform transition-all duration-700 delay-300 ${
                  visibleSections.benefit3 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'
                }`}>⏰</div>
                <h3 className="text-xl font-semibold mb-3">Flessibilità</h3>
                <p className="text-gray-600">
                  Lavora nei tuoi tempi e gestisci il tuo territorio come 
                  preferisci, senza vincoli orari.
                </p>
              </div>
            </div>
          </section>

          {/* Sezione 2 - Come Funziona (con effetti) */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Come Funziona</h2>
            
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
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop" 
                    alt="Registrazione" 
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
                    <h3 className="text-2xl font-bold text-gray-900">Registrati come Segnalatore</h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Compila il form di candidatura con i tuoi dati e informazioni sul territorio che conosci meglio. 
                    Il nostro team valuterà la tua candidatura e ti contatterà per fornirti tutti i dettagli 
                    sul programma di collaborazione e gli strumenti necessari.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Candidatura online semplice e veloce</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Valutazione entro 24-48 ore</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Kit di benvenuto e materiali formativi</span>
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
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop" 
                    alt="Ricerca Proprietà" 
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
                    <h3 className="text-2xl font-bold text-gray-900">Cerca e Segnala Proprietà</h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Utilizza la tua conoscenza del territorio per identificare proprietà interessanti e potenziali clienti. 
                    Ti forniamo tutti gli strumenti digitali e il supporto tecnico necessario per gestire le tue segnalazioni 
                    in modo professionale ed efficace.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      <span>App mobile dedicata per segnalazioni</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      <span>Sistema di tracking delle opportunità</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      <span>Supporto tecnico costante</span>
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
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop" 
                    alt="Collaborazione" 
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
                    <h3 className="text-2xl font-bold text-gray-900">Collabora con i Nostri Esperti</h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Le tue segnalazioni vengono prese in carico dal nostro team di esperti che si occupa di valutazioni, 
                    trattative e chiusure. Tu continui a seguire il processo rimanendo sempre informato sullo stato 
                    di avanzamento delle tue segnalazioni.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      <span>Team di esperti dedicato</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      <span>Aggiornamenti costanti sul progress</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      <span>Supporto nelle trattative</span>
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
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop" 
                    alt="Guadagni" 
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
                    <h3 className="text-2xl font-bold text-gray-900">Ricevi le Tue Commissioni</h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Quando una tua segnalazione si conclude con successo, ricevi la commissione pattuita in tempi rapidi. 
                    Sistema di pagamento trasparente e puntuale con report dettagliati di tutte le tue attività 
                    e guadagni mensili.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                      <span>Commissioni competitive e trasparenti</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                      <span>Pagamenti puntuali e sicuri</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                      <span>Dashboard con report dettagliati</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Sezione Contatti e Form - Stile uguale alla pagina Come Lavoriamo */}
          <section className="bg-blue-600 text-white p-8 lg:p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-8 text-center">Inizia Subito la Tua Carriera</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sezione Contatti - Sinistra */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Hai Domande? Contattaci</h3>
                  
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
                        <p className="font-medium">Email Segnalatori</p>
                        <p className="text-blue-100">segnalatori@tuodominio.com</p>
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

                    {/* Info aggiuntive */}
                    <div className="mt-6 p-4 bg-white/10 rounded-lg">
                      <h4 className="font-semibold mb-2">📋 Requisiti Minimi</h4>
                      <ul className="text-sm text-blue-100 space-y-1">
                        <li>• Conoscenza del territorio locale</li>
                        <li>• Passione per il settore immobiliare</li>
                        <li>• Buone capacità comunicative</li>
                        <li>• Motivazione e determinazione</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form di Candidatura - Destra */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Candidati Ora</h3>
                
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-nome" className="block text-sm font-medium mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="contact-nome"
                      name="nome"
                      required
                      value={contactData.nome}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Il tuo nome..."
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      value={contactData.email}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="la.tua@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-telefono" className="block text-sm font-medium mb-2">
                      Telefono
                    </label>
                    <input
                      type="tel"
                      id="contact-telefono"
                      name="telefono"
                      value={contactData.telefono}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="+39 123 456 7890"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-messaggio" className="block text-sm font-medium mb-2">
                      Perché vuoi diventare segnalatore? *
                    </label>
                    <textarea
                      id="contact-messaggio"
                      name="messaggio"
                      required
                      rows={4}
                      value={contactData.messaggio}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                      placeholder="Raccontaci la tua motivazione e il territorio che conosci..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-blue-600 py-3 px-4 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200"
                  >
                    Invia Candidatura
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

export default DiventaSegnalatore;
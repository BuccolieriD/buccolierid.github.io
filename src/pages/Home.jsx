import React, { useEffect, useState, useRef } from "react";
import sfondo from "../asset/sfondobackground.png";
import logo from "../asset/logo.png";
import NavBar from "../components/NavBar";
import AboutMe from "../components/AboutMe";
import supabase from "../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function Home() {
  const [preview, setPreview] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeArticle, setActiveArticle] = useState(null); // full article
  const [selectedProperty, setSelectedProperty] = useState(null); // selected property for modal
  const [panelLoading, setPanelLoading] = useState(false);
  const heroRef = useRef(null);
  const previewRef = useRef(null);
  const propertiesRef = useRef(null);
  const comeLavoriamoRef = useRef(null);
  const segnalatorRef = useRef(null);
  const contactRef = useRef(null);
  
  // start hidden so the entrance transition runs on initial page load
  const [heroInView, setHeroInView] = useState(false);
  const [previewInView, setPreviewInView] = useState(false);
  const [propertiesInView, setPropertiesInView] = useState(false);
  const [comeLavoriamoInView, setComeLavoriamoInView] = useState(false);
  const [segnalatorInView, setSegnalatorInView] = useState(false);
  const [contactInView, setContactInView] = useState(false);
  const [logoAnimate, setLogoAnimate] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPreview = async () => {
      const { data, error } = await supabase
        .from("articles")
        // include content + author so we can show it immediately (fallback/full view)
        .select("id,title,excerpt,slug,image,content,author")
        .order("created_at", { ascending: false })
        .limit(3);
      if (!error && data) setPreview(data);
    };
    
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("id,titolo,prezzo,citta,tipo,immagini,superficie,camere,bagni,in_evidenza")
        .eq("disponibile", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (!error && data) setProperties(data);
    };
    
    fetchPreview();
    fetchProperties();
  }, []);

  // close panel on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setActiveArticle(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const currentFetchSlug = useRef(null);

  const openArticlePanel = async (articleOrSlug) => {
    setPanelLoading(true);
    setActiveArticle(null);

    const isString = typeof articleOrSlug === "string";
    const slug = isString ? articleOrSlug : articleOrSlug?.slug;
    const previewItem = isString ? preview.find((p) => p.slug === slug) : articleOrSlug;

    // show preview immediately
    if (previewItem) {
      setActiveArticle({
        title: previewItem.title,
        author: previewItem.author || "Unknown",
        created_at: previewItem.created_at || new Date().toISOString(),
        content: previewItem.content || previewItem.excerpt || "<p>Contenuto non disponibile</p>",
        image: previewItem.image || null,
      });
    }

    if (!slug) {
      setPanelLoading(false);
      return;
    }

    // track current requested slug to avoid race updates
    currentFetchSlug.current = slug;

    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .limit(1)
        .single();
      if (!error && data && currentFetchSlug.current === slug) {
        setActiveArticle(data);
      }
    } catch (e) {
      console.error("Error loading full article", e);
    } finally {
      // only stop loading if this is the current request
      if (currentFetchSlug.current === slug) currentFetchSlug.current = null;
      setPanelLoading(false);
    }
  };

  // hero and preview observers
  useEffect(() => {
    const heroEl = heroRef.current;
    if (heroEl) {
      const hObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => setHeroInView(entry.isIntersecting));
        },
        { threshold: 0.05 }
      );
      hObs.observe(heroEl);
      return () => hObs.disconnect();
    }
  }, []);

  useEffect(() => {
    const observers = [];
    
    const sections = [
      { ref: previewRef, setter: setPreviewInView },
      { ref: propertiesRef, setter: setPropertiesInView },
      { ref: comeLavoriamoRef, setter: setComeLavoriamoInView },
      { ref: segnalatorRef, setter: setSegnalatorInView },
      { ref: contactRef, setter: setContactInView }
    ];

    sections.forEach(({ ref, setter }) => {
      const el = ref.current;
      if (el) {
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => setter(entry.isIntersecting));
          },
          { threshold: 0.12 }
        );
        obs.observe(el);
        observers.push(obs);
      }
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  // on mount animate logo briefly
  useEffect(() => {
    // trigger the hero and logo entrance on initial load
    // small next-tick timeout ensures transitions run
    const a = setTimeout(() => setHeroInView(true), 50);
    setLogoAnimate(true);
    const t = setTimeout(() => setLogoAnimate(false), 800);
    return () => {
      clearTimeout(a);
      clearTimeout(t);
    };
  }, []);

  return (
    <div className="bg-gray-900">
      <NavBar current="" />

      <div
        className="relative isolate px-6 pt-14 lg:px-8"
        style={{
          backgroundImage: `url(${sfondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>
          {/* dark veil over the background to improve contrast */}
          <div aria-hidden className="absolute inset-0 bg-black/30 pointer-events-none" />
          <div ref={heroRef} className={`mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 relative z-10 transform transition-all duration-1000 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
          <div
            className="sm:mb-8 sm:flex sm:justify-center"
            style={{ placeItems: "anchor-center" }}
          >
            <img
              alt="Company Logo"
              src={logo}
              className={`h-[12vh] w-auto transform transition-all duration-1000 ${(heroInView || logoAnimate) ? 'opacity-100 translate-y-0 scale-105' : 'opacity-0 translate-y-2 scale-95'}`}
            />
          </div>
          <div className="text-center">
            <h1 className={`text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl transform transition-all duration-1000 ${(heroInView || logoAnimate) ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
               Jackowski Immobiliare srl
            </h1>
           {/*  <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
              lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
            </p> */}
          </div>
        </div>
      </div>
  {/* About me section */}
  <AboutMe />

      {/* Article Modal (overlay) */}
      {panelLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-50 max-w-3xl w-full bg-white rounded-lg p-6">
            <p className="text-sm text-slate-600">Caricamento articolo...</p>
          </div>
        </div>
      )}

      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setActiveArticle(null)}
          />
          <div className="relative max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
            {activeArticle.image && (
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            )}
              <div className="p-6 flex flex-col max-h-[80vh]">
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-semibold mb-2">
                    {activeArticle.title}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  By {activeArticle.author} -{" "}
                  {new Date(activeArticle.created_at).toLocaleString()}
                </p>
                <div
                  className="prose max-w-none overflow-auto mb-4"
                  style={{ flex: 1 }}
                  dangerouslySetInnerHTML={{ __html: activeArticle.content }}
                />

                {/* footer with right-aligned close button */}
                <div className="mt-4 flex justify-end border-t border-slate-100/10 pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveArticle(null)}
                    className="px-4 py-2 bg-slate-200 rounded"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}

  {/* Preview articoli */}
  <div ref={previewRef} className={`max-w-7xl mx-auto px-6 py-12 transform transition-all duration-1000 ${previewInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Blog Immobili</h3>
          <Link to="/blog" className="text-sm text-slate-300 hover:text-white transition-colors">
            Vedi tutti →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {preview.map((a, index) => (
            <button
              key={a.id}
              type="button"
              onClick={() => openArticlePanel(a)}
              className={`text-left block bg-white/5 rounded-lg overflow-hidden shadow-md transform transition-all duration-1000 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-2xl focus:scale-105 focus:-translate-y-1 focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 ${
                previewInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${index * 200}ms`
              }}
            >
              {a.image ? (
                <img
                  src={a.image}
                  alt={a.title}
                    className="w-full h-36 object-cover"
                    loading="lazy"
                />
              ) : (
                <div className="w-full h-36 bg-white/3 flex items-center justify-center text-slate-300">
                  No image
                </div>
              )}
              <div className="p-3">
                <h4 className="text-sm font-semibold text-white line-clamp-2">
                  {a.title}
                </h4>
                <p className="mt-2 text-xs text-slate-300 line-clamp-3">
                  {a.excerpt || a.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Proprietà */}
      <div ref={propertiesRef} className={`max-w-7xl mx-auto px-6 py-12 transform transition-all duration-1000 ${propertiesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Proprietà in Vendita</h3>
          <Link to="/proprieta-vendita" className="text-sm text-slate-300 hover:text-white transition-colors">
            Vedi tutte →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {properties.map((prop, index) => (
            <button
              key={prop.id}
              type="button"
              onClick={() => setSelectedProperty(prop)}
              className={`text-left block bg-white/5 rounded-lg overflow-hidden shadow-md transform transition-all duration-1000 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-2xl focus:scale-105 focus:-translate-y-1 focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 ${
                propertiesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${index * 200}ms`
              }}
            >
              {prop.immagini && prop.immagini.length > 0 ? (
                <img
                  src={prop.immagini[0]}
                  alt={prop.titolo}
                  className="w-full h-36 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-36 bg-white/3 flex items-center justify-center text-slate-300">
                  No image
                </div>
              )}
              <div className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-semibold text-white line-clamp-2">
                    {prop.titolo}
                  </h4>
                  {prop.in_evidenza && (
                    <span className="ml-2 inline-block bg-yellow-500/20 text-yellow-300 text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                      ★
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-2">{prop.tipo} - {prop.citta}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-blue-400">
                    €{prop.prezzo.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">
                    {prop.superficie}m² • {prop.camere} cam
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sezione Come Lavoriamo */}
      <div ref={comeLavoriamoRef} className={`max-w-7xl mx-auto px-6 py-12 transform transition-all duration-1000 ${comeLavoriamoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Il Nostro Metodo</h3>
          <Link to="/come-lavoriamo" className="text-sm text-slate-300 hover:text-white transition-colors">
            Scopri di più →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🔍', title: 'Analisi', desc: 'Studio approfondito del mercato immobiliare locale' },
            { icon: '💎', title: 'Valutazione', desc: 'Perizie professionali per determinare il valore reale' },
            { icon: '🎯', title: 'Strategia', desc: 'Piano personalizzato su misura per ogni cliente' },
            { icon: '🤝', title: 'Supporto', desc: 'Assistenza completa in ogni fase del processo' }
          ].map((item, index) => (
            <div
              key={index}
              className={`bg-white/5 p-6 rounded-lg transform transition-all duration-1000 hover:bg-white/10 ${
                comeLavoriamoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${index * 200}ms`
              }}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h4 className="text-white font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sezione Diventa Segnalatore */}
      <div ref={segnalatorRef} className={`max-w-7xl mx-auto px-6 py-12 transform transition-all duration-1000 ${segnalatorInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-3">Diventa un Segnalatore</h3>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Unisciti alla nostra rete di collaboratori e guadagna commissioni competitive segnalando proprietà
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: '💰', title: 'Commissioni', desc: 'Guadagni competitivi per ogni segnalazione' },
              { icon: '🤝', title: 'Supporto', desc: 'Strumenti e assistenza dedicata' },
              { icon: '⏰', title: 'Flessibilità', desc: 'Lavora nei tuoi tempi' }
            ].map((item, index) => (
              <div
                key={index}
                className={`bg-white/5 p-6 rounded-lg text-center transform transition-all duration-1000 ${
                  segnalatorInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                <p className="text-sm text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/diventa-segnalatore"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
            >
              Inizia Ora
            </Link>
          </div>
        </div>
      </div>

      {/* Sezione Contatti */}
      <div ref={contactRef} className={`max-w-7xl mx-auto px-6 py-12 mb-12 transform transition-all duration-1000 ${contactInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="bg-blue-600 text-white p-8 rounded-lg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Contattaci</h2>
            <p className="text-lg mb-8 text-center">
              Hai domande o vuoi maggiori informazioni? Siamo qui per aiutarti
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
                      <a href="mailto:info@tuodominio.com" className="text-blue-100 hover:text-white transition-colors">
                        info@tuodominio.com
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
                    
                    const subject = 'Richiesta informazioni dal sito web';
                    const body = `Nome: ${data.nome}\n` +
                      `Email: ${data.email}\n` +
                      `Telefono: ${data.telefono || 'Non fornito'}\n\n` +
                      `Messaggio:\n${data.messaggio}`;
                    
                    window.location.href = `mailto:info@tuodominio.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
                      Messaggio *
                    </label>
                    <textarea
                      name="messaggio"
                      rows="4"
                      required
                      placeholder="Come possiamo aiutarti?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
                    />
                  </div>
                  
                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Invia Messaggio
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Proprietà */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedProperty(null)} />
          <div className="relative max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
            {selectedProperty.immagini && selectedProperty.immagini.length > 0 && (
              <img
                src={selectedProperty.immagini[0]}
                alt={selectedProperty.titolo}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProperty.titolo}</h2>
                  <p className="text-lg text-gray-600">{selectedProperty.tipo} - {selectedProperty.citta}</p>
                  {selectedProperty.indirizzo && (
                    <p className="text-sm text-gray-500">{selectedProperty.indirizzo}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-blue-600">
                    €{selectedProperty.prezzo.toLocaleString()}
                  </span>
                  {selectedProperty.in_evidenza && (
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
                  <p className="text-lg">{selectedProperty.camere || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-medium">Bagni</span>
                  <p className="text-lg">{selectedProperty.bagni || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-medium">Superficie</span>
                  <p className="text-lg">{selectedProperty.superficie} m²</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-medium">Piano</span>
                  <p className="text-lg">{selectedProperty.piano !== null ? selectedProperty.piano : 'N/A'}</p>
                </div>
              </div>
              
              {selectedProperty.descrizione && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Descrizione</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProperty.descrizione}</p>
                </div>
              )}
              
              {selectedProperty.caratteristiche && selectedProperty.caratteristiche.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Caratteristiche</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.caratteristiche.map((caratteristica, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {caratteristica}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <Link 
                  to="/proprieta-vendita"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Vedi tutte le Proprietà
                </Link>
                <button 
                  onClick={() => setSelectedProperty(null)} 
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

  

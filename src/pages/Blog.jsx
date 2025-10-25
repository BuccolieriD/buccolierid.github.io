import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import ArticleForm from '../components/ArticleForm';
import { useSelector } from 'react-redux';
import { useToasts } from '../components/Toast';
import OverlaySpinner from '../components/OverlaySpinner';
import PageHero from '../components/PageHero';
import NavBar from '../components/NavBar';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Background dedicato da URL (tema: blog immobiliare/architettura)
const blogBg = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);
  const [selected, setSelected] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
  const { add } = useToasts();
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  // Filtri
  const [filtri, setFiltri] = useState({
    titolo: '',
    autore: ''
  });

  const handleFiltroChange = (e) => {
    setFiltri({
      ...filtri,
      [e.target.name]: e.target.value
    });
    setPage(1); // Reset alla prima pagina quando cambiano i filtri
  };

  // Applica filtri
  const articlesFiltrati = articles.filter(article => {
    const titoloMatch = filtri.titolo === '' || article.title.toLowerCase().includes(filtri.titolo.toLowerCase());
    const autoreMatch = filtri.autore === '' || article.author === filtri.autore;
    return titoloMatch && autoreMatch;
  });

  // Estrai autori unici dagli articoli
  const autoriDisponibili = [...new Set(articles.map(article => article.author))].sort();

  // Fetch articoli
  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      setArticles([]);
    } else {
      setArticles(data || []);
      setPage(1); // reset to first page when refetching
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();

    // Realtime subscription
    const channel = supabase
      .channel('public:articles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'articles' },
        () => fetchArticles()
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {}
    };
  }, []);

  // Effect per gestire l'apertura automatica dell'articolo dall'URL
  useEffect(() => {
    const articleId = searchParams.get('article');
    if (articleId && articles.length > 0) {
      // Verifica se l'articolo selezionato è già quello giusto
      if (!selected || selected.id !== articleId) {
        const article = articles.find(a => a.id === articleId);
        if (article) {
          setSelected(article);
        } else {
          // Articolo non trovato, rimuovi il parametro dall'URL
          navigate('/blog', { replace: true });
          add('Articolo non trovato', 'error');
        }
      }
    } else if (!articleId && selected) {
      // Se non c'è parametro article nell'URL ma c'è un articolo selezionato, chiudi la modale
      setSelected(null);
    }
  }, [articles, searchParams, navigate, add, selected]);

  // Effect per gestire la chiusura automatica se l'articolo selezionato viene eliminato
  useEffect(() => {
    if (selected && articles.length > 0) {
      // Verifica se l'articolo attualmente selezionato esiste ancora nella lista
      const articleStillExists = articles.find(a => a.id === selected.id);
      if (!articleStillExists) {
        // L'articolo è stato eliminato, chiudi la modale e pulisci l'URL
        setSelected(null);
        navigate('/blog', { replace: true });
        add('L\'articolo che stavi visualizzando è stato eliminato', 'warning');
      }
    }
  }, [articles, selected, navigate, add]);

  // Genera URL diretto per un articolo
  const getArticleDirectLink = (articleId) => {
    // In sviluppo usa localhost, in produzione usa il dominio GitHub Pages
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://buccolierid.github.io' 
      : window.location.origin; // Questo sarà http://localhost:3001
    
    return `${baseUrl}/blog?article=${articleId}`;
  };

  // Copia link negli appunti
  const copyArticleLink = async (articleId, articleTitle) => {
    try {
      await navigator.clipboard.writeText(getArticleDirectLink(articleId));
      add(`Link copiato per "${articleTitle}"`, 'success');
    } catch (err) {
      add('Errore durante la copia del link', 'error');
    }
  };

  // Cancella articolo e immagine
  const handleDelete = async (id, imageUrl) => {
    // open confirm modal instead of using window.confirm
    setConfirmDelete({ id, imageUrl });
  };

  // actual deletion performed after modal confirm
  const performDelete = async (id, imageUrl) => {
    setDeletingId(id);
    try {
      const fnUrl = process.env.REACT_APP_DELETE_ARTICLE_FN_URL;
      const articleRecord = articles.find((it) => it.id === id);

      // derive image_path if present in record or try to extract from imageUrl (fallback)
      let image_path = articleRecord?.image_path || null;
      if (!image_path && imageUrl) {
        try {
          const u = new URL(imageUrl);
          const parts = u.pathname.split('/');
          const publicIndex = parts.indexOf('public');
          if (publicIndex !== -1 && parts.length > publicIndex + 2) {
            image_path = parts.slice(publicIndex + 2).join('/');
          } else {
            const idx = imageUrl.indexOf('/images/');
            if (idx !== -1) image_path = imageUrl.substring(idx + 1);
          }
          if (image_path) image_path = image_path.replace(/^\/+/, '');
        } catch (e) {
          console.warn('Cannot parse imageUrl for image_path fallback', e);
        }
      }

      if (fnUrl) {
        const res = await fetch(fnUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, image_path }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || json?.message || 'Server function error');
        add('Articolo e immagine rimossi (server)', 'success');
        fetchArticles();
      } else {
        if (image_path) {
          try {
            const { error: delError } = await supabase.storage.from('images').remove([image_path]);
            if (delError) console.warn('Client remove error:', delError.message || delError);
          } catch (e) { console.warn(e); }
        }
        const { error } = await supabase.from('articles').delete().eq('id', id);
        if (error) throw error;
        add('Articolo eliminato', 'success');
        fetchArticles();
      }
    } catch (err) {
      add(err.message || 'Errore durante la cancellazione', 'error');
    } finally {
      setDeletingId(null);
    }
  };


  // Modal visualizzazione articolo
  const ArticleModal = ({ article, onClose }) => {
    if (!article) return null;
    
    const handleClose = () => {
      // Rimuovi il parametro article dall'URL quando chiudi la modale
      navigate('/blog', { replace: true });
      onClose();
    };

    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
          <div className="relative max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 object-cover rounded-t-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenImage(article.image);
                }}
              />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                By {article.author} - {new Date(article.created_at).toLocaleString()}
              </p>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
              <div className="mt-4 flex justify-between items-center">
                {/* Pulsante copia link visibile solo se loggato */}
                {user ? (
                  <button 
                    onClick={() => copyArticleLink(article.id, article.title)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    📋 Copia Link Diretto
                  </button>
                ) : (
                  <div></div> // Spazio vuoto per mantenere il layout
                )}
                <button onClick={handleClose} className="px-3 py-1 bg-slate-200 rounded">
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen">
      <NavBar current="Blog Immobili" />
      <PageHero title="Blog Immobili" bgImage={blogBg} />

      {/* Form creazione/modifica in modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90" onClick={() => setEditingArticle(null)} />
          <div className="relative z-50 w-full max-w-3xl">
            <ArticleForm
              article={editingArticle}
              onDone={() => {
                setEditingArticle(null);
                fetchArticles();
              }}
              onCancel={() => setEditingArticle(null)}
            />
          </div>
        </div>
      )}

      {/* Lista articoli */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Filtri */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Filtra gli Articoli</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cerca per Titolo</label>
              <input
                type="text"
                name="titolo"
                value={filtri.titolo}
                onChange={handleFiltroChange}
                placeholder="Inserisci parole chiave..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtra per Autore</label>
              <select
                name="autore"
                value={filtri.autore}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tutti gli autori</option>
                {autoriDisponibili.map(autore => (
                  <option key={autore} value={autore}>{autore}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Caricamento articoli...</p>
          </div>
        ) : articlesFiltrati.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nessun articolo trovato</h3>
            <p className="text-gray-500">Prova a modificare i filtri di ricerca</p>
          </div>
        ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Trovati <span className="font-semibold">{articlesFiltrati.length}</span> articoli
              {Math.ceil(articlesFiltrati.length / PER_PAGE) > 1 && (
                <span className="text-sm ml-2">
                  (Pagina {page} di {Math.ceil(articlesFiltrati.length / PER_PAGE)})
                </span>
              )}
            </p>
            
            {user && user.email === adminEmail && (
              <button
                onClick={() => setEditingArticle({})}
                className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors"
              >
                + Aggiungi Articolo
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articlesFiltrati.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((a, index) => (
            <div
              key={a.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 opacity-0 translate-y-8 animate-fadeInUp"
              style={{
                animationDelay: `${index * 350}ms`,
                animationFillMode: 'forwards'
              }}
            >
              {a.image ? (
                <img 
                  src={a.image} 
                  alt={a.title} 
                  className="w-full h-48 object-cover cursor-zoom-in hover:opacity-95 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenImage(a.image);
                  }}
                />
              ) : (
                <div 
                  className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-400 cursor-pointer"
                  onClick={() => {
                    setSelected(a);
                    navigate(`/blog?article=${a.id}`, { replace: true });
                  }}
                >
                  No image
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 
                      className="text-lg font-semibold line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => {
                        setSelected(a);
                        navigate(`/blog?article=${a.id}`, { replace: true });
                      }}
                    >
                      {a.title}
                    </h3>
                    <p className="text-sm text-gray-500">di {a.author}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                  {a.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                </p>
                
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setSelected(a);
                      navigate(`/blog?article=${a.id}`, { replace: true });
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Leggi Articolo
                  </button>
                  
                  {user && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyArticleLink(a.id, a.title);
                      }}
                      className="px-3 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm"
                      title="Copia link diretto"
                    >
                      📋
                    </button>
                  )}
                  
                  {user && user.email === adminEmail && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingArticle(a);
                        }}
                        className="px-3 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm"
                      >
                        Modifica
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(a.id, a.image);
                        }}
                        disabled={deletingId === a.id}
                        className="px-3 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
                      >
                        {deletingId === a.id ? '...' : 'Elimina'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Pagination controls */}
          {Math.ceil(articlesFiltrati.length / PER_PAGE) > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Precedente
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.ceil(articlesFiltrati.length / PER_PAGE) }).map((_, i) => {
                  const pageNum = i + 1;
                  const isCurrentPage = pageNum === page;
                  const showPage = 
                    pageNum === 1 || 
                    pageNum === Math.ceil(articlesFiltrati.length / PER_PAGE) || 
                    (pageNum >= page - 1 && pageNum <= page + 1);
                  
                  if (!showPage) {
                    if (pageNum === page - 2 || pageNum === page + 2) {
                      return <span key={pageNum} className="px-3 py-2">...</span>;
                    }
                    return null;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setPage(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`px-4 py-2 border rounded-md transition-colors ${
                        isCurrentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setPage((p) => Math.min(Math.ceil(articlesFiltrati.length / PER_PAGE), p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === Math.ceil(articlesFiltrati.length / PER_PAGE)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Successiva →
              </button>
            </div>
          )}

          {/* Sezione Contatti */}
          <div className="mt-16 bg-blue-600 text-white p-8 rounded-lg">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-center">Hai Domande sul Blog?</h2>
              <p className="text-lg mb-8 text-center">
                Vuoi maggiori informazioni su un articolo specifico o hai suggerimenti per nuovi contenuti?
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
                        <a href="mailto:blog@tuodominio.com" className="text-blue-100 hover:text-white transition-colors">
                          blog@tuodominio.com
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

                    <div className="mt-6 p-4 bg-white/10 rounded-lg">
                      <h4 className="font-semibold mb-2">💡 Suggerimenti</h4>
                      <p className="text-sm text-blue-100">
                        Hai un tema che vorresti vedere trattato nel nostro blog? 
                        Scrivici le tue idee e le valuteremo per i prossimi articoli!
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Form di Contatto */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Scrivici</h3>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const data = Object.fromEntries(formData);
                      
                      const subject = data.articolo_id && data.articolo_id !== '' 
                        ? `Domanda sull'articolo: ${articlesFiltrati.find(a => a.id === data.articolo_id)?.title || 'Articolo selezionato'}`
                        : 'Richiesta informazioni blog';
                      
                      const body = `Nome: ${data.nome}\n` +
                        `Email: ${data.email}\n` +
                        `Telefono: ${data.telefono || 'Non fornito'}\n\n` +
                        (data.articolo_id && data.articolo_id !== '' 
                          ? `Articolo di riferimento:\n"${articlesFiltrati.find(a => a.id === data.articolo_id)?.title}"\nAutore: ${articlesFiltrati.find(a => a.id === data.articolo_id)?.author}\n\n`
                          : '') +
                        `Messaggio:\n${data.messaggio}`;
                      
                      window.location.href = `mailto:blog@tuodominio.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
                          Articolo di riferimento
                        </label>
                        <select
                          name="articolo_id"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
                        >
                          <option value="">Richiesta generica</option>
                          {articlesFiltrati.map((art) => (
                            <option key={art.id} value={art.id}>
                              {art.title} - {art.author}
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
                        placeholder="Scrivi la tua domanda o il tuo suggerimento..."
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
        )}
      </main>

      {/* Deletion overlay spinner */}
      {deletingId && <OverlaySpinner message={`Eliminazione...`} />}

      {/* Modal */}
      <ArticleModal article={selected} onClose={() => setSelected(null)} />

      {/* Modal fullscreen per immagine */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10"
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

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmDelete(null)} />
          <div className="relative z-50 max-w-md w-full bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Confermi l'eliminazione?</h3>
            <p className="text-sm text-gray-600 mb-6">Questa azione rimuoverà l'articolo e l'immagine associata (se presente).</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="px-3 py-1 rounded border">Annulla</button>
              <button
                onClick={async () => {
                  const { id, imageUrl } = confirmDelete;
                  setConfirmDelete(null);
                  await performDelete(id, imageUrl);
                }}
                className="px-3 py-1 rounded bg-red-600 text-white"
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

export default Blog;

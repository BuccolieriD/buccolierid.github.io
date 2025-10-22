import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import ArticleForm from '../components/ArticleForm';
import { useSelector } from 'react-redux';
import { useToasts } from '../components/Toast';
import OverlaySpinner from '../components/OverlaySpinner';
import sfondo from '../asset/sfondobackground.png';
import logo from '../asset/logo.png';
import NavBar from '../components/NavBar';
import { NavLink } from 'react-router-dom';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);
  const [selected, setSelected] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
  const { add } = useToasts();
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

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
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 object-cover rounded-t-lg"
            />
          )}
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              By {article.author} - {new Date(article.created_at).toLocaleString()}
            </p>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
            <div className="mt-4 flex justify-end">
              <button onClick={onClose} className="px-3 py-1 bg-slate-200 rounded">
                Chiudi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <NavBar current="Blog" />
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

        <div className="max-w-7xl  mx-auto py-12 px-6 flex items-center justify-center relative z-10">
          <h1 className="text-5xl pt-14 font-bold text-white text-center">Articoli di Blog</h1>
        </div>
      </div>

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
        {loading ? (
          <p>Loading...</p>
        ) : articles.length === 0 ? (
          <p>Nessun articolo.</p>
        ) : (
        <div>
          {user && user.email === adminEmail && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setEditingArticle({})}
                className="px-4 py-2 bg-blue-600 text-white rounded shadow"
              >
                Aggiungi articolo
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((a) => (
            <div
              key={a.id}
              className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer bg-white"
              onClick={() => setSelected(a)}
            >
              {a.image ? (
                <img src={a.image} alt={a.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-400">
                  No image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="p-4 relative">
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">{a.title}</h3>
                <p className="text-xs text-gray-200 mb-2">{a.author}</p>
                <p className="text-sm text-white/90 line-clamp-3">{a.content.substring(0, 100)}...</p>

                {user && user.email === adminEmail && (
                    <div className="mt-3 space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingArticle(a);
                      }}
                      className="px-2 py-1 bg-white/30 backdrop-blur-sm text-white rounded"
                    >
                      Modifica
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(a.id, a.image); // open confirm modal
                      }}
                      className="px-2 py-1 bg-white/30 backdrop-blur-sm text-white rounded inline-flex items-center gap-2"
                      disabled={deletingId === a.id}
                    >
                      {deletingId === a.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Eliminando...
                        </>
                      ) : 'Elimina'}
                    </button>

                  </div>
                )}
              </div>
            </div>
          ))}
          </div>

          {/* Pagination controls */}
          {articles.length > PER_PAGE && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: Math.ceil(articles.length / PER_PAGE) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'border'}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(Math.ceil(articles.length / PER_PAGE), p + 1))}
                disabled={page === Math.ceil(articles.length / PER_PAGE)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
        )}
      </main>

      {/* Deletion overlay spinner */}
      {deletingId && <OverlaySpinner message={`Eliminazione...`} />}

      {/* Modal */}
      <ArticleModal article={selected} onClose={() => setSelected(null)} />

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

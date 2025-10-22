import React, { useState, useEffect, useRef } from 'react';
import supabase from '../lib/supabaseClient';
import { useToasts } from './Toast';
import OverlaySpinner from './OverlaySpinner';

const ArticleForm = ({ article = {}, onDone, onCancel }) => {
  const [title, setTitle] = useState(article.title || '');
  const [content, setContent] = useState(article.content || '');
  const [author, setAuthor] = useState(article.author || '');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(article.image || '');
  const [uploading, setUploading] = useState(false);
  const { add } = useToasts();
  const inputRef = useRef(null);

  useEffect(() => {
    setTitle(article.title || '');
    setContent(article.content || '');
    setAuthor(article.author || '');
    setImageFile(null);
    setPreview(article.image || '');
  }, [article]);

  const clearSelectedImage = () => {
    setImageFile(null);
    setPreview('');
    if (inputRef.current) inputRef.current.value = null;
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setImageFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = article.image || '';
      let imagePath = article.image_path || null;

      if (imageFile) {
        // attempt to delete old image first (best-effort)
        if (article && article.id) {
          try {
            let oldPath = article.image_path || null;
            if (!oldPath && article.image) {
              try {
                const u = new URL(article.image);
                const parts = u.pathname.split('/');
                const publicIndex = parts.indexOf('public');
                if (publicIndex !== -1 && parts.length > publicIndex + 2) {
                  oldPath = parts.slice(publicIndex + 2).join('/');
                } else {
                  const idx = article.image.indexOf('/images/');
                  if (idx !== -1) oldPath = article.image.substring(idx + 1);
                }
              } catch (e) {
                console.warn('Could not parse old image URL', e);
              }
            }

            if (oldPath) {
              const { error: delOldErr } = await supabase.storage.from('images').remove([oldPath.replace(/^\/+/, '')]);
              if (delOldErr) console.warn('Could not delete previous image before upload:', delOldErr.message || delOldErr);
            }
          } catch (e) {
            console.warn('Error while attempting to delete previous image:', e);
          }
        }

        const safeName = imageFile.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const filePath = `${Date.now()}_${safeName}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imageFile);
        if (uploadError) {
          setUploading(false);
          add('Errore upload immagine: ' + (uploadError.message || uploadError), 'error');
          return;
        }
        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        imageUrl = data?.publicUrl || '';
        imagePath = filePath;
      }

      const payload = { title, content, author, image: imageUrl };
      if (imagePath) payload.image_path = imagePath;

      if (article.id) {
        let res = await supabase.from('articles').update(payload).eq('id', article.id);
        if (res.error) {
          if (res.error.message && res.error.message.includes('column "image_path"')) {
            const { error: retryError } = await supabase.from('articles').update({ title, content, author, image: imageUrl }).eq('id', article.id);
            if (retryError) throw retryError;
          } else throw res.error;
        }
      } else {
        let res = await supabase.from('articles').insert([{ ...payload }]);
        if (res.error) {
          if (res.error.message && res.error.message.includes('column "image_path"')) {
            const { error: retryError } = await supabase.from('articles').insert([{ title, content, author, image: imageUrl }]);
            if (retryError) throw retryError;
          } else throw res.error;
        }
      }

      setUploading(false);
      add('Articolo salvato con successo', 'success');
      if (onDone) onDone();
    } catch (err) {
      setUploading(false);
      add(err.message || 'Errore durante il salvataggio', 'error');
    }
  };

  return (
    <div className="relative">
      {uploading && <OverlaySpinner message={article.id ? 'Modificando...' : 'Caricamento...'} />}

      <form onSubmit={handleSave} className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{article.id ? 'Modifica Articolo' : 'Crea Nuovo Articolo'}</h3>
            <button type="button" onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700">Chiudi</button>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titolo"
            className="p-3 border rounded-lg w-full"
            required
          />

          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Autore"
            className="p-3 border rounded-lg w-full"
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Immagine</label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-64 text-sm text-slate-500 file:bg-blue-600 file:text-white file:px-3 file:py-1 file:rounded"
                />
                {preview && (
                  <button
                    type="button"
                    onClick={clearSelectedImage}
                    aria-label="Rimuovi immagine"
                    className="absolute -top-2 -right-2 bg-white rounded-full shadow hover:bg-red-50 p-1 transition"
                    title="Rimuovi immagine"
                  >
                    <svg className="h-4 w-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {preview ? (
                <img src={preview} alt="preview" className="h-28 w-28 object-cover rounded-lg border" />
              ) : (
                <div className="h-28 w-28 rounded-lg border-dashed border flex items-center justify-center text-sm text-slate-400">
                  Nessuna
                </div>
              )}
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Contenuto"
            rows="10"
            className="p-3 border rounded-lg w-full resize-none"
            required
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg">Annulla</button>
            <button disabled={uploading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {uploading ? 'Salvando...' : article.id ? 'Aggiorna' : 'Pubblica'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;

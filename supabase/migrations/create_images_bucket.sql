-- Elimina il bucket esistente (se presente)
-- Prima elimina tutte le policy
DROP POLICY IF EXISTS "Allow public read access on images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their images" ON storage.objects;

-- Poi elimina tutti gli oggetti nel bucket
DELETE FROM storage.objects WHERE bucket_id = 'images';

-- Infine elimina il bucket
DELETE FROM storage.buckets WHERE id = 'images';

-- Crea il bucket 'images' per le immagini degli articoli e delle proprietà
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true, -- pubblico per permettere la visualizzazione diretta delle immagini
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
);

-- Policy per lettura pubblica (chiunque può vedere le immagini)
CREATE POLICY "Allow public read access on images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy per upload (solo utenti autenticati possono caricare)
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Policy per aggiornamento (solo utenti autenticati possono aggiornare)
CREATE POLICY "Allow authenticated users to update their images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

-- Policy per eliminazione (solo utenti autenticati possono eliminare)
CREATE POLICY "Allow authenticated users to delete their images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');

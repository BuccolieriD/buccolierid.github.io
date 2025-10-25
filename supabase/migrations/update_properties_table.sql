-- Migrazione per aggiornare la tabella properties esistente
-- Esegui questo script su Supabase SQL Editor

-- 1. Aggiungi il campo link_esterno se non esiste
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS link_esterno TEXT;

-- 2. Rinomina il campo metri in superficie se esiste
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'metri') THEN
        ALTER TABLE public.properties RENAME COLUMN metri TO superficie;
    END IF;
END $$;

-- 3. Aggiungi il campo superficie se non esiste (per il caso in cui non ci sia né metri né superficie)
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS superficie INTEGER;

-- 4. Assicurati che tutti i campi necessari esistano
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS titolo VARCHAR(200);

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS tipo VARCHAR(50);

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS prezzo INTEGER;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS citta VARCHAR(100);

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS indirizzo TEXT;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS descrizione TEXT;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS camere INTEGER;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS bagni INTEGER;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS piano INTEGER;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS totale_piani INTEGER;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS caratteristiche JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS immagini JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS anno_costruzione INTEGER;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS stato_conservazione VARCHAR(50);

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS classe_energetica VARCHAR(10);

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS spese_condominiali INTEGER DEFAULT 0;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS disponibile BOOLEAN DEFAULT true;

-- 5. Aggiungi constraints se non esistono
DO $$ 
BEGIN
    -- Check constraint per tipo
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'properties_tipo_check') THEN
        ALTER TABLE public.properties 
        ADD CONSTRAINT properties_tipo_check 
        CHECK (tipo IN ('Appartamento', 'Villa', 'Casa', 'Attico', 'Loft', 'Ufficio', 'Negozio', 'Terreno'));
    END IF;
    
    -- Check constraint per stato conservazione
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'properties_stato_conservazione_check') THEN
        ALTER TABLE public.properties 
        ADD CONSTRAINT properties_stato_conservazione_check 
        CHECK (stato_conservazione IN ('Nuovo', 'Ottimo', 'Buono', 'Da ristrutturare'));
    END IF;
    
    -- Check constraint per classe energetica
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'properties_classe_energetica_check') THEN
        ALTER TABLE public.properties 
        ADD CONSTRAINT properties_classe_energetica_check 
        CHECK (classe_energetica IN ('A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G'));
    END IF;
EXCEPTION
    WHEN others THEN
        -- Ignora errori se i constraints esistono già
        NULL;
END $$;

-- 6. Crea indici se non esistono
CREATE INDEX IF NOT EXISTS properties_tipo_idx ON public.properties(tipo);
CREATE INDEX IF NOT EXISTS properties_citta_idx ON public.properties(citta);
CREATE INDEX IF NOT EXISTS properties_prezzo_idx ON public.properties(prezzo);
CREATE INDEX IF NOT EXISTS properties_superficie_idx ON public.properties(superficie);
CREATE INDEX IF NOT EXISTS properties_disponibile_idx ON public.properties(disponibile);

-- 7. Trigger per updated_at (se non esiste già)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_updated_at ON public.properties;
CREATE TRIGGER properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 8. Assicurati che RLS sia abilitato
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- 9. Aggiorna policy esistenti o creale se non esistono
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;
CREATE POLICY "Properties are viewable by everyone" ON public.properties
    FOR SELECT USING (disponibile = true);

DROP POLICY IF EXISTS "Only authenticated users can insert properties" ON public.properties;
CREATE POLICY "Only authenticated users can insert properties" ON public.properties
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated users can update properties" ON public.properties;
CREATE POLICY "Only authenticated users can update properties" ON public.properties
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated users can delete properties" ON public.properties;
CREATE POLICY "Only authenticated users can delete properties" ON public.properties
    FOR DELETE USING (auth.role() = 'authenticated');

-- 10. Messaggio di conferma
SELECT 'Migrazione completata con successo!' as status;
-- Crea la tabella properties per gestire le proprietà in vendita
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Campi obbligatori
    titolo VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Appartamento', 'Villa', 'Casa', 'Attico', 'Loft', 'Ufficio', 'Negozio', 'Terreno')),
    prezzo INTEGER NOT NULL CHECK (prezzo > 0),
    superficie INTEGER NOT NULL CHECK (superficie > 0), -- Rinominato da metri a superficie
    citta VARCHAR(100) NOT NULL,
    indirizzo TEXT NOT NULL,
    descrizione TEXT NOT NULL,
    
    -- Campi opzionali - caratteristiche fisiche
    camere INTEGER CHECK (camere >= 0),
    bagni INTEGER CHECK (bagni >= 0),
    piano INTEGER,
    totale_piani INTEGER,
    
    -- Campi opzionali - dettagli aggiuntivi
    caratteristiche JSONB DEFAULT '[]'::jsonb, -- Array di caratteristiche
    anno_costruzione INTEGER,
    stato_conservazione VARCHAR(50) CHECK (stato_conservazione IN ('Nuovo', 'Ottimo', 'Buono', 'Da ristrutturare')),
    classe_energetica VARCHAR(10) CHECK (classe_energetica IN ('A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G')),
    spese_condominiali INTEGER DEFAULT 0,
    
    -- Media - immagini multiple
    immagini JSONB DEFAULT '[]'::jsonb, -- Array di URLs delle immagini
    
    -- Link esterno (es. Idealista)
    link_esterno TEXT, -- URL al sito esterno
    
    -- Flag disponibilità (sempre true di default)
    disponibile BOOLEAN DEFAULT true,
    
    -- Coordinate geografiche (opzionali)
    latitudine DECIMAL(10, 8),
    longitudine DECIMAL(11, 8)
);

-- Indici per migliorare le performance
CREATE INDEX IF NOT EXISTS properties_tipo_idx ON public.properties(tipo);
CREATE INDEX IF NOT EXISTS properties_citta_idx ON public.properties(citta);
CREATE INDEX IF NOT EXISTS properties_prezzo_idx ON public.properties(prezzo);
CREATE INDEX IF NOT EXISTS properties_superficie_idx ON public.properties(superficie);
CREATE INDEX IF NOT EXISTS properties_camere_idx ON public.properties(camere);
CREATE INDEX IF NOT EXISTS properties_disponibile_idx ON public.properties(disponibile);
CREATE INDEX IF NOT EXISTS properties_created_at_idx ON public.properties(created_at DESC);

-- Trigger per aggiornare automaticamente updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Abilita RLS (Row Level Security)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Policy per la lettura: tutti possono leggere le proprietà disponibili
CREATE POLICY "Properties are viewable by everyone" ON public.properties
    FOR SELECT USING (disponibile = true);

-- Policy per inserimento/aggiornamento: solo utenti autenticati
CREATE POLICY "Only authenticated users can insert properties" ON public.properties
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update properties" ON public.properties
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete properties" ON public.properties
    FOR DELETE USING (auth.role() = 'authenticated');

-- Inserisci alcuni dati di esempio
INSERT INTO public.properties (
    titolo, tipo, prezzo, superficie, citta, indirizzo, descrizione, 
    camere, bagni, piano, totale_piani, caratteristiche, immagini, 
    anno_costruzione, stato_conservazione, classe_energetica, spese_condominiali, 
    link_esterno
) VALUES 
(
    'Elegante Appartamento nel Centro di Milano',
    'Appartamento', 250000, 95, 'Milano', 'Via Roma 123',
    'Elegante appartamento nel centro di Milano, completamente ristrutturato con finiture di pregio. Luminoso e ben distribuito, ideale per chi cerca comfort e stile nel cuore della città.',
    3, 2, 3, 5,
    '["Terrazzo", "Aria condizionata", "Parcheggio", "Riscaldamento autonomo", "Infissi nuovi"]'::jsonb,
    '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]'::jsonb,
    2015, 'Ottimo', 'B', 150,
    'https://www.idealista.it/immobile/123456'
),
(
    'Villa Indipendente con Giardino Privato',
    'Villa', 450000, 180, 'Roma', 'Via dei Pini 45',
    'Villa indipendente con giardino privato in zona residenziale. Distribuita su due livelli con ampi spazi interni ed esterni. Perfetta per famiglie che desiderano tranquillità e privacy.',
    4, 3, 0, 2,
    '["Giardino", "Garage", "Cantina", "Camino", "Barbecue", "Piscina"]'::jsonb,
    '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"]'::jsonb,
    2005, 'Buono', 'C', 0,
    'https://www.idealista.it/immobile/789012'
),
(
    'Appartamento Moderno Zona Ben Servita',
    'Appartamento', 180000, 70, 'Torino', 'Corso Francia 78',
    'Appartamento moderno in zona ben servita dai mezzi pubblici. Ideale per giovani coppie o investimento. Vicino a università e servizi.',
    2, 1, 2, 4,
    '["Balcone", "Ascensore", "Riscaldamento autonomo", "Vicino metro"]'::jsonb,
    '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]'::jsonb,
    2018, 'Nuovo', 'A2', 80,
    'https://www.idealista.it/immobile/345678'
),
(
    'Casa Storica nel Centro di Firenze',
    'Casa', 320000, 120, 'Firenze', 'Via del Borgo 12',
    'Casa storica nel centro di Firenze con vista panoramica sulla città. Caratteristiche architettoniche originali conservate. Un pezzo di storia fiorentina.',
    3, 2, 0, 3,
    '["Centro storico", "Vista panoramica", "Soffitti affrescati", "Travi a vista", "Terrazza"]'::jsonb,
    '["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"]'::jsonb,
    1800, 'Da ristrutturare', 'G', 200,
    'https://www.idealista.it/immobile/901234'
);
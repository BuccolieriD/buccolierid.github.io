# Guida ai Link Diretti del Blog

## Come funziona

Il tuo sito ora supporta i link diretti agli articoli del blog! Ecco come utilizzare questa funzionalità:

## Formato del Link

I link diretti agli articoli seguono questo formato:
```
https://buccolierid.github.io/blog?article=ID_ARTICOLO
```

Dove `ID_ARTICOLO` è l'ID numerico dell'articolo nel database.

## Esempi di Utilizzo

### Esempio 1: Link diretto a un articolo
```
https://buccolierid.github.io/blog?article=123
```

### Esempio 2: Condivisione sui social
Puoi utilizzare questi link per condividere articoli specifici su:
- Facebook
- Twitter
- LinkedIn
- WhatsApp
- Email

## Come Ottenere il Link

### Metodo 1: Pulsante "Copia Link" sulle card
1. Vai alla pagina del blog
2. Trova l'articolo che vuoi condividere
3. Clicca sul pulsante "📋 Copia Link" sulla card dell'articolo
4. Il link verrà copiato negli appunti

### Metodo 2: Dalla modale dell'articolo
1. Apri un articolo cliccando sulla sua card
2. Nella modale che si apre, clicca "📋 Copia Link Diretto"
3. Il link verrà copiato negli appunti

### Metodo 3: Dall'URL del browser
1. Apri un articolo
2. Copia l'URL dalla barra degli indirizzi del browser
3. Questo URL conterrà automaticamente il parametro `?article=ID`

## Comportamento

- **Apertura automatica**: Quando qualcuno visita un link diretto, l'articolo si aprirà automaticamente in modalità modale
- **Gestione errori**: Se l'articolo non esiste, l'utente verrà reindirizzato alla pagina blog normale con un messaggio di errore
- **URL pulito**: Quando si chiude la modale, l'URL torna a `/blog` senza parametri

## Utilizzi Pratici

1. **Newsletter**: Includi link diretti negli articoli della tua newsletter
2. **Social Media**: Condividi articoli specifici sui tuoi social
3. **Email**: Invia link diretti via email ai tuoi contatti
4. **SEO**: I link diretti migliorano la condivisibilità del contenuto

## Note Tecniche

- I link funzionano sia in sviluppo che in produzione
- L'ID dell'articolo deve essere un numero valido
- Il parametro viene gestito tramite React Router
- La funzionalità è compatibile con il tuo setup attuale (React + Supabase)
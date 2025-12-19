import React, { useState, useEffect } from 'react';

const DISMISSED_KEY = 'pwa-dismissed';
const INSTALLED_KEY = 'pwa-installed';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Se l'utente ha già installato o ha deciso di non mostrare, non mostrare il banner
    const alreadyInstalled = localStorage.getItem(INSTALLED_KEY) === '1';
    const dismissed = localStorage.getItem(DISMISSED_KEY) === '1';
    if (alreadyInstalled || dismissed) return;

    // Ascolta l'evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      // se l'utente ha già installato o ha dismissato, non fare nulla
      if (localStorage.getItem(INSTALLED_KEY) === '1' || localStorage.getItem(DISMISSED_KEY) === '1') return;

      // Previeni il mini-infobar automatico del browser
      e.preventDefault();
      // Salva l'evento per attivarlo più tardi
      setDeferredPrompt(e);
      // Mostra il banner di installazione personalizzato
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Ascolta l'evento quando l'app viene effettivamente installata (es. dall'OS)
  useEffect(() => {
    const onAppInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, '1');
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', onAppInstalled);
    return () => window.removeEventListener('appinstalled', onAppInstalled);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostra il prompt di installazione
    deferredPrompt.prompt();

    // Aspetta la scelta dell'utente
    const choiceResult = await deferredPrompt.userChoice;
    const outcome = choiceResult?.outcome;

    // Se ha accettato, segna come installato
    if (outcome === 'accepted') {
      localStorage.setItem(INSTALLED_KEY, '1');
      localStorage.removeItem(DISMISSED_KEY);
    } else {
      // Se rifiuta, salva la scelta di non disturbare ulteriormente
      localStorage.setItem(DISMISSED_KEY, '1');
    }

    // Nascondi il banner e resetta
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    // Salva in localStorage per non mostrare di nuovo (persistente)
    localStorage.setItem(DISMISSED_KEY, '1');
    setShowInstallBanner(false);
  };

  // Non mostrare il banner se l'utente ha già installato o ha dismissato
  useEffect(() => {
    const installed = localStorage.getItem(INSTALLED_KEY) === '1';
    const dismissed = localStorage.getItem(DISMISSED_KEY) === '1';
    if (installed || dismissed) {
      setShowInstallBanner(false);
    }
  }, []);

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow-2xl p-4 z-50 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg p-2">
          <img src="/logo.png" alt="Jackowski Immobiliare" className="w-full h-full object-contain" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Installa l'App</h3>
          <p className="text-sm text-blue-100 mb-3">
            Aggiungi JCK Immobiliare alla tua home screen per un accesso rapido!
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
            >
              Installa
            </button>
            
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-blue-700/50 hover:bg-blue-700 rounded-lg transition-colors duration-300"
              aria-label="Chiudi installazione PWA"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;

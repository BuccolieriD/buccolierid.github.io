import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';
import Toast from './Toast';

const PropertyForm = ({ isOpen, onClose, propertyToEdit = null, onPropertySaved }) => {
  const [formData, setFormData] = useState({
    // Campi obbligatori
    titolo: '',
    tipo: '',
    prezzo: '',
    superficie: '',
    citta: '',
    indirizzo: '',
    descrizione: '',
    
    // Campi opzionali
    camere: '',
    bagni: '',
    piano: '',
    totale_piani: '',
    anno_costruzione: '',
    stato_conservazione: '',
    classe_energetica: '',
    spese_condominiali: '',
    
    // Arrays
    caratteristiche: [],
    immagini: [], // URLs delle immagini caricate
    
    // Link esterno
    link_esterno: ''
  });

  const [newCaratteristica, setNewCaratteristica] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const tipiProprieta = ['Appartamento', 'Villa', 'Casa', 'Attico', 'Loft', 'Ufficio', 'Negozio', 'Terreno'];
  const statiConservazione = ['Nuovo', 'Ottimo', 'Buono', 'Da ristrutturare'];
  const classiEnergetiche = ['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G'];

  // Popola il form quando si modifica una proprietà
  useEffect(() => {
    if (propertyToEdit) {
      setFormData({
        titolo: propertyToEdit.titolo || '',
        tipo: propertyToEdit.tipo || '',
        prezzo: propertyToEdit.prezzo || '',
        superficie: propertyToEdit.superficie || '',
        citta: propertyToEdit.citta || '',
        indirizzo: propertyToEdit.indirizzo || '',
        descrizione: propertyToEdit.descrizione || '',
        camere: propertyToEdit.camere || '',
        bagni: propertyToEdit.bagni || '',
        piano: propertyToEdit.piano || '',
        totale_piani: propertyToEdit.totale_piani || '',
        anno_costruzione: propertyToEdit.anno_costruzione || '',
        stato_conservazione: propertyToEdit.stato_conservazione || '',
        classe_energetica: propertyToEdit.classe_energetica || '',
        spese_condominiali: propertyToEdit.spese_condominiali || '',
        caratteristiche: propertyToEdit.caratteristiche || [],
        immagini: propertyToEdit.immagini || [],
        link_esterno: propertyToEdit.link_esterno || ''
      });
    } else {
      // Reset form per nuova proprietà
      setFormData({
        titolo: '',
        tipo: '',
        prezzo: '',
        superficie: '',
        citta: '',
        indirizzo: '',
        descrizione: '',
        camere: '',
        bagni: '',
        piano: '',
        totale_piani: '',
        anno_costruzione: '',
        stato_conservazione: '',
        classe_energetica: '',
        spese_condominiali: '',
        caratteristiche: [],
        immagini: [],
        link_esterno: ''
      });
      setSelectedFiles([]);
    }
  }, [propertyToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gestione upload immagini
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];

    setUploadingImages(true);
    const uploadedUrls = [];

    try {
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `property_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Errore upload immagini:', error);
      setToast({
        show: true,
        message: 'Errore durante l\'upload delle immagini: ' + error.message,
        type: 'error'
      });
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      immagini: prev.immagini.filter((_, i) => i !== index)
    }));
  };

  // Gestione caratteristiche
  const addCaratteristica = () => {
    if (newCaratteristica.trim()) {
      setFormData(prev => ({
        ...prev,
        caratteristiche: [...prev.caratteristiche, newCaratteristica.trim()]
      }));
      setNewCaratteristica('');
    }
  };

  const removeCaratteristica = (index) => {
    setFormData(prev => ({
      ...prev,
      caratteristiche: prev.caratteristiche.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const required = ['titolo', 'tipo', 'prezzo', 'superficie', 'citta', 'indirizzo', 'descrizione'];
    const missing = required.filter(field => !formData[field]);
    
    if (missing.length > 0) {
      setToast({
        show: true,
        message: `Campi obbligatori mancanti: ${missing.join(', ')}`,
        type: 'error'
      });
      return false;
    }

    if (isNaN(formData.prezzo) || formData.prezzo <= 0) {
      setToast({
        show: true,
        message: 'Il prezzo deve essere un numero positivo',
        type: 'error'
      });
      return false;
    }

    if (isNaN(formData.superficie) || formData.superficie <= 0) {
      setToast({
        show: true,
        message: 'La superficie deve essere un numero positivo',
        type: 'error'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Upload nuove immagini se presenti
      let newImageUrls = [];
      if (selectedFiles.length > 0) {
        newImageUrls = await uploadImages();
        if (newImageUrls.length === 0 && selectedFiles.length > 0) {
          // Errore durante upload
          return;
        }
      }

      // Combina immagini esistenti con quelle nuove
      const allImages = [...formData.immagini, ...newImageUrls];

      // Prepara i dati puliti
      const cleanData = {
        ...formData,
        prezzo: parseInt(formData.prezzo),
        superficie: parseInt(formData.superficie),
        camere: formData.camere ? parseInt(formData.camere) : null,
        bagni: formData.bagni ? parseInt(formData.bagni) : null,
        piano: formData.piano ? parseInt(formData.piano) : null,
        totale_piani: formData.totale_piani ? parseInt(formData.totale_piani) : null,
        anno_costruzione: formData.anno_costruzione ? parseInt(formData.anno_costruzione) : null,
        spese_condominiali: formData.spese_condominiali ? parseInt(formData.spese_condominiali) : null,
        stato_conservazione: formData.stato_conservazione || null,
        classe_energetica: formData.classe_energetica || null,
        immagini: allImages,
        link_esterno: formData.link_esterno || null
      };

      let result;
      if (propertyToEdit) {
        // Aggiorna proprietà esistente
        result = await supabase
          .from('properties')
          .update(cleanData)
          .eq('id', propertyToEdit.id)
          .select();
      } else {
        // Crea nuova proprietà
        result = await supabase
          .from('properties')
          .insert([cleanData])
          .select();
      }

      if (result.error) throw result.error;

      setToast({
        show: true,
        message: propertyToEdit ? 'Proprietà aggiornata con successo!' : 'Proprietà creata con successo!',
        type: 'success'
      });

      if (onPropertySaved) {
        onPropertySaved();
      }

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Errore nel salvare la proprietà:', error);
      setToast({
        show: true,
        message: 'Errore nel salvare la proprietà: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {propertyToEdit ? 'Modifica Proprietà' : 'Nuova Proprietà'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* CAMPI OBBLIGATORI */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-800 mb-4">Campi Obbligatori *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titolo *
                </label>
                <input
                  type="text"
                  name="titolo"
                  value={formData.titolo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleziona tipo</option>
                  {tipiProprieta.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prezzo (€) *
                </label>
                <input
                  type="number"
                  name="prezzo"
                  value={formData.prezzo}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Superficie (mq) *
                </label>
                <input
                  type="number"
                  name="superficie"
                  value={formData.superficie}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Città *
                </label>
                <input
                  type="text"
                  name="citta"
                  value={formData.citta}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Indirizzo *
                </label>
                <input
                  type="text"
                  name="indirizzo"
                  value={formData.indirizzo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrizione *
              </label>
              <textarea
                name="descrizione"
                value={formData.descrizione}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* CAMPI OPZIONALI */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Dettagli Aggiuntivi (Opzionali)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Camere</label>
                <input
                  type="number"
                  name="camere"
                  value={formData.camere}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bagni</label>
                <input
                  type="number"
                  name="bagni"
                  value={formData.bagni}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Piano</label>
                <input
                  type="number"
                  name="piano"
                  value={formData.piano}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tot. Piani</label>
                <input
                  type="number"
                  name="totale_piani"
                  value={formData.totale_piani}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Anno</label>
                <input
                  type="number"
                  name="anno_costruzione"
                  value={formData.anno_costruzione}
                  onChange={handleInputChange}
                  min="1800"
                  max="2025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spese Cond. (€)</label>
                <input
                  type="number"
                  name="spese_condominiali"
                  value={formData.spese_condominiali}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
                <select
                  name="stato_conservazione"
                  value={formData.stato_conservazione}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleziona stato</option>
                  {statiConservazione.map(stato => (
                    <option key={stato} value={stato}>{stato}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classe Energetica</label>
                <select
                  name="classe_energetica"
                  value={formData.classe_energetica}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleziona classe</option>
                  {classiEnergetiche.map(classe => (
                    <option key={classe} value={classe}>{classe}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* UPLOAD IMMAGINI */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-4">Immagini</h3>
            
            {/* Immagini esistenti */}
            {formData.immagini.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Immagini attuali:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.immagini.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Immagine ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Upload nuove immagini */}
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Aggiungi nuove immagini
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {selectedFiles.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {selectedFiles.length} file selezionati
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Formati supportati: JPG, PNG, GIF. Max 5MB per file.
              </p>
            </div>
          </div>

          {/* CARATTERISTICHE */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-4">Caratteristiche</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Aggiungi caratteristica..."
                value={newCaratteristica}
                onChange={(e) => setNewCaratteristica(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCaratteristica())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={addCaratteristica}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Aggiungi
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.caratteristiche.map((caratteristica, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {caratteristica}
                  <button
                    type="button"
                    onClick={() => removeCaratteristica(index)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* LINK ESTERNO */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-4">Link Esterno</h3>
            <input
              type="url"
              name="link_esterno"
              value={formData.link_esterno}
              onChange={handleInputChange}
              placeholder="https://www.idealista.it/immobile/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-sm text-purple-600 mt-1">
              Link alla pagina della proprietà su Idealista o altro sito
            </p>
          </div>

          {/* BOTTONI */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading || uploadingImages}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isLoading || uploadingImages}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {(isLoading || uploadingImages) && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {uploadingImages ? 'Caricamento...' : (propertyToEdit ? 'Aggiorna' : 'Crea')} Proprietà
            </button>
          </div>
        </form>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
};

export default PropertyForm;
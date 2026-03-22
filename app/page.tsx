"use client";

import { useState } from "react";
import { OfficialDocument } from "./components/OfficialDocument";

// Type pour les données de l'acte
interface ActeData {
  structured: {
    nom: string;
    prenoms: string;
    date_naissance: string;
    lieu_naissance: string;
    pere: string;
    mere: string;
  };
  main_content:{
    narrative_paragraphes: string;
  };
  sidebar_left:{
    top_mention: string;
  };
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"upload" | "edit" | "print">("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [data, setData] = useState<ActeData | null>(null);
  const [isEditingFullText, setIsEditingFullText] = useState(false);

  // 1. Gestion de l'Upload et appel IA
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setPreviewUrl(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = reader.result?.toString().split(",")[1];

      try {
        const response = await fetch("/api/ocr", {
          method: "POST",
          body: JSON.stringify({ image: base64Data }),
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        
        if (result.extractedData) {
          setData(result.extractedData);
          setStep("edit");
        }
      } catch (error) {
        alert("Erreur lors de l'analyse du document.");
      } finally {
        setLoading(false);
      }
    };
  };

  // 2. Mise à jour manuelle des données (Correction humaine)
  const handleChange = (section: keyof ActeData, field: string, value: string) => {
    if (!data) return;
    setData({
      ...data,
      [section]: {
        ...data[section],
        [field]: value
      }
    });
  };

  if (step === "upload") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-black">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-2 text-center italic">Soratra AI</h1>
          <p className="text-gray-500 text-center mb-8">Numérisation des archives malagasy</p>
          
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer hover:bg-blue-50 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-12 h-12 mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="mb-2 text-sm text-gray-700 font-semibold uppercase">
                {loading ? "Analyse par l'IA..." : "Choisir un acte à scanner"}
              </p>
            </div>
            <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={loading} />
          </label>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Barre d'outils (Cachée à l'impression) */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6 print:hidden">
        <button 
          onClick={() => setStep("upload")}
          className="text-gray-600 hover:text-black flex items-center gap-2"
        >
          ← Retour
        </button>
        
        <div className="flex gap-4">
          {step === "edit" ? (
            <button 
              onClick={() => setStep("print")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg"
            >
              Générer la Copie Officielle
            </button>
          ) : (
            <>
              <button 
                onClick={() => setStep("edit")}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-bold hover:bg-gray-300"
              >
                Modifier les données
              </button>
              <button 
                onClick={() => window.print()}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 shadow-lg"
              >
                Imprimer (PDF)
              </button>
            </>
          )}
        </div>
      </div>

      {/* MODE ÉDITION : Côte à côte */}
      {step === "edit" && data && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 print:hidden text-black">
          {/* Gauche : Formulaire de correction */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Vérification des données</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Nom</label>
                <input type="text" value={data.structured.nom} onChange={(e) => handleChange("structured","nom", e.target.value)} className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Prénoms</label>
                <input type="text" value={data.structured.prenoms} onChange={(e) => handleChange("structured","prenoms", e.target.value)} className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Date de Naissance</label>
                <input type="text" value={data.structured.date_naissance} onChange={(e) => handleChange("structured","date_naissance", e.target.value)} className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Lieu</label>
                <input type="text" value={data.structured.lieu_naissance} onChange={(e) => handleChange("structured","lieu_naissance", e.target.value)} className="w-full border p-2 rounded mt-1" />
              </div>
            </div>
            <div>
  <label className="text-[10px] font-bold text-gray-400 uppercase flex justify-between">
    Transcription Complète (Full Text)
    <span className="text-blue-600 cursor-pointer" onClick={() => setIsEditingFullText(true)}>Zoomer ⛶</span>
  </label>
  
  <textarea 
    rows={8} 
    spellCheck="false" // <--- ENLÈVE LE SOULIGNEMENT ROUGE
    value={data.main_content.narrative_paragraphes} 
    onChange={(e) => handleChange("main_content", "narrative_paragraphes", e.target.value)} 
    className="w-full border p-4 rounded mt-1 text-sm leading-relaxed bg-gray-50 focus:bg-white transition-all cursor-zoom-in"
    onClick={() => setIsEditingFullText(true)} // Ouvre le grand éditeur au clic
    readOnly // On ne modifie que dans le modal pour plus de confort
  />
</div>

{/* MODAL D'ÉDITION PLEIN ÉCRAN */}
{isEditingFullText && (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h3 className="font-bold italic">Éditeur de texte - Mode Feuille A4</h3>
        <button 
          onClick={() => setIsEditingFullText(false)}
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700"
        >
          Valider et Fermer
        </button>
      </div>
      
      {/* L'éditeur qui ressemble à une feuille */}
      <textarea
        autoFocus
        spellCheck="false"
        value={data.main_content.narrative_paragraphes}
        onChange={(e) => handleChange("main_content", "narrative_paragraphes", e.target.value)}
        className="grow p-12 text-lg leading-loose outline-none resize-none font-serif text-justify"
        placeholder="Tapez le texte ici comme sur l'acte original..."
        style={{ backgroundImage: "linear-gradient(#f1f1f1 1px, transparent 1px)", backgroundSize: "100% 2rem" }}
      />
    </div>
  </div>
)}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Mentions Marginales</label>
              <textarea rows={2} value={data.sidebar_left.top_mention} onChange={(e) => handleChange("sidebar_left","top_mention", e.target.value)} className="w-full border p-2 rounded mt-1 text-sm bg-yellow-50" />
            </div>
          </div>

          {/* Droite : Image originale pour comparaison */}
          <div className="bg-gray-200 rounded-xl overflow-hidden h-150 sticky top-8">
            <p className="bg-black/50 text-white text-xs p-2 absolute top-0 w-full text-center">Document Original (Scan)</p>
            {previewUrl && <img src={previewUrl} alt="Original" className="w-full h-full object-contain" />}
          </div>
        </div>
      )}

      {/* MODE IMPRESSION : L'acte officiel */}
      {step === "print" && data && (
        <div className="animate-in fade-in zoom-in duration-300">
           <OfficialDocument data={data} />
        </div>
      )}
    </main>
  );
}
//gemini-robotics-er-1.5-preview
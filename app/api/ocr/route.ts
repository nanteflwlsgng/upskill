import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
    Tu es un expert en paléographie et archivage malgache. Analyse cet acte de naissance et segmente-le en blocs logiques pour une reconstruction fidèle. 
    
    Réponds UNIQUEMENT en JSON avec cette structure :
    {
        "structured": {
            "nom": "...",
            "prenoms": "...",
            "date_naissance": "...",
            "lieu_naissance": "...",
            "pere": "...",
            "mere": "..."
          },
      "metadata": {
        "commune": "...",
        "region": "...",
        "num_acte": "...",
        "annee": "..."
      },
      "sidebar_left": {
        "top_mention": "Le 'Teny midina...' ou texte administratif tout en haut",
        "authority": "Ex: Kaominina Ambonivohitra Fianarantsoa",
        "id_details": "Bloc contenant Faha, Tamin'ny, etc.",
        "identity_section": "Le bloc Fahaterahana avec Nom et Prénoms",
        "stamp_mentions": "Le texte type 'Tsy asiana hajia...'",
        "marginal_notes": "Le 'Soratra an-tsisiny' en bas à gauche"
      },
      "main_content": {
        "title": "Le titre exact (ex: KOPIAN'NY SORA-PIANKOHONANA)",
        "narrative_paragraphes": [
          "Paragraphe 1 (Nalaina tamin'ny...)",
          "Paragraphe 2 (Tamin'ny dimy amby roapolo...)",
          "Paragraphe 3 (Nosoratana androany...)"
        ],
        "closing_text": "Le texte de clôture avant les signatures sans oublier les titre comme :"MANARAKA NY SONIA, etc" avant le texte de cloture. "
      },
      "footer": {
        "date_signature": "...",
        "signataire_nom": "...",
        "signataire_titre": "..."
      },
      "layout_hint": {
        "has_sidebar": true,
        "column_ratio": "1:2"
      }
    }
  
    IMPORTANT : Transcris le malgache exactement comme écrit. Si un bloc n'existe pas sur l'image, mets null.
  `;



    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Nettoyage de la réponse (Gemini entoure parfois le JSON de ```json ... ```)
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const extractedData = JSON.parse(cleanJson);

    return NextResponse.json({ extractedData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de l'analyse" }, { status: 500 });
  }
}
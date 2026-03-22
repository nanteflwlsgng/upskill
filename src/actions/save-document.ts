"use server";

import { db } from "../lib/db";
import { documents } from "../lib/db/schema";
import { revalidatePath } from "next/cache";

export async function saveDocumentAction(payload: any, imageUrl: string) {
  try {
    // 1. On extrait les données de recherche du JSON pour les mettre dans leurs colonnes
    const { metadata } = payload;
    
    const newDoc = await db.insert(documents).values({
      nom: metadata?.nom || "INCONNU",
      prenoms: metadata?.prenoms || "INCONNU",
      commune: metadata?.commune || "NON SPECIFIÉ",
      numActe: metadata?.num_acte,
      annee: metadata?.annee ? parseInt(metadata.annee) : null,
      imageUrl: imageUrl,
      contentJson: payload, // Le JSON complet (sidebar, main_content, etc.)
      status: "validated",
    }).returning();

    // 2. On rafraîchit la page des archives (qu'on créera après)
    revalidatePath("/archives");

    return { success: true, docId: newDoc[0].id };
  } catch (error) {
    console.error("Erreur sauvegarde:", error);
    return { success: false, error: "Erreur lors de l'enregistrement" };
  }
}
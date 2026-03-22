import { pgTable, serial, text, timestamp, varchar, jsonb, integer } from "drizzle-orm/pg-core";

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  
  // --- CHAMPS DE RECHERCHE (Extraits du JSON pour SQL) ---
  nom: varchar("nom", { length: 255 }),
  prenoms: varchar("prenoms", { length: 255 }),
  commune: varchar("commune", { length: 255 }),
  numActe: varchar("num_acte", { length: 50 }),
  annee: integer("annee"), // Pour filtrer par année facilement

  // --- STOCKAGE COMPLET ---
  imageUrl: text("image_url").notNull(), 
  
  // stockage de  l'intégralité du résultat de l'IA  (sidebar, paragraphs, etc.)
  // C'est ce qui pouvoir de reconstruire le document dynamiquement
  contentJson: jsonb("content_json").notNull(), 

  status: varchar("status", { length: 50 }).default("draft"), // draft, validated, archived
  
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Table pour l'audit (Sécurité : qui a fait quoi ?)
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  userId: text("user_id"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
});
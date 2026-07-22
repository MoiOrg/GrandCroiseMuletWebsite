"use server";

import { headers } from "next/headers";
import type { RegistrationData } from "../src/lib/validations";

export async function submitRegistration(data: RegistrationData) {
  // 1. On récupère les en-têtes (headers) de la requête entrante
  const headersList = await headers();
  
  // 2. On extrait l'IP (x-forwarded-for est le standard utilisé par Vercel)
  const ipAddress = headersList.get("x-forwarded-for") || "127.0.0.1 (Local)";
  
  // 3. On génère le timestamp côté SERVEUR (infalsifiable)
  const timestamp = new Date().toISOString();

  // 4. On affiche tout ça dans ton terminal de développement
  console.log("\n=== 🚀 NOUVELLE INSCRIPTION VALIDE ===");
  console.log("👤 Données du joueur :", data);
  console.log("🌐 Adresse IP capturée :", ipAddress);
  console.log("🕒 Horodatage légal :", timestamp);
  console.log("=======================================\n");

  // On renvoie un signal de succès au Front-end
  return { success: true };
}
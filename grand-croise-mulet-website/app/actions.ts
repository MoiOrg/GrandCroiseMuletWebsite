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

const FAKE_CLIENTS_DB = [
  { id: 1, email: "jean@salon.com", phone: "0601020304", has_sponsored: false },
  { id: 2, email: "marie@salon.com", phone: "0611223344", has_sponsored: true }, // Marie a déjà un filleul !
  { id: 3, email: "paul@salon.com", phone: "0699887766", has_sponsored: false },
];

// 2. L'ACTION SERVEUR DE VÉRIFICATION
export async function verifySponsor(identifier: string) {
  // On simule un petit temps de chargement réseau (500ms) pour faire réaliste
  await new Promise(resolve => setTimeout(resolve, 500));

  // On cherche si l'email ou le téléphone saisi correspond à un client
  const sponsor = FAKE_CLIENTS_DB.find(
    (client) => client.email === identifier.toLowerCase() || client.phone === identifier.replace(/\s/g, "")
  );

  if (!sponsor) {
    return { 
      success: false, 
      message: "Aucun client trouvé avec cet e-mail ou numéro de téléphone." 
    };
  }

  if (sponsor.has_sponsored) {
    return { 
      success: false, 
      message: "Désolé, ce client a déjà parrainé quelqu'un (Limite de 1 filleul par client)." 
    };
  }

  return { success: true, message: "Parrain valide !" };
}
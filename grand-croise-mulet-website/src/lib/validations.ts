import { z } from "zod";

export const registrationSchema = z.object({
  role: z.enum(["CLIENT", "FILLEUL"], {
    message: "Vous devez préciser si vous êtes client ou filleul.",
  }),
  // sponsorInfo n'est requis que si la personne est un filleul
  sponsorInfo: z.string().optional(), 
  
  firstName: z.string().min(2, "Le prénom est trop court"),
  lastName: z.string().min(2, "Le nom est trop court"),
  dob: z.string().min(1, "La date de naissance est requise"),
  email: z.string().email("L'adresse e-mail n'est pas valide"),
  phone: z.string().min(10, "Le numéro de téléphone n'est pas valide"),
  zipCode: z.string().min(5, "Le code postal doit contenir 5 chiffres"),
  
  acceptedWaiver: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter la décharge de responsabilité pour participer.",
  }),
});

// On exporte le type TypeScript généré automatiquement à partir du schéma Zod
export type RegistrationData = z.infer<typeof registrationSchema>;
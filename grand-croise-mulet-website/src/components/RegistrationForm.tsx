"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationData } from "../lib/validations";
import { submitRegistration, verifySponsor } from "../../app/actions";

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false); // Pour l'état de chargement
  const [sponsorError, setSponsorError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch, // Ajout de watch pour écouter les changements
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      role: "CLIENT",
      acceptedWaiver: false,
    },
  });

  const role = watch("role"); // On observe si l'utilisateur choisit CLIENT ou FILLEUL
  const sponsorInfo = watch("sponsorInfo");

  const processForm = async (data: RegistrationData) => {
    // Au lieu de l'afficher dans le navigateur, on l'envoie au serveur
    const response = await submitRegistration(data);
    
    // Si le serveur nous dit que tout est ok, on passe à la page de succès
    if (response.success) {
      setCurrentStep(4);
    }
  };

  const nextStep = async () => {
    let isStepValid = true;
    setSponsorError(null);

    if (currentStep === 1) {
      isStepValid = await trigger(["role"]);
      
      // LOGIQUE MÉTIER : Vérification du parrain
      if (isStepValid && role === "FILLEUL") {
        if (!sponsorInfo) {
          setSponsorError("Veuillez indiquer l'e-mail ou le téléphone de votre parrain.");
          return; // On bloque
        }
        
        setIsVerifying(true);
        const result = await verifySponsor(sponsorInfo);
        setIsVerifying(false);

        if (!result.success) {
          setSponsorError(result.message);
          return; // On bloque et on affiche l'erreur du serveur
        }
      }
    } else if (currentStep === 2) {
      isStepValid = await trigger(["firstName", "lastName", "dob", "email", "phone", "zipCode"]);
    }

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Classe CSS réutilisable pour nos inputs
  const inputClass = "w-full mt-1 px-4 py-2 bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
      <div className="mb-8 text-sm font-medium text-neutral-500 flex justify-between">
        <span className={currentStep === 1 ? "text-blue-600 font-bold" : ""}>1. Statut</span>
        <span className={currentStep === 2 ? "text-blue-600 font-bold" : ""}>2. Infos</span>
        <span className={currentStep === 3 ? "text-blue-600 font-bold" : ""}>3. Décharge</span>
        <span className={currentStep === 4 ? "text-blue-600 font-bold" : ""}>4. Isomaps</span>
      </div>

      <form onSubmit={handleSubmit(processForm)} className="space-y-6">
        
        {/* ÉTAPE 1 : Choix du rôle */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <h2 className="text-2xl font-bold mb-4">Êtes-vous client du salon ?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option Client */}
              <label className={`relative flex flex-col p-5 border-2 rounded-xl cursor-pointer transition-all ${role === 'CLIENT' ? 'border-blue-600 bg-blue-50' : 'border-neutral-200 hover:border-blue-300 bg-white'}`}>
                <input type="radio" value="CLIENT" {...register("role")} className="sr-only" />
                <span className="font-bold text-neutral-900 text-lg mb-1">Oui, je suis client</span>
                <span className="text-sm text-neutral-500">Je m'inscris directement à l'événement.</span>
                {role === 'CLIENT' && <div className="absolute top-5 right-5 w-4 h-4 bg-blue-600 rounded-full ring-4 ring-blue-100"></div>}
              </label>

              {/* Option Filleul */}
              <label className={`relative flex flex-col p-5 border-2 rounded-xl cursor-pointer transition-all ${role === 'FILLEUL' ? 'border-blue-600 bg-blue-50' : 'border-neutral-200 hover:border-blue-300 bg-white'}`}>
                <input type="radio" value="FILLEUL" {...register("role")} className="sr-only" />
                <span className="font-bold text-neutral-900 text-lg mb-1">Non, je suis invité</span>
                <span className="text-sm text-neutral-500">Je suis parrainé par un client du salon.</span>
                {role === 'FILLEUL' && <div className="absolute top-5 right-5 w-4 h-4 bg-blue-600 rounded-full ring-4 ring-blue-100"></div>}
              </label>
            </div>

            {/* Champ conditionnel : Apparaît uniquement si FILLEUL est sélectionné */}
            {role === 'FILLEUL' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-neutral-50 p-5 rounded-xl border border-neutral-200 mt-4">
                <label className="block text-sm font-bold text-neutral-900 mb-2">Identifiant du parrain</label>
                <p className="text-xs text-neutral-500 mb-3">Saisissez l'adresse e-mail ou le numéro de téléphone de la personne qui vous invite.</p>
                <input 
                  type="text" 
                  {...register("sponsorInfo")} 
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${sponsorError ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300 focus:ring-blue-500'}`}
                  placeholder="ex: jean@salon.com ou 0601020304"
                />
                {sponsorError && (
                  <p className="text-red-600 text-sm mt-2 font-semibold flex items-center gap-1">
                    <span>⚠️</span> {sponsorError}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ÉTAPE 2 : Informations personnelles */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
            <h2 className="text-2xl font-bold mb-6">Vos informations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Prénom</label>
                <input 
                  type="text" 
                  {...register("firstName")} 
                  className={`${inputClass} ${errors.firstName ? "border-red-500 ring-1 ring-red-500" : "border-neutral-200"}`} 
                  placeholder="Jean"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700">Nom</label>
                <input 
                  type="text" 
                  {...register("lastName")} 
                  className={`${inputClass} ${errors.lastName ? "border-red-500 ring-1 ring-red-500" : "border-neutral-200"}`} 
                  placeholder="Dupont"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">Date de naissance</label>
              <input 
                type="date" 
                {...register("dob")} 
                className={`${inputClass} ${errors.dob ? "border-red-500 ring-1 ring-red-500" : "border-neutral-200"}`} 
              />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Adresse e-mail</label>
                <input 
                  type="email" 
                  {...register("email")} 
                  className={`${inputClass} ${errors.email ? "border-red-500 ring-1 ring-red-500" : "border-neutral-200"}`} 
                  placeholder="jean.dupont@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700">Téléphone</label>
                <input 
                  type="tel" 
                  {...register("phone")} 
                  className={`${inputClass} ${errors.phone ? "border-red-500 ring-1 ring-red-500" : "border-neutral-200"}`} 
                  placeholder="06 12 34 56 78"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">Code postal</label>
              <input 
                type="text" 
                {...register("zipCode")} 
                className={`${inputClass} ${errors.zipCode ? "border-red-500 ring-1 ring-red-500" : "border-neutral-200"} md:w-1/2`} 
                placeholder="74700"
              />
              {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Décharge légale */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <h2 className="text-2xl font-bold mb-2">Décharge de responsabilité</h2>
            <p className="text-sm text-neutral-500 mb-6">
              Pour des raisons légales et de sécurité en montagne, vous devez lire et accepter la décharge de responsabilité complète de l'événement.
            </p>
            
            {/* Bloc Document PDF */}
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600 shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">Decharge-officielle-GCM.pdf</h3>
                  <p className="text-sm text-blue-700">Document PDF (Version provisoire)</p>
                </div>
              </div>
              <a 
                href="/decharge-fictive.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap text-center w-full sm:w-auto shadow-sm"
              >
                Consulter le document
              </a>
            </div>

            {/* Case à cocher obligatoire avec mention IP/Timestamp */}
            <div className={`flex items-start gap-3 p-5 border rounded-xl transition-colors ${errors.acceptedWaiver ? 'bg-red-50 border-red-200' : 'bg-white border-neutral-200 shadow-sm'}`}>
              <div className="flex items-center h-5 mt-1">
                <input
                  type="checkbox"
                  id="acceptedWaiver"
                  {...register("acceptedWaiver")}
                  className="w-5 h-5 text-blue-600 border-neutral-300 rounded focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="acceptedWaiver" className="text-sm font-bold text-neutral-900 cursor-pointer">
                  Je reconnais avoir lu l'intégralité du document et j'accepte sans réserve les termes de la décharge de responsabilité.
                </label>
                <p className="text-xs text-neutral-500 mt-2 flex items-start gap-1.5">
                  <span className="text-orange-500">⚠️</span>
                  À des fins probatoires, votre adresse IP et l'horodatage exact de votre validation seront enregistrés et conservés de manière sécurisée.
                </p>
                {errors.acceptedWaiver && (
                  <p className="text-red-600 text-sm mt-3 font-semibold bg-red-100 p-2 rounded-md inline-block">
                    {errors.acceptedWaiver.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Onboarding Isomaps */}
        {currentStep === 4 && (
          <div className="animate-in fade-in zoom-in duration-300 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Inscription validée !</h2>
            <p className="text-neutral-600 mb-6">Il ne vous reste plus qu'à rejoindre le groupe Isomaps pour chronométrer votre course.</p>
            <button type="button" className="bg-neutral-900 text-white px-6 py-3 rounded-full font-bold">
              Ouvrir le tutoriel Isomaps
            </button>
          </div>
        )}

        {/* Boutons de navigation */}
        {currentStep < 4 && (
          <div className="flex justify-between pt-6 border-t border-neutral-100 mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${currentStep === 1 ? 'opacity-0 cursor-default' : 'bg-neutral-100 hover:bg-neutral-200'}`}
            >
              Retour
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={isVerifying}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isVerifying ? 'Vérification...' : 'Suivant'}
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition-colors shadow-md"
              >
                Valider mon inscription
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
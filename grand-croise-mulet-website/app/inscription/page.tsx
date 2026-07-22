import RegistrationForm from "../../src/components/RegistrationForm";

export default function InscriptionPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-extrabold text-neutral-900 mb-4">Rejoindre la course</h1>
        <p className="text-neutral-600">Complétez ce formulaire pour valider votre participation au Grand Croise Mulet.</p>
      </div>
      
      <RegistrationForm />
    </div>
  );
}
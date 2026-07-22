import Link from 'next/link';
import SponsorTicker from '../src/components/SponsorTicker';

export default function Home() {
  return (
    <>
      <SponsorTicker />
      
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-neutral-900 mb-6 uppercase">
          Le Grand <br className="md:hidden" />
          <span className="text-blue-600">Croise Mulet</span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mb-10">
          Un mois et demi de course. Un parcours mythique en montagne. 
          Mesurez-vous aux autres clients et tentez de remporter 1 an de coiffure gratuite.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/inscription" 
            className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition-all w-full sm:w-auto text-center"
          >
            S'inscrire à l'événement
          </Link>
          <Link 
            href="/regles" 
            className="bg-white text-neutral-900 border border-neutral-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-50 transition-all w-full sm:w-auto text-center"
          >
            Voir le parcours
          </Link>
        </div>
      </section>

      {/* Emplacement pour le média */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-20">
        <div className="w-full h-64 md:h-96 bg-neutral-200 rounded-3xl border border-neutral-300 flex items-center justify-center shadow-inner overflow-hidden relative">
          <p className="text-neutral-500 font-medium z-10">Emplacement pour la vidéo / photo du parcours</p>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 to-transparent"></div>
        </div>
      </section>
    </>
  );
}
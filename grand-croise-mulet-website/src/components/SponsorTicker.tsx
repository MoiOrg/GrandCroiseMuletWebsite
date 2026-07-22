export default function SponsorTicker() {
  // Remplace par les vrais noms/logos plus tard
  const sponsors = ["ISOMAPS", "SALOMON", "PLANITY", "RED BULL", "MAIRIE DE SALLANCHES", "HAIR SALON"];
  
  // On duplique la liste plusieurs fois pour assurer un défilement infini sans coupure visuelle
  const displaySponsors = [...sponsors, ...sponsors, ...sponsors, ...sponsors];

  return (
    <div className="w-full bg-neutral-900 text-white overflow-hidden py-3 whitespace-nowrap flex items-center border-y border-neutral-800">
      <div className="flex animate-marquee min-w-max">
        {displaySponsors.map((sponsor, index) => (
          <span key={index} className="mx-8 text-sm font-bold tracking-widest text-neutral-400">
            {sponsor}
          </span>
        ))}
      </div>
    </div>
  );
}
// Définit les données et les couleurs personnalisables d'une carte de statistique.
interface StatCardProps {
  label: string;
  value: string;
  unit: string;
  valueColor?: string;
  unitColor?: string;
}

export function StatCard({
  label, value, unit, valueColor = "#0B23F4", unitColor = "#707070",
}: StatCardProps) {
  return (
    // Crée une carte blanche avec un espacement vertical, des coins arrondis et une ombre légère.
    <div className="flex w-full flex-col gap-3 rounded-[10px] bg-white px-6 py-5 font-[Inter,sans-serif]"
      style={{ height: 103, boxShadow: "0px 4px 84px -40px rgba(157,167,251,0.4)" }}>
      {/* Affiche le nom de la statistique, par exemple la durée ou la distance. */}
      <span className="text-[14px] font-normal text-[#707070]">{label}</span>
      {/* Aligne la valeur et son unité sur leur ligne de base pour une lecture naturelle. */}
      <div className="flex items-baseline gap-1">
        {/* Affiche la valeur avec la couleur personnalisée ou la couleur bleue par défaut. */}
        <span className="text-[22px] font-medium" style={{ color: valueColor }}>{value}</span>
        {/* Affiche l'unité avec la couleur personnalisée ou le gris par défaut. */}
        <span className="text-[16px] font-medium" style={{ color: unitColor }}>{unit}</span>
      </div>
    </div>
  );
}
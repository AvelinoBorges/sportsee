import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useAppContext } from "../context/AppContext";
import { getLatestActivityDate, shiftActivityDate, transformToKmPeriod } from "../services/api";
import { NavSelector } from "./NavSelector";

// Dessine une barre personnalisée avec des coins arrondis, masquée si sa hauteur est presque nulle.
function RoundedBar(props: { x?: number; y?: number; width?: number; height?: number }) {
  const { x = 0, y = 0, width = 0, height = 0 } = props; // Applique des valeurs par défaut si Recharts ne fournit pas une coordonnée.
  if (height <= 4) return null; // Évite d'afficher une barre trop petite pour être visible correctement.
  return <rect x={x} y={y} width={width} height={height - 4} rx={7} ry={7} fill="#B3B8F8" />; // Dessine la barre SVG avec une légère marge et des coins arrondis.
}

// Carte présentant la distance parcourue semaine par semaine sur une période de quatre semaines.
export function StatsKmCard() {
  const { activityData, loading } = useAppContext(); // Récupère les activités de l'utilisateur et l'état de chargement global.
  const [offset, setOffset] = useState(0); // Compte le nombre de périodes de quatre semaines parcourues vers le passé.
  const latest = getLatestActivityDate(activityData); // Sert de point de départ à l'affichage, à partir de la séance la plus récente.
  const end = latest ? shiftActivityDate(latest, -offset * 28) : null; // Décale la fin de période de 28 jours à chaque navigation vers le passé.
  // Calcule les totaux de chaque semaine, ou prépare des valeurs nulles avant la première activité.
  const chart = end ? transformToKmPeriod(activityData, end) : {
    averageKm: 0, dateRange: "—",
    entries: ["S1", "S2", "S3", "S4"].map((semaine) => ({ semaine, km: 0 })),
  };
  const start = end ? shiftActivityDate(end, -27) : null; // Calcule le début inclus de la période affichée.
  const canPrev = start ? activityData.some((entry) => entry.date < start) : false; // N'autorise la période précédente que s'il existe des données plus anciennes.
  return (
    // Affiche une carte fixe qui contient soit le chargement, soit le résumé et le graphique.
    <div className="flex h-[484px] w-[445px] flex-col rounded-[10px] bg-white px-10 py-6 font-[Inter,sans-serif]"
      style={{ boxShadow: "0px 4px 84px -40px rgba(157,167,251,0.4)" }}>
      {/* Remplace temporairement les statistiques par un indicateur pendant le chargement global. */}
      {loading ? <span className="m-auto text-[14px] text-[#9B9EAC]">Chargement…</span> : <>
        <div className="flex items-start justify-between">
          <div>
            {/* Affiche la moyenne calculée sur les quatre semaines et le contexte du total. */}
            <span className="block text-[22px] font-bold text-[#0B23F4]">{chart.averageKm}km en moyenne</span>
            <span className="mt-1 block whitespace-nowrap text-[12px] text-[#9B9EAC]">
              Total des kilomètres 4 dernières semaines
            </span>
          </div>
          {/* Permet de naviguer entre les périodes ; bloque l'accès au futur et aux périodes sans données antérieures. */}
          <NavSelector label={chart.dateRange}
            onPrev={() => setOffset((value) => value + 1)}
            onNext={() => setOffset((value) => Math.max(0, value - 1))}
            canPrev={canPrev} canNext={offset > 0} />
        </div>
        {/* Adapte le graphique à la largeur et à la hauteur disponibles dans la carte. */}
        <div className="mt-4 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            {/* Construit l'histogramme hebdomadaire des kilomètres, avec axes, grille et légende. */}
            <BarChart data={chart.entries} barSize={14} margin={{ top: 10, right: 8, left: 0, bottom: 20 }}>
              <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="4 4" />
              <XAxis dataKey="semaine" axisLine={{ stroke: "#111111", strokeWidth: 0.7 }}
                tickLine={false} tick={{ fontSize: 11, fill: "#9B9EAC" }} dy={8} />
              <YAxis domain={[0, 30]} ticks={[0, 10, 20, 30]} axisLine={{ stroke: "#111111", strokeWidth: 0.7 }}
                tickLine={false} tick={{ fontSize: 10, fill: "#9B9EAC" }} width={28} />
              <Legend verticalAlign="bottom" align="left"
                content={() => <span className="pt-2 text-[12px] text-[#9B9EAC]">● Km</span>} />
              {/* Relie les valeurs km à leurs barres dessinées par le composant RoundedBar. */}
              <Bar dataKey="km" shape={<RoundedBar />} isAnimationActive={false}>
                {chart.entries.map((entry) => <Cell key={entry.semaine} fill="#B3B8F8" />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>}
    </div>
  );
}
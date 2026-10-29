import { useState } from "react";
import { Bar, CartesianGrid, Cell, ComposedChart, Curve, Dot, Legend, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { CurveProps } from "recharts";
import { useAppContext } from "../context/AppContext";
import { getLatestActivityDate, shiftActivityDate, transformToBpmPeriod } from "../services/api";
import { NavSelector } from "./NavSelector";

// Dessine les barres du graphique avec des coins arrondis.
function RoundedBar(props: { x?: number; y?: number; width?: number; height?: number; fill?: string }) {
  const { x = 0, y = 0, width = 0, height = 0, fill = "#FFCCC7" } = props; // Récupère la géométrie et la couleur fournies par Recharts.
  if (height <= 3) return null; // Masque les barres trop petites pour être rendues proprement.
  return <rect x={x} y={y} width={width} height={height - 3} rx={7} ry={7} fill={fill} />; // Dessine la barre SVG en réduisant légèrement sa hauteur et en arrondissant ses coins.
}

// Construit une courbe personnalisée entre deux points de fréquence moyenne.
function SmoothBpmLine(props: CurveProps) {
  // Écarte les coordonnées absentes et conserve uniquement les points exploitables.
  const points = props.points?.filter(
    (point): point is { x: number; y: number } =>
      point !== null && point.x !== null && point.y !== null
  ) ?? [];
  if (points.length !== 2) return <Curve {...props} type="natural" />; // Utilise la courbe standard si la ligne ne relie pas exactement deux points.
  const [start, end] = points; // Identifie le point de départ et celui d'arrivée de la ligne.
  const distance = end.x - start.x; // Calcule l'écart horizontal entre ces deux points.
  const controlY = (start.y + end.y) / 2 - Math.min(12, Math.abs(distance) * 0.12); // Détermine la hauteur des points de contrôle pour lisser la courbe.
  const path = `M ${start.x} ${start.y} C ${start.x + distance / 3} ${controlY}, ${start.x + distance * 2 / 3} ${controlY}, ${end.x} ${end.y}`; // Définit le tracé SVG de Bézier entre les points.
  return <Curve {...props} points={undefined} path={path} />; // Demande à Recharts de dessiner le tracé calculé.
}

// Carte présentant les fréquences cardiaques minimales, maximales et moyennes sur une semaine.
export function StatsBPMCard() {
  const { activityData, loading } = useAppContext(); // Récupère les séances et l'état de chargement partagés par le contexte.
  const [offset, setOffset] = useState(0); // Compte les semaines parcourues vers le passé dans le graphique.
  const latest = getLatestActivityDate(activityData); // Utilise la dernière activité comme point de départ de la navigation.
  const end = latest ? shiftActivityDate(latest, -offset * 7) : null; // Décale la fin de période d'une semaine à chaque navigation.
  // Calcule les mesures cardiaques quotidiennes, ou crée sept entrées vides sans activité.
  const chart = end ? transformToBpmPeriod(activityData, end) : {
    averageBpm: 0, dateRange: "—",
    entries: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => ({
      day, min: null, max: null, moy: null,
    })),
  };
  const start = end ? shiftActivityDate(end, -6) : null; // Calcule la première date de la semaine affichée.
  const canPrev = start ? activityData.some((entry) => entry.date < start) : false; // Autorise le recul uniquement s'il existe des données plus anciennes.
  return (
    // Affiche la moyenne et le graphique, ou un indicateur tant que les données chargent.
    <div className="flex h-[484px] w-[583px] flex-col rounded-[10px] bg-white px-10 py-6 font-[Inter,sans-serif]"
      style={{ boxShadow: "0px 4px 84px -40px rgba(157,167,251,0.4)" }}>
      {/* Remplace temporairement le contenu de la carte par le message de chargement. */}
      {loading ? <span className="m-auto text-[14px] text-[#9B9EAC]">Chargement…</span> : <>
        <div className="flex items-start justify-between">
          <div>
            {/* Met en avant la fréquence cardiaque moyenne de la période sélectionnée. */}
            <span className="block text-[22px] font-bold text-[#DF392B]">{chart.averageBpm} BPM</span>
            <span className="mt-1 block whitespace-nowrap text-[12px] text-[#9B9EAC]">Fréquence cardiaque moyenne</span>
          </div>
          {/* Navigue entre les semaines et empêche d'aller au-delà des périodes disponibles. */}
          <NavSelector label={chart.dateRange}
            onPrev={() => setOffset((value) => value + 1)}
            onNext={() => setOffset((value) => Math.max(0, value - 1))}
            canPrev={canPrev} canNext={offset > 0} />
        </div>
        {/* Adapte le graphique à l'espace restant dans la carte. */}
        <div className="mt-4 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            {/* Combine les barres quotidiennes et la courbe moyenne dans un même graphique. */}
            <ComposedChart data={chart.entries} barSize={14} barGap={6} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="4 4" />
              <XAxis dataKey="day" axisLine={{ stroke: "#111111", strokeWidth: 0.7 }}
                tickLine={false} tick={{ fontSize: 11, fill: "#9B9EAC" }} dy={8} />
              <YAxis domain={[130, 187]} ticks={[130, 145, 160, 187]}
                axisLine={{ stroke: "#111111", strokeWidth: 0.7 }} tickLine={false}
                tick={{ fontSize: 10, fill: "#9B9EAC" }} width={32} />
              <Legend verticalAlign="bottom" align="left"
                content={() => <span className="pt-2 text-[12px] text-[#9B9EAC]">● Min　● Max BPM　● Moy BPM</span>} />
              {/* Représente la fréquence minimale avec des barres rose pâle. */}
              <Bar dataKey="min" name="Min" shape={<RoundedBar fill="#FFCCC7" />} isAnimationActive={false}>
                {chart.entries.map((entry, index) => <Cell key={`min-${entry.day}-${index}`} fill="#FFCCC7" />)}
              </Bar>
              {/* Représente la fréquence maximale avec des barres rouges. */}
              <Bar dataKey="max" name="Max BPM" shape={<RoundedBar fill="#DF392B" />} isAnimationActive={false}>
                {chart.entries.map((entry, index) => <Cell key={`max-${entry.day}-${index}`} fill="#DF392B" />)}
              </Bar>
              {/* Trace la moyenne journalière et relie les jours même si une mesure est absente. */}
              <Line type="natural" shape={SmoothBpmLine} dataKey="moy" name="Moy BPM"
                stroke="#C5CBF9" strokeWidth={2} connectNulls
                dot={<Dot r={4} fill="#0B23F4" strokeWidth={0} />}
                activeDot={{ r: 5, fill: "#0B23F4" }} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </>}
    </div>
  );
}
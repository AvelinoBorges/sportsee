import { PieChart, Pie, Cell } from "recharts";
import type { WeeklyRunsData } from "../services/api";

// Carte qui compare le nombre de courses hebdomadaires réalisées à l'objectif fixé.
export function PieChartCard({
  runsData, loading,
}: { runsData: WeeklyRunsData; loading: boolean }) {
  const { objective: total, done } = runsData; // Récupère l'objectif total et le nombre de courses effectuées.
  // Remplace temporairement le graphique par un indicateur pendant le chargement des données.
  if (loading) return (
    <div className="flex h-[342px] w-[450px] items-center justify-center rounded-[10px] bg-white">
      Chargement…
    </div>
  );
  const remaining = Math.max(0, total - done); // Calcule les courses restantes sans permettre une valeur négative si l'objectif est dépassé.
  // Prépare les deux parts du diagramme circulaire avec leur nom, valeur et couleur.
  const chartData = [
    { name: "réalisées", value: done, fill: "#0B23F4" },
    { name: "restants", value: remaining, fill: "#C5CBF9" },
  ];
  return (
    // Présente le bilan textuel et son graphique dans une carte.
    <div className="flex h-[342px] w-[450px] flex-col gap-4 rounded-[10px] bg-white p-6 font-[Inter,sans-serif]"
      style={{ boxShadow: "0px 4px 84px -40px rgba(157,167,251,0.4)" }}>
      <div className="flex flex-col gap-1">
        {/* Affiche le nombre de courses terminées et l'objectif hebdomadaire. */}
        <div className="flex items-baseline gap-2">
          <span className="text-[28px] font-semibold text-[#0B23F4]">x{done}</span>
          <span className="text-[16px] font-medium text-[#707070]">sur objectif de {total}</span>
        </div>
        <span className="text-[14px] text-[#707070]">Courses hebdomadaire réalisées</span>
      </div>
      {/* Centre le diagramme et ses légendes dans la partie basse de la carte. */}
      <div className="relative flex flex-1 items-center justify-center">
        {/* Dessine un diagramme en anneau à partir des valeurs préparées dans chartData. */}
        <PieChart width={220} height={220}>
          <Pie data={chartData} cx={110} cy={110} innerRadius={53} outerRadius={91}
            startAngle={-30} endAngle={-390} dataKey="value" strokeWidth={0}
            isAnimationActive={false}>
            {/* Applique à chaque part la couleur définie dans ses données. */}
            {chartData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
          </Pie>
        </PieChart>
        {/* Légende de la part correspondant aux courses restantes. */}
        <div className="absolute right-14 top-6 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#C5CBF9]" />
          <span className="text-[11px] text-[#707070]">{remaining} restants</span>
        </div>
        {/* Légende de la part correspondant aux courses réalisées. */}
        <div className="absolute bottom-6 left-14 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#0B23F4]" />
          <span className="text-[11px] text-[#707070]">{done} réalisées</span>
        </div>
      </div>
    </div>
  );
}
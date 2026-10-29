import { useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ProfileHeader } from "./ProfileHeader";
import { StatsKmCard } from "./StatsKmCard";
import { StatsBPMCard } from "./StatsBPMCard";
import { PieChartCard } from "./PieChartCard";
import { StatCard } from "./StatCard";
import { NavSelector } from "./NavSelector";
import { useAppContext } from "../context/AppContext";
import {
  getLatestActivityDate,
  shiftActivityDate,
  transformToWeeklyActivityStats,
  transformToWeeklyRuns,
} from "../services/api";

export function DashboardPage() {
  const {
    activityData, userInfo, weeklyRunsData, weeklyActivityStats, loading, error,
  } = useAppContext();
  const [weekOffset, setWeekOffset] = useState(0);
  const latest = getLatestActivityDate(activityData);
  const end = latest ? shiftActivityDate(latest, -weekOffset * 7) : null;
  const runs = end
    ? transformToWeeklyRuns(activityData, end, userInfo?.goals?.weeklyGoal ?? 7)
    : weeklyRunsData;
  const stats = end
    ? transformToWeeklyActivityStats(activityData, end)
    : weeklyActivityStats;
  const start = end ? shiftActivityDate(end, -6) : null;
  const canPrev = start ? activityData.some((entry) => entry.date < start) : false;

  if (error) return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F3FF]">
      <p className="max-w-md px-6 text-center text-[16px] text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#F2F3FF] font-[Inter,sans-serif]">
      <div className="w-full px-10 pt-8 lg:px-37.5"><Navbar /></div>
      <main className="flex w-full max-w-[1052px] flex-col gap-27 px-4 pb-20 pt-27">
        <ProfileHeader />
        <section className="flex flex-col gap-[71px]">
          <div className="flex flex-col gap-6">
            <h2 className="text-[22px] font-medium text-[#111111]">Vos dernières performances</h2>
            <div className="grid gap-6 xl:grid-cols-[445px_583px]">
              <StatsKmCard /><StatsBPMCard />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-1">
              <h2 className="text-[22px] font-medium text-[#111111]">Cette semaine</h2>
              <div className="flex w-full items-center justify-between">
                <span className="text-[16px] font-medium text-[#707070]">{runs.dateRange}</span>
                <NavSelector label={runs.dateRange} showLabel={false}
                  onPrev={() => setWeekOffset((value) => value + 1)}
                  onNext={() => setWeekOffset((value) => Math.max(0, value - 1))}
                  canPrev={canPrev} canNext={weekOffset > 0} />
              </div>
            </div>
            <div className="grid gap-6 xl:grid-cols-[450px_578px]">
              <PieChartCard runsData={runs} loading={loading} />
              <div className="flex flex-col gap-6">
                <StatCard label="Durée d'activité" value={stats.duration.value}
                  unit={stats.duration.unit} valueColor={stats.duration.valueColor}
                  unitColor={stats.duration.unitColor} />
                <StatCard label="Distance" value={stats.distance.value}
                  unit={stats.distance.unit} valueColor={stats.distance.valueColor}
                  unitColor={stats.distance.unitColor} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
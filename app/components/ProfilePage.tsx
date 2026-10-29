import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useAppContext } from "../context/AppContext";

// Carte réutilisable pour présenter une statistique avec sa valeur et son unité.
function StatCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex w-[278px] flex-col rounded-[10px] bg-[#0B23F4] px-[30px] py-5 font-[Inter,sans-serif]"
      style={{ gap: 19, boxShadow: "0px 4px 84px -40px rgba(157,167,251,0.4)" }}>
      <span className="text-[14px] text-white">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-[22px] font-medium text-white">{value}</span>
        <span className="text-[16px] font-medium text-[#B6BDFC]">{unit}</span>
      </div>
    </div>
  );
}

export function ProfilePage() {
  // Récupère les données de profil et les statistiques préparées par le contexte global.
  const { userDisplay, profileStats, error } = useAppContext();
  // Remplace la page par un message si le chargement des données a échoué.
  if (error) return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F3FF]">
      <p className="max-w-md px-6 text-center text-[16px] text-red-500">{error}</p>
    </div>
  );
  // Prépare les informations personnelles à afficher, avec un tiret si une donnée manque.
  const fields = [
    `Âge : ${userDisplay?.age ?? "—"}`,
    `Genre : ${userDisplay?.gender ?? "—"}`,
    `Taille : ${userDisplay?.height ?? "—"}`,
    `Poids : ${userDisplay?.weight ?? "—"}`,
  ];
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#F2F3FF] font-[Inter,sans-serif]">
      <div className="w-full px-10 pt-8 lg:px-37.5"><Navbar /></div>
      <main className="flex flex-1 items-start justify-center px-4 py-[108px]">
        <div className="flex flex-col gap-8 xl:flex-row xl:gap-[57px]">
          {/* Regroupe l'identité du membre et les informations de son profil. */}
          <div className="flex w-full flex-col gap-4 xl:w-[508px]">
            <div className="flex items-center gap-6 rounded-[10px] bg-white px-8 py-6"
              style={{ boxShadow: "0px 4px 84px -40px rgba(157,167,251,0.4)" }}>
              <div className="h-[117px] w-[104px] overflow-hidden rounded-[10px] bg-[#E5E7EB]">
                {/* N'affiche la photo que si une URL de profil est disponible. */}
                {userDisplay?.profilePicture && <img src={userDisplay.profilePicture}
                  alt="Photo de profil" className="h-full w-full object-cover" />}
              </div>
              <div>
                {/* Affiche les informations d'identité avec des valeurs de remplacement si nécessaire. */}
                <p className="text-[22px] font-medium text-[#111111]">{userDisplay?.name ?? "—"}</p>
                <p className="text-[14px] text-[#707070]">Membre depuis le {userDisplay?.memberSince ?? "—"}</p>
              </div>
            </div>
            <div className="flex flex-col gap-8 rounded-[10px] bg-white px-7 py-10"
              style={{ boxShadow: "0px 4px 84px -40px rgba(157,167,251,0.4)" }}>
              <div className="flex flex-col gap-6">
                <span className="text-[22px] font-medium text-[#111111]">Votre profil</span>
                <hr className="w-full border-0 border-t border-[#E7E7E7]" />
              </div>
              {/* Liste les informations personnelles préparées plus haut. */}
              <div className="flex flex-col gap-6">
                {fields.map((field) => <span key={field}
                  className="text-[16px] font-medium text-[#707070]">{field}</span>)}
              </div>
            </div>
          </div>
          {/* Présente les statistiques d'activité et la période couverte. */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[22px] font-medium text-[#111111]">Vos statistiques</span>
              <span className="text-[14px] text-[#707070]">
                {profileStats ? `depuis le ${profileStats.since}` : "—"}
              </span>
            </div>
            {/* Organise les indicateurs en colonnes qui s'adaptent à la largeur de l'écran. */}
            <div className="flex flex-col gap-5 md:flex-row">
              <div className="flex flex-col gap-5">
                <StatCard label="Temps total couru" value={profileStats?.totalRunTime.value ?? "—"} unit={profileStats?.totalRunTime.unit ?? ""} />
                <StatCard label="Distance totale parcourue" value={profileStats?.totalDistance.value ?? "—"} unit={profileStats?.totalDistance.unit ?? ""} />
                <StatCard label="Nombre de sessions" value={profileStats?.totalSessions.value ?? "—"} unit={profileStats?.totalSessions.unit ?? ""} />
              </div>
              <div className="flex flex-col gap-5">
                <StatCard label="Calories brûlées" value={profileStats?.caloriesBurned.value ?? "—"} unit={profileStats?.caloriesBurned.unit ?? ""} />
                <StatCard label="Nombre de jours de repos" value={profileStats?.restDays.value ?? "—"} unit={profileStats?.restDays.unit ?? ""} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
import { useAppContext } from "../context/AppContext";

// En-tête du profil : présente l'identité de l'utilisateur et sa distance cumulée.
export function ProfileHeader() {
  const { userDisplay, profileStats } = useAppContext(); // Récupère les données de profil déjà préparées par le contexte global.
  return (
    // Organise les informations personnelles à gauche et le total parcouru à droite.
    <div className="flex h-[181px] w-full items-center justify-between rounded-[20px] px-13 font-[Inter,sans-serif]"
      style={{ background: "linear-gradient(0deg, rgba(255,255,255,0) 0%, #fff 100%)" }}>
      <div className="flex items-center gap-9">
        {/* N'affiche la photo que si une URL de profil est disponible. */}
        {userDisplay?.profilePicture && <img src={userDisplay.profilePicture}
          alt="Photo de profil" className="h-[117px] w-[104px] rounded-[10px] object-cover" />}
        <div className="flex flex-col gap-1">
          {/* Affiche le nom ou un tiret si les informations utilisateur ne sont pas encore disponibles. */}
          <p className="text-[22px] font-medium text-[#111111]">{userDisplay?.name ?? "—"}</p>
          {/* Présente la date d'inscription avec une valeur de remplacement en attendant les données. */}
          <p className="text-[14px] text-[#707070]">Membre depuis le {userDisplay?.memberSince ?? "—"}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Précise la statistique mise en avant dans le bloc bleu. */}
        <span className="text-[14px] text-[#707070]">Distance totale parcourue</span>
        <div className="flex items-center gap-4 rounded-[10px] bg-[#0B23F4] px-6 py-7">
          {/* Illustre la performance cumulée avec l'icône de récompense. */}
          <img src="/achievement-icon.svg" alt="Achievement" className="h-8 w-8" />
          {/* Affiche la distance totale et son unité, ou des valeurs de remplacement si le profil est indisponible. */}
          <span className="text-[22px] font-medium text-white">
            {profileStats?.totalDistance.value ?? "—"} {profileStats?.totalDistance.unit ?? "km"}
          </span>
        </div>
      </div>
    </div>
  );
}
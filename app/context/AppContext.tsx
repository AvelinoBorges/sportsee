import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { getAuthToken, getStoredUserId, removeAuthToken } from "../utils/auth";
import { useApi } from "../hooks/useApi";
import {
  getDefaultDateRange,
  getUserActivity,
  getUserInfo,
  transformProfileStats,
  transformToBpmPeriod,
  transformToKmPeriod,
  transformToWeeklyActivityStats,
  transformToWeeklyRuns,
  transformUserDisplay,
} from "../services/api";
import type {
  ActivityEntry,
  ProfileStats,
  UserDisplay,
  UserInfoResponse,
  WeeklyActivityStats,
  WeeklyBpmData,
  WeeklyKmData,
  WeeklyRunsData,
} from "../services/api";

// Regroupe les deux réponses API chargées ensemble par le contexte.
type AllData = { userInfo: UserInfoResponse; activities: ActivityEntry[] };

// Décrit les données et les actions partagées avec toutes les pages de l'application.
interface AppContextType {
  userId: string;
  userInfo: UserInfoResponse | null;
  activityData: ActivityEntry[];
  weeklyKmData: WeeklyKmData;
  weeklyBpmData: WeeklyBpmData;
  weeklyRunsData: WeeklyRunsData;
  weeklyActivityStats: WeeklyActivityStats;
  userDisplay: UserDisplay | null;
  profileStats: ProfileStats | null;
  loading: boolean;
  error: string | null;
  logout: () => void;
  refetchData: () => void;
}

// Valeurs de remplacement pour que les graphiques restent affichables sans activité.
const EMPTY_KM: WeeklyKmData = {
  averageKm: 0,
  dateRange: "—",
  entries: ["S1", "S2", "S3", "S4"].map((semaine) => ({ semaine, km: 0 })),
};
const EMPTY_BPM: WeeklyBpmData = {
  averageBpm: 0,
  dateRange: "—",
  entries: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => ({
    day, min: null, max: null, moy: null,
  })),
};
const EMPTY_RUNS: WeeklyRunsData = { objective: 7, done: 0, dateRange: "—" };
const EMPTY_ACTIVITY: WeeklyActivityStats = {
  dateRange: "—",
  duration: { value: "0", unit: "minutes", valueColor: "#0B23F4", unitColor: "#B6BDFC" },
  distance: { value: "0", unit: "kilomètres", valueColor: "#DF392B", unitColor: "#FCC1B6" },
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate(); // Récupère la navigation pour rediriger l'utilisateur après sa déconnexion.
  const [token, setToken] = useState<string | null>(getAuthToken); // Initialise l'état avec le jeton enregistré dans le navigateur.
  // Prépare une fonction de chargement uniquement si une session est disponible.
  const fetchFn: (() => Promise<AllData>) | null = token
    ? async () => {
        const { startWeek, endWeek } = getDefaultDateRange(); // Détermine la période à demander au backend.
        // Lance les deux appels indépendamment et attend que les deux réponses soient disponibles.
        const [userInfo, activities] = await Promise.all([
          getUserInfo(token), // Récupère les informations personnelles et les objectifs de l'utilisateur.
          getUserActivity(token, startWeek, endWeek), // Récupère ses séances sur la période définie.
        ]);
        return { userInfo, activities }; // Regroupe les résultats pour les transmettre au hook useApi.
      }
    : null;
  const { data, loading, error: apiError, refetch } = useApi<AllData>(fetchFn); // Exécute le chargement et expose son résultat, son état et son erreur.

  const firstRender = useRef(true); // Permet de distinguer le montage initial des changements ultérieurs de jeton.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false; // Marque le premier rendu comme traité.
      return; // Le hook useApi a déjà lancé le chargement initial, on évite de le déclencher deux fois.
    }
    if (token) refetch(); // Recharge les données lorsqu'un nouveau jeton devient disponible.
  }, [token]);

  useEffect(() => {
    if (apiError?.includes("Session expirée")) {
      removeAuthToken(); // Efface les identifiants locaux devenus invalides.
      setToken(null); // Met à jour l'état pour désactiver les requêtes protégées.
      navigate("/"); // Redirige vers la page d'accueil pour permettre une nouvelle connexion.
    }
  }, [apiError, navigate]);

  const userInfo = data?.userInfo ?? null; // Fournit les informations reçues, ou null pendant l'absence de résultat.
  const activityData = data?.activities ?? []; // Fournit les séances reçues, ou un tableau vide avant leur chargement.
  // Identifie la séance la plus récente pour aligner les périodes des statistiques.
  const latestDate =
    activityData.reduce<string | null>(
      (latest, entry) => latest === null || entry.date > latest ? entry.date : latest,
      null
    );
  const weeklyKmData = latestDate
    ? transformToKmPeriod(activityData, latestDate) // Calcule les kilomètres des quatre semaines précédant la dernière activité.
    : EMPTY_KM; // Utilise des valeurs neutres si aucune activité n'existe.
  const weeklyBpmData = latestDate
    ? transformToBpmPeriod(activityData, latestDate) // Calcule les mesures cardiaques des sept jours associés.
    : EMPTY_BPM; // Préserve la structure du graphique sans mesures cardiaques.
  const weeklyRunsData = transformToWeeklyRuns(
    activityData,
    latestDate ?? undefined, // Passe la date récente ou laisse la fonction choisir sa date par défaut.
    userInfo?.goals?.weeklyGoal ?? 7 // Utilise l'objectif du profil ou sept séances si aucun objectif n'est défini.
  );
  const weeklyActivityStats = latestDate
    ? transformToWeeklyActivityStats(activityData, latestDate) // Calcule les totaux de durée et de distance de la semaine récente.
    : EMPTY_ACTIVITY; // Affiche des statistiques neutres tant qu'aucune activité n'est disponible.
  const userDisplay = userInfo ? transformUserDisplay(userInfo.profile) : null; // Formate le profil pour les composants d'affichage.
  const profileStats = userInfo
    ? transformProfileStats(activityData, userInfo.profile.createdAt) // Calcule le bilan global à partir des activités et de la date d'inscription.
    : null; // Attend les informations du profil avant de construire ce bilan.

  function logout() {
    removeAuthToken(); // Supprime le jeton et l'identifiant enregistrés localement.
    setToken(null); // Réinitialise la session dans l'état React.
    navigate("/"); // Retourne à la page d'accueil après la déconnexion.
  }

  function refetchData() {
    const newToken = getAuthToken(); // Relit le jeton au cas où il aurait changé dans le stockage du navigateur.
    if (newToken && newToken !== token) setToken(newToken); // Met à jour la session ; l'effet déclenchera le chargement avec ce jeton.
    else refetch(); // Si le jeton n'a pas changé, relance directement les requêtes actuelles.
  }

  return (
    <AppContext.Provider
      value={{
        userId: getStoredUserId(), // Rend l'identifiant stocké accessible aux pages.
        userInfo,
        activityData,
        weeklyKmData,
        weeklyBpmData,
        weeklyRunsData,
        weeklyActivityStats,
        userDisplay,
        profileStats,
        loading, // Indique aux pages si les requêtes sont encore en cours.
        error: apiError, // Rend l'erreur de chargement accessible aux composants.
        logout, // Partage l'action de déconnexion.
        refetchData, // Partage l'action de rechargement des données.
      }}
    >
      {children} {/* Affiche l'application à l'intérieur du fournisseur de données global. */}
    </AppContext.Provider>
  );
}

// Hook d'accès au contexte ; fournit une erreur explicite s'il est appelé hors du fournisseur.
export function useAppContext(): AppContextType {
  const context = useContext(AppContext); // Lit les données partagées par le AppProvider le plus proche.
  if (!context) throw new Error("useAppContext must be used within AppProvider"); // Signale une mauvaise utilisation du hook dans l'arbre React.
  return context; // Renvoie les données et actions à la page ou au composant appelant.
}
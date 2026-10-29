// Centralise l'adresse du backend ainsi que les types et les fonctions d'accès à l'API.
const API_BASE = "http://localhost:8000/api";

// Données renvoyées après une connexion réussie.
export interface LoginResponse {
  token: string;
  userId: string;
}

// Informations personnelles renvoyées pour le profil d'un utilisateur.
export interface UserProfile {
  firstName: string;
  lastName: string;
  createdAt: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  profilePicture: string;
}

// Indicateurs globaux d'activité de l'utilisateur.
export interface UserStatistics {
  totalDistance: string;
  totalSessions: number;
  totalDuration: number;
}

// Objectif d'entraînement défini pour la semaine.
export interface UserGoals {
  weeklyGoal: number;
}

// Structure complète des informations récupérées pour un utilisateur.
export interface UserInfoResponse {
  profile: UserProfile;
  statistics: UserStatistics;
  goals?: UserGoals;
}

// Mesures cardiaques relevées pendant une activité.
export interface HeartRate {
  min: number;
  max: number;
  average: number;
}

// Données d'une séance, notamment sa date, sa distance et ses calories.
export interface ActivityEntry {
  date: string;
  distance: number;
  duration: number;
  heartRate: HeartRate;
  caloriesBurned: number;
}

// Données agrégées par semaine pour afficher l'évolution de la distance.
export interface WeeklyKmData {
  averageKm: number;
  dateRange: string;
  entries: Array<{ semaine: string; km: number }>;
}

// Mesures cardiaques agrégées par jour pour le graphique hebdomadaire.
export interface WeeklyBpmData {
  averageBpm: number;
  dateRange: string;
  entries: Array<{
    day: string;
    min: number | null;
    max: number | null;
    moy: number | null;
  }>;
}

// Comparaison de l'objectif hebdomadaire avec les séances réalisées.
export interface WeeklyRunsData {
  objective: number;
  done: number;
  dateRange: string;
}

// Durée et distance hebdomadaires, avec les informations de présentation des valeurs.
export interface WeeklyActivityStats {
  dateRange: string;
  duration: { value: string; unit: string; valueColor: string; unitColor: string };
  distance: { value: string; unit: string; valueColor: string; unitColor: string };
}

// Profil utilisateur préparé au format utilisé pour l'affichage.
export interface UserDisplay {
  name: string;
  memberSince: string;
  age: number;
  gender: string;
  height: string;
  weight: string;
  profilePicture: string;
}

// Statistiques mises en forme pour la page récapitulative du profil.
export interface ProfileStats {
  since: string;
  totalRunTime: { value: string; unit: string };
  totalDistance: { value: string; unit: string };
  totalSessions: { value: string; unit: string };
  caloriesBurned: { value: string; unit: string };
  restDays: { value: string; unit: string };
}



// Authentifie l'utilisateur auprès du backend et renvoie son jeton ainsi que son identifiant.
export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  let res: Response; // Réserve la réponse HTTP, qui sera affectée après l'appel réseau.
  try {
    res = await fetch(`${API_BASE}/login`, {
      method: "POST", // Envoie les identifiants au backend avec une requête POST.
      headers: { "Content-Type": "application/json" }, // Indique que le corps est au format JSON.
      body: JSON.stringify({ username, password }), // Sérialise le nom d'utilisateur et le mot de passe.
    });
  } catch {
    // Interrompt le flux si le backend est inaccessible ou si la requête réseau échoue.
    throw new Error("Serveur indisponible. Assurez-vous que le backend est démarré.");
  }
  if (!res.ok) throw new Error("Nom d'utilisateur ou mot de passe incorrect."); // Convertit une réponse HTTP en échec en erreur lisible.
  return res.json(); // Lit les données JSON contenant le jeton et l'identifiant utilisateur.
}

// Récupère les informations du profil connecté ; le jeton sert à autoriser la requête.
export async function getUserInfo(token: string): Promise<UserInfoResponse> {
  let res: Response; // Stocke la réponse du serveur pour vérifier son statut ensuite.
  try {
    res = await fetch(`${API_BASE}/user-info`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    // Arrête le flux si la requête ne peut pas atteindre le serveur.
    throw new Error("Serveur indisponible. Assurez-vous que le backend est démarré.");
  }
  // Signale séparément une session invalide afin que l'application puisse demander une reconnexion.
  if (res.status === 401) throw new Error("Session expirée. Veuillez vous reconnecter."); // Demande une reconnexion si le jeton n'est plus valide.
  if (!res.ok) throw new Error("Erreur lors du chargement des données utilisateur."); // Signale les autres erreurs renvoyées par le backend.
  return res.json(); // Convertit les données JSON du profil en résultat de la fonction.
}

// Charge les activités de l'utilisateur pour la période délimitée par les deux semaines fournies.
export async function getUserActivity(
  token: string,
  startWeek: string,
  endWeek: string
): Promise<ActivityEntry[]> {
  const params = new URLSearchParams({ startWeek, endWeek }); // Encode les bornes de la période pour les paramètres de l'URL.
  let res: Response; // Réserve la réponse à vérifier après l'appel au backend.
  try {
    res = await fetch(`${API_BASE}/user-activity?${params}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    // Arrête le traitement et informe l'appelant en cas d'échec réseau.
    throw new Error("Serveur indisponible. Assurez-vous que le backend est démarré.");
  }
  // Vérifie l'authentification avant de traiter les autres erreurs de l'API.
  if (res.status === 401) throw new Error("Session expirée. Veuillez vous reconnecter."); // Signale spécifiquement un jeton expiré ou invalide.
  if (!res.ok) throw new Error("Erreur lors du chargement des activités."); // Signale toute autre réponse HTTP en échec.
  return res.json(); // Renvoie les séances reçues sous forme de tableau typé.
}



// Libellés français utilisés pour présenter les dates et les graphiques.
const MONTHS_FR_SHORT = [
  "jan", "fév", "mars", "avr", "mai", "juin",
  "juil", "août", "sep", "oct", "nov", "déc",
];
const MONTHS_FR_FULL = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
const DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const WEEK_LABELS = ["S1", "S2", "S3", "S4"];

// Convertit une date ISO (AAAA-MM-JJ) en libellé court pour les graphiques.
function formatDateFr(iso: string): string {
  const [, month, day] = iso.split("-"); // Sépare les parties de la date ISO et conserve le mois et le jour.
  return `${parseInt(day)} ${MONTHS_FR_SHORT[parseInt(month) - 1]}`; // Compose le jour et le nom français abrégé du mois.
}

// Convertit une date ISO en date numérique pour l'affichage.
function formatDateNumeric(iso: string): string {
  const [year, month, day] = iso.split("-"); // Extrait l'année, le mois et le jour de la date ISO.
  return `${day}/${month}/${year}`; // Réordonne les éléments au format français JJ/MM/AAAA.
}

// Produit une date française complète, avec le mois écrit en toutes lettres.
function formatDateFrFull(iso: string): string {
  const [year, month, day] = iso.split("-"); // Récupère les trois composantes de la date.
  return `${parseInt(day)} ${MONTHS_FR_FULL[parseInt(month) - 1]} ${year}`; // Produit une date lisible avec le mois écrit en toutes lettres.
}

// Décale une date ISO d'un nombre de jours, sans dépendre du fuseau horaire local.
function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00.000Z`); // Crée la date à minuit UTC pour éviter les décalages de fuseau horaire.
  date.setUTCDate(date.getUTCDate() + days); // Ajoute ou retire le nombre de jours demandé.
  return date.toISOString().split("T")[0]; // Retourne uniquement la date au format ISO AAAA-MM-JJ.
}

// Expose le décalage de date utilisé par les composants de l'application.
export function shiftActivityDate(iso: string, days: number): string {
  return addDays(iso, days); // Réutilise le calcul UTC commun et renvoie la date décalée.
}

// Définit la période par défaut : des premières données possibles jusqu'à aujourd'hui.
export function getDefaultDateRange(): { startWeek: string; endWeek: string } {
  return {
    startWeek: "1900-01-01", // Choisit une date ancienne afin d'inclure tout l'historique disponible.
    endWeek: new Date().toISOString().split("T")[0], // Utilise la date du jour comme fin de période.
  };
}

// Trouve la date la plus récente afin d'ancrer les graphiques sur la dernière activité.
export function getLatestActivityDate(activities: ActivityEntry[]): string | null {
  return activities.reduce<string | null>(
    // Parcourt les séances et conserve la date la plus récente ; une liste vide produit null.
    (latest, activity) => (latest === null || activity.date > latest ? activity.date : latest),
    null // Initialise la recherche sans date connue.
  );
}

// Formate les bornes d'une période avec des mois abrégés en français.
function dateRangeLabel(start: string, end: string): string {
  return `${formatDateFr(start)} - ${formatDateFr(end)}`; // Formate les deux bornes puis les assemble en libellé de période.
}

// Regroupe les distances des 28 derniers jours en quatre semaines et calcule la moyenne.
export function transformToKmPeriod(
  activities: ActivityEntry[],
  endDate: string
): WeeklyKmData {
  const startDate = addDays(endDate, -27); // Calcule le début des 28 jours se terminant à endDate.
  const entries = WEEK_LABELS.map((semaine, index) => {
    const weekStart = addDays(startDate, index * 7); // Calcule le premier jour de la semaine courante.
    const weekEnd = addDays(weekStart, 6); // Calcule son dernier jour pour couvrir sept jours.
    const km = activities
      .filter((entry) => entry.date >= weekStart && entry.date <= weekEnd) // Garde les séances dont la date appartient à cette semaine.
      .reduce((sum, entry) => sum + entry.distance, 0); // Additionne les distances des séances retenues.
    return { semaine, km: Math.round(km * 10) / 10 }; // Associe la semaine à sa distance arrondie au dixième.
  });
  const total = entries.reduce((sum, entry) => sum + entry.km, 0); // Additionne les distances calculées pour les quatre semaines.
  return {
    averageKm: Math.round((total / 4) * 10) / 10, // Calcule la moyenne hebdomadaire sur les quatre semaines.
    dateRange: dateRangeLabel(startDate, endDate), // Prépare la période destinée à l'affichage.
    entries, // Renvoie le détail des kilomètres pour chaque semaine.
  };
}

// Regroupe les mesures cardiaques des sept derniers jours, jour par jour.
// Les valeurs restent nulles lorsqu'aucune activité n'a été enregistrée ce jour-là.
export function transformToBpmPeriod(
  activities: ActivityEntry[],
  endDate: string
): WeeklyBpmData {
  const startDate = addDays(endDate, -6); // Définit les sept jours qui se terminent à endDate.
  const period = activities.filter(
    (entry) => entry.date >= startDate && entry.date <= endDate // Écarte les activités en dehors de cette période.
  );
  const entries = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(startDate, index); // Génère la date correspondant à chacun des sept jours.
    const dayActivities = period.filter((entry) => entry.date === date); // Sélectionne les séances du jour courant.
    const weekday = new Date(`${date}T00:00:00.000Z`).getUTCDay(); // Trouve l'indice du jour pour son libellé français.
    return {
      day: DAYS_FR[weekday], // Associe l'indice au nom français du jour.
      min: dayActivities.length
        ? Math.min(...dayActivities.map((entry) => entry.heartRate.min)) // Garde la fréquence minimale parmi les séances du jour.
        : null, // Signale l'absence de mesure sans afficher une valeur inventée.
      max: dayActivities.length
        ? Math.max(...dayActivities.map((entry) => entry.heartRate.max)) // Garde la fréquence maximale parmi les séances du jour.
        : null, // Signale l'absence de mesure pour ce jour.
      moy: dayActivities.length
        ? Math.round(
            dayActivities.reduce((sum, entry) => sum + entry.heartRate.average, 0) /
              dayActivities.length
          ) // Calcule la moyenne des fréquences cardiaques relevées ce jour-là.
        : null, // Laisse la valeur vide plutôt que de calculer une moyenne inexistante.
    };
  });
  const averageBpm = period.length
    ? Math.round(
        period.reduce((sum, entry) => sum + entry.heartRate.average, 0) / period.length
      ) // Calcule la moyenne globale des fréquences de toutes les séances de la période.
    : 0; // Renvoie zéro si aucune séance n'est enregistrée.
  return {
    averageBpm, // Fournit la moyenne globale à afficher.
    dateRange: dateRangeLabel(startDate, endDate), // Fournit les bornes lisibles de la période.
    entries, // Fournit les mesures quotidiennes au graphique.
  };
}

// Prépare les données du graphique de distance à partir de la dernière activité.
// En l'absence de séances, renvoie quatre semaines à zéro.
export function transformToWeeklyKm(activities: ActivityEntry[]): WeeklyKmData {
  const latest = getLatestActivityDate(activities); // Ancre la période sur la date de la dernière séance.
  return latest
    ? transformToKmPeriod(activities, latest) // Calcule les quatre semaines qui précèdent cette date.
    : {
        averageKm: 0, // Définit une moyenne nulle quand il n'existe aucune séance.
        dateRange: "—", // Indique qu'aucune période ne peut être présentée.
        entries: WEEK_LABELS.map((semaine) => ({ semaine, km: 0 })), // Crée les quatre semaines du graphique avec zéro kilomètre.
      };
}

// Prépare le graphique cardiaque de la semaine la plus récente, avec un résultat vide par défaut.
export function transformToWeeklyBpm(activities: ActivityEntry[]): WeeklyBpmData {
  const latest = getLatestActivityDate(activities); // Repère la dernière séance pour choisir la semaine à représenter.
  return latest
    ? transformToBpmPeriod(activities, latest) // Calcule les mesures cardiaques des sept jours associés.
    : {
        averageBpm: 0, // Définit la moyenne à zéro en l'absence de mesures.
        dateRange: "—", // Marque la période comme indisponible.
        entries: DAYS_FR.slice(1).concat(DAYS_FR[0]).map((day) => ({
          day, min: null, max: null, moy: null, // Prépare chaque jour sans inventer des mesures absentes.
        })), // Renvoie sept entrées vides pour conserver la structure du graphique.
      };
}
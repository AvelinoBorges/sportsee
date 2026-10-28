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



////////////
/////////////////

// Authentifie l'utilisateur auprès du backend et renvoie son jeton ainsi que son identifiant.
export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    // Distingue une panne de connexion d'un refus d'authentification.
    throw new Error("Serveur indisponible. Assurez-vous que le backend est démarré.");
  }
  if (!res.ok) throw new Error("Nom d'utilisateur ou mot de passe incorrect.");
  return res.json();
}

// Récupère les informations du profil connecté ; le jeton sert à autoriser la requête.
export async function getUserInfo(token: string): Promise<UserInfoResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/user-info`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error("Serveur indisponible. Assurez-vous que le backend est démarré.");
  }
  // Signale séparément une session invalide afin que l'application puisse demander une reconnexion.
  if (res.status === 401) throw new Error("Session expirée. Veuillez vous reconnecter.");
  if (!res.ok) throw new Error("Erreur lors du chargement des données utilisateur.");
  return res.json();
}

// Charge les activités de l'utilisateur pour la période délimitée par les deux semaines fournies.
export async function getUserActivity(
  token: string,
  startWeek: string,
  endWeek: string
): Promise<ActivityEntry[]> {
  const params = new URLSearchParams({ startWeek, endWeek });
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/user-activity?${params}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error("Serveur indisponible. Assurez-vous que le backend est démarré.");
  }
  // Vérifie l'authentification avant de traiter les autres erreurs de l'API.
  if (res.status === 401) throw new Error("Session expirée. Veuillez vous reconnecter.");
  if (!res.ok) throw new Error("Erreur lors du chargement des activités.");
  return res.json();
}
// Définit les clés utilisées pour retrouver les données de connexion dans le stockage du navigateur.
const TOKEN_KEY = "sportsee_token";
const USER_KEY = "sportsee_userId";

// Enregistre le jeton et l'identifiant reçus après une authentification réussie.
export function setAuthToken(token: string, userId: string): void {
  localStorage.setItem(TOKEN_KEY, token); // Persiste le jeton afin de l'envoyer aux prochaines requêtes protégées.
  localStorage.setItem(USER_KEY, userId); // Persiste l'identifiant pour retrouver l'utilisateur connecté.
}

// Récupère le jeton ; renvoie null si le code s'exécute hors du navigateur ou si aucun jeton n'est enregistré.
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null; // Évite d'accéder au stockage navigateur lors d'une exécution côté serveur.
  return localStorage.getItem(TOKEN_KEY); // Renvoie le jeton enregistré, ou null s'il n'existe pas.
}

// Récupère l'identifiant stocké, avec une chaîne vide comme valeur en l'absence de navigateur ou d'identifiant.
export function getStoredUserId(): string {
  if (typeof window === "undefined") return ""; // Protège l'accès à localStorage hors du navigateur.
  return localStorage.getItem(USER_KEY) ?? ""; // Renvoie l'identifiant sauvegardé ou une chaîne vide.
}

// Termine la session locale en supprimant le jeton et l'identifiant de l'utilisateur.
export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY); // Supprime le jeton utilisé pour authentifier les requêtes.
  localStorage.removeItem(USER_KEY); // Supprime l'identifiant associé à la session.
}
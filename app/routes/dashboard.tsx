import type { Route } from "./+types/dashboard";
import { redirect } from "react-router";
import { DashboardPage } from "../components/DashboardPage";
import { getAuthToken, getStoredUserId } from "../utils/auth";

// Vérifie côté navigateur la session et la cohérence de l'identifiant dans l'URL.
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!getAuthToken()) throw redirect("/"); // Renvoie vers l'accueil si aucun jeton de connexion n'est enregistré.
  const userId = getStoredUserId(); // Récupère l'identifiant associé au jeton dans le stockage local.
  if (params.userId !== userId) throw redirect(`/dashboard/${userId}`); // Remplace un identifiant d'URL incorrect par celui de l'utilisateur connecté.
  return null; // Ne charge aucune donnée ici ; les données du tableau de bord viennent du contexte global.
}

// Permet au loader client de s'exécuter aussi lors de l'hydratation côté navigateur.
clientLoader.hydrate = true as const;

// Définit les métadonnées affichées par le navigateur et les moteurs de recherche.
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard — SportSee" },
    { name: "description", content: "Tableau de bord de vos performances sportives." },
  ];
}

export default function Dashboard() {
  return <DashboardPage />; // Affiche le contenu du tableau de bord après les vérifications du loader.
}
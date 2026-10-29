import { Outlet, Navigate } from "react-router";
import { getAuthToken } from "../utils/auth";

// Encadre les routes réservées aux utilisateurs possédant une session valide.
export default function ProtectedLayout() {
  // Vérifie le jeton uniquement dans le navigateur, où localStorage est disponible.
  if (typeof window !== "undefined" && !getAuthToken()) {
    return <Navigate to="/" replace />; // Redirige vers l'accueil sans ajouter la route protégée à l'historique.
  }
  return <Outlet />; // Affiche la route enfant lorsque l'accès est autorisé.
}
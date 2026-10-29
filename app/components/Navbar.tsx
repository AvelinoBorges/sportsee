import { Link, useLocation } from "react-router";
import { useAppContext } from "../context/AppContext";

// Barre de navigation principale : liens vers les pages utilisateur et action de déconnexion.
export function Navbar() {
  const location = useLocation(); // Récupère l'URL courante pour repérer le lien actif.
  const { userId, logout } = useAppContext(); // Lit l'identifiant de session et l'action de déconnexion du contexte global.
  // Construit les destinations avec l'identifiant de l'utilisateur connecté.
  const navLinks = [
    { label: "Dashboard", to: `/dashboard/${userId}` },
    { label: "Mon profil", to: `/profile/${userId}` },
  ];
  return (
    // Aligne le logo à gauche et les actions de navigation à droite.
    <nav className="mx-auto flex w-full max-w-[1140px] items-center justify-between font-[Inter,sans-serif]">
      {/* Affiche le logo de l'application avec un texte alternatif accessible. */}
      <img src="/logo.svg" alt="SportSee logo" className="h-6" />
      <div className="flex items-center gap-10 rounded-[40px] bg-white/90 px-12 py-4">
        <div className="flex items-center gap-10 border-r border-[#0B23F4] pr-10">
          {/* Génère un lien par destination et évite les clés dupliquées grâce à son URL. */}
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}
              className={`text-[14px] transition-colors ${
                // Compare la route sans l'identifiant pour surligner la page actuellement ouverte.
                location.pathname.startsWith(link.to.replace(`/${userId}`, ""))
                  ? "text-[#0B23F4]" : "text-[#111111] hover:text-[#0B23F4]"
              }`}>
              {link.label}
            </Link>
          ))}
        </div>
        {/* Appelle la fonction du contexte pour effacer la session et rediriger l'utilisateur. */}
        <button type="button" onClick={logout}
          className="text-[14px] text-[#0B23F4] hover:opacity-70">
          Se déconnecter
        </button>
      </div>
    </nav>
  );
}
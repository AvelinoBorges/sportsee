import { useState } from "react";
import { useNavigate } from "react-router";
import { setAuthToken } from "../utils/auth";
import { loginUser } from "../services/api";
import { useAppContext } from "../context/AppContext";

export function LoginPage() {
  const navigate = useNavigate(); // Récupère la fonction de navigation pour ouvrir le tableau de bord après connexion.
  const { refetchData } = useAppContext(); // Récupère l'action qui recharge les données globales de l'utilisateur.
  const [username, setUsername] = useState(""); // Stocke la valeur saisie dans le champ du nom d'utilisateur.
  const [password, setPassword] = useState(""); // Stocke le mot de passe saisi.
  const [error, setError] = useState(""); // Stocke le message à afficher si la connexion échoue.
  const [loading, setLoading] = useState(false); // Indique si la requête de connexion est en cours.

  async function handleLogin() {
    // Vérifie les champs avant d'envoyer une requête au backend.
    if (!username.trim() || !password) {
      setError("Veuillez renseigner votre nom d'utilisateur et mot de passe."); // Demande de compléter les deux champs.
      return; // Interrompt la fonction : les identifiants incomplets ne sont pas envoyés.
    }
    setLoading(true); // Désactive le bouton et affiche l'état de chargement.
    setError(""); // Efface une éventuelle erreur de tentative précédente.
    try {
      const { token, userId } = await loginUser(username.trim(), password); // Envoie les identifiants et récupère les données de session.
      setAuthToken(token, userId); // Enregistre le jeton et l'identifiant pour les prochains appels authentifiés.
      refetchData(); // Lance le chargement des informations et activités de l'utilisateur.
      navigate(`/dashboard/${userId}`); // Redirige vers le tableau de bord associé à cet utilisateur.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion."); // Affiche l'erreur retournée ou un message de remplacement.
    } finally {
      setLoading(false); // Termine l'état de chargement, en cas de succès comme d'échec.
    }
  }

  return (
    // Construit l'écran de connexion avec un panneau de formulaire et une illustration adaptative.
    <div className="flex h-screen w-full overflow-hidden bg-[#FAFAFA] font-[Inter,sans-serif]">
      <div className="flex h-full w-[40%] shrink-0 flex-col bg-[#F2F3FF] px-10 py-10 lg:px-25">
        {/* Affiche le logo en haut du panneau de connexion. */}
        <img src="/logo.svg" alt="SportSee logo" className="h-6 w-fit" />
        <div className="flex flex-1 items-center">
          <div className="flex w-full max-w-[420px] flex-col gap-10 rounded-[20px] bg-white px-10 py-10">
            <p className="text-[28px] font-semibold leading-[1.21] text-[#0B23F4]">
              Transformez<br />vos stats en résultats
            </p>
            <div className="flex flex-col gap-6">
              <p className="text-[22px] font-medium text-[#111111]">Se connecter</p>
              <label className="flex flex-col gap-2 text-[14px] text-[#707070]">
                Nom d'utilisateur
                {/* Lie la valeur du champ à l'état React pour garder la saisie synchronisée. */}
                <input value={username} onChange={(e) => setUsername(e.target.value)}
                  className="h-14 rounded-[10px] border border-[#71717180] bg-white px-4 text-[#111111] outline-none focus:border-[#0B23F4]" />
              </label>
              <label className="flex flex-col gap-2 text-[14px] text-[#707070]">
                Mot de passe
                {/* Masque le mot de passe et permet de soumettre le formulaire avec la touche Entrée. */}
                <input type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="h-14 rounded-[10px] border border-[#71717180] bg-white px-4 text-[#111111] outline-none focus:border-[#0B23F4]" />
              </label>
              {/* N'affiche un message que lorsqu'une erreur a été enregistrée. */}
              {error && <p className="text-[13px] text-red-500">{error}</p>}
            </div>
            {/* Empêche les soumissions multiples et reflète l'état de la requête dans le texte du bouton. */}
            <button type="button" onClick={handleLogin} disabled={loading}
              className="rounded-[10px] bg-[#0B23F4] px-10 py-4 text-[16px] font-medium text-white hover:opacity-90 disabled:opacity-60">
              {loading ? "Connexion…" : "Se connecter"}
            </button>
            <p className="text-[14px] text-[#111111]">Mot de passe oublié ?</p>
          </div>
        </div>
      </div>
      {/* Masque l'illustration sur les petits écrans et l'affiche à partir du format md. */}
      <div className="relative hidden flex-1 md:block">
        <img src="/background.png" alt="Sports background"
          className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute bottom-12 right-10 flex min-h-[62px] w-[288px] items-center justify-center rounded-[50px] bg-white px-4">
          <p className="text-center text-[12px] text-[#0B23F4]">
            Analysez vos performances en un clin d’œil,<br />suivez vos progrès et atteignez vos objectifs.
          </p>
        </div>
      </div>
    </div>
  );
}
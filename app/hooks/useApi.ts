import { useState, useEffect, useCallback, useRef } from "react";

// Décrit les trois états possibles d'une requête : résultat, chargement et erreur.
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Hook générique pour exécuter une requête asynchrone et exposer son état à un composant.
export function useApi<T>(
  // Une fonction déclenche la requête ; null permet de la désactiver tant que ses paramètres manquent.
  fetchFn: (() => Promise<T>) | null
): ApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<ApiState<T>>({
    data: null, // Aucune donnée n'est disponible avant la fin de la première requête.
    loading: fetchFn !== null, // Signale le chargement initial uniquement si une requête est prévue.
    error: null, // Aucune erreur n'a encore été rencontrée.
  });
  const fnRef = useRef(fetchFn); // Conserve la fonction la plus récente sans la capturer dans les callbacks.
  fnRef.current = fetchFn; // Met à jour la référence à chaque rendu pour utiliser les paramètres actuels.

  const execute = useCallback(() => {
    const fn = fnRef.current; // Récupère la requête la plus récente au moment de l'exécution.
    if (!fn) return; // N'effectue aucun appel si le hook est désactivé.
    setState({ data: null, loading: true, error: null }); // Réinitialise l'état avant un nouveau chargement.
    fn()
      .then((data) => setState({ data, loading: false, error: null })) // Enregistre le résultat et termine l'état de chargement.
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Erreur inconnue."; // Convertit les erreurs en message utilisable par l'interface.
        setState({ data: null, loading: false, error: message }); // Termine le chargement et expose l'erreur au composant.
      });
  }, []);

  useEffect(() => {
    if (fnRef.current) execute(); // Lance automatiquement la requête une seule fois au montage si elle est définie.
  }, []);

  return { ...state, refetch: execute }; // Expose l'état de la requête et une fonction de rechargement manuel.
}
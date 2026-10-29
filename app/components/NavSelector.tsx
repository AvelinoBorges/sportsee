// Définit le libellé de période et les actions/limites des boutons de navigation.
interface NavSelectorProps {
  label: string;
  showLabel?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
}

export function NavSelector({
  label,
  showLabel = true,
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
}: NavSelectorProps) {
  // Calcule l'apparence des flèches selon qu'elles peuvent être utilisées ou non.
  const buttonStyle = (enabled: boolean) => ({
    width: 24, // Garde une taille constante pour les deux boutons.
    height: 24,
    borderRadius: 10, // Arrondit les coins du bouton.
    border: "1px solid #717171", // Dessine une bordure discrète.
    flexShrink: 0 as const, // Empêche le bouton de rétrécir dans le conteneur flex.
    opacity: enabled ? 1 : 0.4, // Atténue visuellement une navigation désactivée.
    cursor: enabled ? "pointer" : "not-allowed", // Indique si l'action est disponible.
  });

  return (
    // Aligne les flèches et, si demandé, le libellé de la période.
    <div className="flex items-center justify-center" style={{
      gap: 6, padding: showLabel ? "14px 4px" : 0,
      width: showLabel ? 144 : "auto", borderRadius: 10,
    }}>
      {/* Le bouton gauche appelle onPrev et devient inactif si la période précédente est indisponible. */}
      <button type="button" onClick={onPrev} disabled={!canPrev}
        aria-label="Période précédente" className="flex items-center justify-center bg-white"
        style={buttonStyle(canPrev)}>
        {/* Dessine la flèche orientée vers la gauche en SVG. */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <polyline points="14,8 10,12 14,16" stroke="#111111" strokeWidth="1"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {/* Affiche le libellé uniquement lorsque showLabel est activé. */}
      {showLabel && <span className="whitespace-nowrap text-[12px] text-[#111111]">{label}</span>}
      {/* Le bouton droit appelle onNext et devient inactif si la période suivante est indisponible. */}
      <button type="button" onClick={onNext} disabled={!canNext}
        aria-label="Période suivante" className="flex items-center justify-center bg-white"
        style={buttonStyle(canNext)}>
        {/* Dessine la flèche orientée vers la droite en SVG. */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <polyline points="10,8 14,12 10,16" stroke="#111111" strokeWidth="1"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
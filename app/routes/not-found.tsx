import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-[#FAFAFA] font-[Inter,sans-serif]">
      <p className="text-[120px] font-bold leading-none text-[#0B23F4]">404</p>
      <p className="text-[24px] font-semibold text-[#111111]">Page introuvable</p>
      <p className="text-[14px] text-[#707070]">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="rounded-[10px] bg-[#0B23F4] px-8 py-4 text-[14px] font-medium text-white">
        Retour à l'accueil
      </Link>
    </div>
  );
}
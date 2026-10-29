export function Footer() {
  return (
    <footer className="flex w-full items-center justify-between bg-white px-10 py-6 font-[Inter,sans-serif]">
      <div className="flex items-center gap-6">
        <span className="text-[14px] text-[#111111]">©Sportsee</span>
        <span className="text-[14px] text-[#111111]">Tous droits réservés</span>
      </div>
      <div className="flex items-center gap-10">
        <a href="#" className="text-[14px] text-[#111111]">Conditions générales</a>
        <a href="#" className="text-[14px] text-[#111111]">Contact</a>
        <img src="/icon-logo.svg" alt="SportSee logo" className="h-6" />
      </div>
    </footer>
  );
}
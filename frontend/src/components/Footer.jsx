import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-amber-500 font-black text-xl tracking-wider justify-center">FLEETSYNC</span>
          <p className="text-xs text-zinc-500">&copy; {new Date().getFullYear()} FleetSync. Todos os direitos reservados à equipe FATEC.</p>
        </div>
      </div>
    </footer>
  );
}
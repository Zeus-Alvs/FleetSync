import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-amber-500 font-black text-xl tracking-wider">FLEETSYNC</span>
          <p className="text-xs text-zinc-500">&copy; {new Date().getFullYear()} FleetSync. Todos os direitos reservados à equipe FATEC.</p>
        </div>

        {/* Links Rápidos Redirecionáveis dentro da mesma tela */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-400">
          <a href="#inicio" className="hover:text-amber-500 transition-colors">Início</a>
          <a href="#sobre" className="hover:text-amber-500 transition-colors">Sobre</a>
          <a href="#features" className="hover:text-amber-500 transition-colors">Funcionalidades</a>
          <a href="#equipe" className="hover:text-amber-500 transition-colors">Equipe</a>
          <a href="#contato" className="hover:text-amber-500 transition-colors">Contato</a>
        </div>
      </div>
    </footer>
  );
}
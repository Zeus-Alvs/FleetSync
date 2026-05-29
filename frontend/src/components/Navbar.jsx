import React from 'react';

export default function Navbar({ onLoginClick }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-zinc-950/95 backdrop-blur-md border-b border-white/10 z-50 px-6 py-4 flex justify-between items-center text-white">
      <div className="flex items-center gap-2">
        {/* Espaço para a Logo */}
        <span className="text-amber-500 font-black text-2xl tracking-wider">FLEETSYNC</span>
      </div>
      
      {/* Links de Navegação */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
        <a href="#inicio" className="hover:text-amber-500 transition-colors">Início</a>
        <a href="#sobre" className="hover:text-amber-500 transition-colors">Sobre</a>
        <a href="#features" className="hover:text-amber-500 transition-colors">Funcionalidades</a>
        <a href="#equipe" className="hover:text-amber-500 transition-colors">Equipe</a>
        <a href="#contato" className="hover:text-amber-500 transition-colors">Contato</a>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onLoginClick}
          className="text-sm font-semibold hover:text-amber-500 transition-colors"
        >
          Entrar
        </button>
        <button className="bg-amber-500 text-black text-sm font-bold px-4 py-2 rounded shadow-md hover:bg-amber-400 transition-all transform hover:-translate-y-0.5">
          Cadastrar
        </button>
      </div>
    </nav>
  );
}
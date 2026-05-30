import React, { useState, useEffect } from 'react';

export default function Navbar({ onLoginClick, onNavigate, currentScreen }) {
  const [activeSection, setActiveSection] = useState('inicio');

  // Monitora o scroll da página apenas se estivermos na Home
  useEffect(() => {
    if (currentScreen !== 'home') return;

    const sections = ['inicio', 'sobre', 'features', 'equipe', 'contato'];
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [currentScreen]);

  const linkClass = (id) => {
    const baseClass = "transition-colors relative py-1 cursor-pointer";
    const activeClass = "text-amber-500 font-bold";
    const inactiveClass = "text-zinc-300 hover:text-amber-500";
    return `${baseClass} ${activeSection === id && currentScreen === 'home' ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-zinc-950/95 backdrop-blur-md border-b border-white/10 z-50 px-6 py-4 flex justify-between items-center text-white">
      
      {/* Logo - Agora clica para voltar para a Home de forma responsiva */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
        <span className="text-amber-500 font-black text-2xl tracking-wider">FLEETSYNC</span>
      </div>
      
      {/* Links de Navegação */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="#inicio" onClick={() => onNavigate('home')} className={linkClass('inicio')}>
          Início
          {activeSection === 'inicio' && currentScreen === 'home' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />}
        </a>
        <a href="#features" onClick={() => onNavigate('home')} className={linkClass('features')}>
          Funcionalidades
          {activeSection === 'features' && currentScreen === 'home' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />}
        </a>
        <a href="#equipe" onClick={() => onNavigate('home')} className={linkClass('equipe')}>
          Equipe
          {activeSection === 'equipe' && currentScreen === 'home' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />}
        </a>
        <a href="#contato" onClick={() => onNavigate('home')} className={linkClass('contato')}>
          Contato
          {activeSection === 'contato' && currentScreen === 'home' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />}
        </a>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onLoginClick}
          className="text-sm font-semibold hover:text-amber-500 transition-colors"
        >
          Entrar
        </button>
        
        {/* O SEU BOTÃO CADASTRAR - Agora configurado com a rota */}
        <button 
          onClick={() => onNavigate('cadastro')}
          className="bg-amber-500 text-black text-sm font-bold px-4 py-2 rounded shadow-md hover:bg-amber-400 transition-all transform hover:-translate-y-0.5"
        >
          Cadastrar
        </button>
      </div>
    </nav>
  );
}
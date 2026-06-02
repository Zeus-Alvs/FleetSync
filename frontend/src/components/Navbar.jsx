import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
export default function Navbar() {
  const [activeSection, setActiveSection] = useState('inicio');
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  useEffect(() => {
    if (!isHomePage) return;
    const sections = ['inicio', 'features', 'equipe', 'contato'];
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
  }, [isHomePage]);
  const linkClass = (id) => {
    const baseClass = "transition-colors relative py-1 cursor-pointer";
    const activeClass = "text-amber-500 font-bold";
    const inactiveClass = "text-zinc-300 hover:text-amber-500";
    return `${baseClass} ${activeSection === id && isHomePage ? activeClass : inactiveClass}`;
  };
  return (
    <nav className="fixed top-0 left-0 w-full bg-zinc-950/95 backdrop-blur-md border-b border-white/10 z-50 px-6 py-4 flex justify-between items-center text-white">
      {/* Logo - Clica e vai para a Home Real */}
      <Link to="/" className="flex items-center gap-2 cursor-pointer">
        <span className="text-amber-500 font-black text-2xl tracking-wider">FLEETSYNC</span>
      </Link>
      {/* Links de Navegação (Scroll Smooth funcionando com as tags a) */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        {isHomePage ? (
          <>
            <a href="#inicio" className={linkClass('inicio')}>Início</a>
            <a href="#features" className={linkClass('features')}>Funcionalidades</a>
            <a href="#equipe" className={linkClass('equipe')}>Equipe</a>
            <a href="#contato" className={linkClass('contato')}>Contato</a>
          </>
        ) : (
          <>
            <Link to="/" className="text-zinc-300 hover:text-amber-500">Voltar para Home</Link>
          </>
        )}
      </div>
      {/* Botões de Ação */}
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-sm font-semibold hover:text-amber-500 transition-colors"
        >
          Entrar
        </Link>
        {/* BOTÃO CADASTRAR ARRUMADO COM LINK ROUTER */}
        <Link
          to="/cadastro"
          className="bg-amber-500 text-black text-sm font-bold px-4 py-2 rounded shadow-md hover:bg-amber-400 transition-all transform hover:-translate-y-0.5"
        >
          Cadastrar
        </Link>
      </div>
    </nav>
  );
}
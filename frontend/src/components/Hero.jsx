import React from 'react';

export default function Hero() {
  return (
    <section id="inicio" className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-white">
      <div className="space-y-6">
        <span className="text-amber-500 font-bold tracking-widest text-sm uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Matchmaking Logístico Inteligente
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
          A rota certa entre a <span className="text-amber-500">carga</span> e o <span className="text-amber-500">motorista</span>.
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl">
          O FleetSync conecta pedidos, motoristas e operações em tempo real, otimizando entregas e gerando inteligência para frotas de ponta a ponta.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <button className="bg-amber-500 text-black font-bold px-6 py-3 rounded hover:bg-amber-400 transition-all">
            Solicitar Demonstração
          </button>
          <button className="bg-transparent border border-white/20 text-white font-bold px-6 py-3 rounded hover:bg-white/5 transition-all">
            Conhecer Sistema
          </button>
        </div>
      </div>

      {/* Área da Imagem Ilustrativa / Dashboard Mockup */}
      <div className="bg-zinc-950 border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden aspect-video flex justify-center items-center group">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
        {/* Aqui você pode colocar o mockup do painel administrativo ou mapa logístico */}
        <div className="text-center z-10">
          <p className="text-xs text-amber-500 uppercase font-mono tracking-widest mb-2">[ Interface do Sistema ]</p>
          <p className="text-zinc-400 text-sm">Dashboard operacional, mapas e telemetria em tempo real.</p>
        </div>
      </div>
    </section>
  );
}
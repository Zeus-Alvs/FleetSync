import React from 'react';

export default function Features() {
  const list = [
    { title: "Dashboard Operacional", text: "Visão analítica instantânea com gráficos de entregas e desempenho." },
    { title: "Controle de Motoristas", text: "Gerenciamento completo do perfil, turnos e categorias de CNH." },
    { title: "Gerenciamento de Pedidos", text: "Triagem e monitoramento do status de pacotes, do envio à entrega." },
    { title: "Mapa Logístico", text: "Plotagem dinâmica das rotas ativas com atualizações em tempo real." },
    { title: "Histórico de Entregas", text: "Auditoria detalhada de rotas passadas, canhotos e tempos de entrega." },
    { title: "Sistema de Matches", text: "Algoritmo exclusivo que cruza demandas urgentes com o motorista ideal." },
  ];

  return (
    <section id="features" className="py-20 px-6 max-w-7xl mx-auto text-white">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight">
          Funcionalidades <span className="text-amber-500">Principais</span>
        </h2>
        <p className="text-zinc-400">Recursos modulares projetados para entregar o controle absoluto da operação logística na ponta dos seus dedos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((feat, idx) => (
          <div 
            key={idx} 
            className="group bg-zinc-950 p-8 rounded-xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            {/* Ícone Estilizado Amarelo */}
            <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300 mb-6 border border-white/10 group-hover:border-amber-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-500 transition-colors">
              {feat.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{feat.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
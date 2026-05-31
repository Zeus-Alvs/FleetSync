import React from 'react';
export default function About() {
  return (
    <section id="sobre" className="py-20 px-6 bg-zinc-950 text-white border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Sobre o <span className="text-amber-500">Projeto</span>
          </h2>
          <br/>
          <p className="text-zinc-400 text-lg">
            O FleetSync nasceu com o propósito de revolucionar a coordenação de transporte de cargas, eliminando a ociosidade da frota e reduzindo drasticamente o tempo de espera através de tecnologia de ponta.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Monitoramento", desc: "Rastreamento em tempo real de motoristas e cargas no mapa." },
            { title: "Matchmaking", desc: "Distribuição inteligente baseada em geolocalização e capacidade." },
            { title: "Gestão de Frota", desc: "Controle completo sobre veículos disponíveis e status da CNH." },
            { title: "Otimização", desc: "Cálculo inteligente de trajetos para redução de custos de combustível." }
          ].map((item, index) => (
            <div key={index} className="bg-zinc-900 p-6 rounded-xl border border-white/5 space-y-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg border border-amber-500/20 flex items-center justify-center text-amber-500 font-mono font-bold">
                0{index + 1}
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
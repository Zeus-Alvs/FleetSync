import React, { useRef } from 'react';

export default function Team() {
  const scrollRef = useRef(null);

  const members = [
    { 
      name: "Brenno D'Luca", 
      role: "Backend Developer", 
      desc: "Responsável pela lógica.",
      image: "/members/brenno.jpeg"
    },
    { 
      name: "Eduarda Belles", 
      role: "Frontend Dev / UX Designer", 
      desc: "Desenvolveu os componentes interativos do ecossistema React.",
      image: "/members/eduarda.jpeg"
    },
    { 
      name: "Ellen Gouveia", 
      role: "Frontend Developer", 
      desc: "Responsável pelo desenvolvimento frontend do sistema.",
      image: "/members/ellen.jpeg"
    },
    { 
      name: "Luana Fontenelle", 
      role: "Frontend Developer", 
      desc: "Estruturou e desenvolveu as telas do frontend do sistema.",
      image: "/members/luana.jpeg"
    },
    { 
      name: "Zeus Machado", 
      role: "Full Stack Developer", 
      desc: "Responsável pelo backend e frontend do sistema.",
      image: "/members/zeus.jpeg"
    },
  ];

  const scroll = (direction) => {
    if (direction === 'left') {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    } else {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section id="equipe" className="py-20 px-6 bg-zinc-950 text-white border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Nossa <span className="text-amber-500">Equipe</span></h2>
            <p className="text-zinc-400 text-sm mt-2">Os desenvolvedores por trás da inteligência logística do FleetSync.</p>
          </div>
          {/* Setas Laterais de Navegação */}
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-white/10 hover:border-amber-500 bg-zinc-900 flex items-center justify-center text-white hover:text-amber-500 transition-colors">
              &#8592;
            </button>
            <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-white/10 hover:border-amber-500 bg-zinc-900 flex items-center justify-center text-white hover:text-amber-500 transition-colors">
              &#8594;
            </button>
          </div>
        </div>

        {/* Carrossel Horizontal */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {members.map((member, index) => (
            <div 
              key={index} 
              className="min-w-[280px] md:min-w-[340px] bg-zinc-900 border border-white/5 rounded-xl p-6 snap-start flex flex-col justify-between"
            >
              <div>
                {/* Imagem do Integrante com Círculo Perfeito */}
                <div className="w-16 h-16 rounded-full overflow-hidden border border-amber-500/30 bg-zinc-950 flex items-center justify-center text-amber-500 font-bold mb-4 text-xl">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { 
                        // Fallback caso a imagem dê erro ou não seja encontrada
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `<span>${member.name.charAt(0)}</span>`;
                      }}
                    />
                  ) : (
                    <span>{member.name.charAt(0)}</span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-xs font-mono text-amber-500 uppercase tracking-wider mb-4">{member.role}</p>
                <p className="text-sm text-zinc-400 leading-relaxed">{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
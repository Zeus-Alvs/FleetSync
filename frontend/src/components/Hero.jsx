import React, { useRef, useState } from 'react';

export default function Hero() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section id="inicio" className="pt-36 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-white">
      <div className="space-y-8">
        <div>
          <span className="text-amber-500 font-bold tracking-widest text-xs uppercase bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
            Matchmaking Logístico Inteligente
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white mt-2">
          A rota certa entre a <span className="text-amber-500">carga</span> e a <span className="text-amber-500">transportadora</span>
        </h1>
        <br/>
        <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
          O FleetSync conecta pedidos, transportadoras e operações em tempo real, otimizando entregas e gerando inteligência para frotas de ponta a ponta.
        </p>
        <br/>
        <div className="flex flex-wrap gap-4 pt-4">
          <button onClick={handlePlayVideo} className="bg-amber-500 text-black font-bold px-6 py-3 rounded shadow-md hover:bg-amber-400 transition-all transform hover:-translate-y-0.5">
            Solicitar Demonstração
          </button>
          <button className="bg-transparent border border-white/20 text-white font-bold px-6 py-3 rounded hover:bg-white/5 transition-all">
            Conhecer Sistema
          </button>
        </div>
      </div>
      <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden aspect-video flex justify-center items-center group bg-black">
        <video 
          ref={videoRef}
          src="/fleetsyncdemo.mp4#t=0.001" 
          preload="metadata"
          onEnded={handleVideoEnded}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${isPlaying ? 'opacity-100' : 'opacity-40 saturate-50'}`}
        />

        <div className={`absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent transition-opacity duration-500 pointer-events-none ${isPlaying ? 'opacity-0' : 'opacity-50 group-hover:opacity-80'}`} />

        <div className={`text-center z-10 space-y-2 transition-opacity duration-500 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <p className="text-xs text-amber-500 uppercase font-mono tracking-widest drop-shadow-lg font-bold">[ Interface do Sistema ]</p>
          <p className="text-zinc-200 text-sm drop-shadow-lg font-medium">Dashboard operacional, mapas e telemetria em tempo real.</p>
        </div>
      </div>
    </section>
  );
}
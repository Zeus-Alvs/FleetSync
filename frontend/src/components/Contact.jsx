import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import api from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    razaoSocial: '',
    cnpj: '',
    telefone: '',
    email: '',
    endereco: '',
    capacidadeCarga: ''
  });
  const [enviando, setEnviando] = useState(false);

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (formData.endereco.length > 4 && showSuggestions) {
        setIsSearchingAddress(true);
        try {
          const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
          if (!mapboxToken || mapboxToken === 'COLE_SEU_TOKEN_AQUI') return;

          const query = encodeURIComponent(formData.endereco + ", Brasil");
          const bbox = "-47.05,-24.35,-45.90,-23.75";
          const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxToken}&bbox=${bbox}&limit=5&language=pt`);
          const data = await res.json();
          setAddressSuggestions(data.features || []);
        } catch (error) {
          console.error("Erro na busca de endereço:", error);
        } finally {
          setIsSearchingAddress(false);
        }
      } else {
        setAddressSuggestions([]);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.endereco, showSuggestions]);

  const handleSelectSuggestion = (sug) => {
    const displayNameParts = sug.place_name.split(',');
    const displayName = displayNameParts.length >= 2 ? `${displayNameParts[0].trim()}, ${displayNameParts[1].trim()}` : sug.place_name;
    setFormData({ ...formData, endereco: displayName });
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setEnviando(true);
      await api.post('/api/solicitacoes', {
        ...formData,
        capacidadeCarga: Number(formData.capacidadeCarga)
      });
      alert('Solicitação enviada com sucesso! Nossa equipe entrará em contato.');
      setFormData({ razaoSocial: '', cnpj: '', telefone: '', email: '', endereco: '', capacidadeCarga: '' });
    } catch (err) {
      alert('Erro ao enviar solicitação. Tente novamente mais tarde.');
    } finally {
      setEnviando(false);
    }
  };
  return (
    <section id="contato" className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 text-white">
      {/* Formulário */}
      <div className="bg-zinc-950 p-8 rounded-2xl border border-white/5 space-y-6">
        <h3 className="text-2xl font-bold">Faça parte do <span className="text-amber-500">FleetSync</span></h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" required value={formData.razaoSocial} onChange={(e) => setFormData({...formData, razaoSocial: e.target.value})} placeholder="Razão Social" className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-amber-500" />
            <input type="text" required value={formData.cnpj} onChange={(e) => setFormData({...formData, cnpj: e.target.value})} placeholder="CNPJ" className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-amber-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" required value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} placeholder="Telefone" className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-amber-500" />
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="E-mail" className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-amber-500" />
          </div>
          <div className="relative">
            <input 
              type="text" 
              required 
              value={formData.endereco} 
              onChange={(e) => {
                setFormData({...formData, endereco: e.target.value});
                setShowSuggestions(true);
              }} 
              placeholder="Endereço da Transportadora" 
              className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-amber-500" 
            />
            {isSearchingAddress && (
              <div className="absolute right-3 top-3 text-xs text-amber-500 font-bold">...</div>
            )}
            {showSuggestions && addressSuggestions.length > 0 && (
              <div className="absolute top-[48px] left-0 right-0 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                {addressSuggestions.map((sug, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleSelectSuggestion(sug)}
                    className="px-3 py-2.5 text-xs hover:bg-zinc-700 cursor-pointer border-b border-zinc-700 last:border-0 flex items-start gap-2 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300 font-medium">{sug.place_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <input type="number" required value={formData.capacidadeCarga} onChange={(e) => setFormData({...formData, capacidadeCarga: e.target.value})} placeholder="Capacidade de Carga Total (kg)" className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-amber-500" />
          <button type="submit" disabled={enviando} className="w-full bg-amber-500 text-black font-bold py-3 rounded hover:bg-amber-400 transition-colors disabled:opacity-50">
            {enviando ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </form>
      </div>
      {/* Informações Institucionais */}
      <div className="flex flex-col justify-center space-y-8 lg:pl-6">
        <div className="space-y-2">
          <h3 className="text-3xl font-black tracking-tight">Fale Conosco</h3>
          <p className="text-zinc-400 text-sm">Nossa equipe de suporte e implantação está pronta para atender sua transportadora.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div>
              <p className="font-semibold text-white"> 📞 Telefone de Contato</p>
              <p className="text-sm text-zinc-400">0800 555 SYNC (7962)</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div>
              <p className="font-semibold text-white"> 📍 Localização</p>
              <p className="text-sm text-zinc-400">FATEC - Complexo Tecnológico de Logística</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div>
              <p className="font-semibold text-white"> 🕒Horário de Atendimento</p>
              <p className="text-sm text-zinc-400">Segunda a Sexta, das 08h às 22h</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
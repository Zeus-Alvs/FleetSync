import React, { useState, useEffect } from 'react';
import api from './services/api';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Package, ShieldCheck, MapPin } from 'lucide-react';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [enderecoSede, setEnderecoSede] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (enderecoSede.length > 4 && showSuggestions) {
        setIsSearchingAddress(true);
        try {
          const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
          if (!mapboxToken || mapboxToken === 'COLE_SEU_TOKEN_AQUI') {
            console.warn("Mapbox Token ausente! Adicione VITE_MAPBOX_TOKEN no .env");
            setIsSearchingAddress(false);
            return;
          }

          const query = encodeURIComponent(enderecoSede + ", Brasil");
          
          const bbox = "-47.05,-24.35,-45.90,-23.75";
          const geoResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxToken}&bbox=${bbox}&limit=5&language=pt`);
          const geoData = await geoResponse.json();
          setAddressSuggestions(geoData.features || []);
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
  }, [enderecoSede, showSuggestions]);

  const handleSelectSuggestion = (sug) => {
    const displayNameParts = sug.place_name.split(',');
    const displayName = displayNameParts.length >= 2 ? `${displayNameParts[0].trim()}, ${displayNameParts[1].trim()}` : sug.place_name;
    
    setEnderecoSede(displayName);
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const passwordRules = {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<> ]/.test(password),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (password !== confirmPassword) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (!passwordRules.length || !passwordRules.number) {
      setErro("A senha não atende aos requisitos mínimos de segurança.");
      return;
    }
    try {
      setCarregando(true);

      const payload = {
        nome: nome,
        email: email,
        senha: password,
        documento: documento,
        telefone: telefone,
        enderecoSede: enderecoSede,
        perfil: "EMPRESA"
      };

      await api.post('/api/auth/cadastro', payload);
      setIsSubmitted(true);
    } catch (err) {
      const mensagem = err.response?.data || "Ocorreu um erro ao tentar cadastrar o usuário no servidor.";
      setErro(typeof mensagem === 'string' ? mensagem : "Erro interno no servidor.");
    } finally {
      setCarregando(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white border border-zinc-200/60 rounded-2xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto shadow-md mb-6 animate-pulse">
            ✓
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Conta Criada!</h2>
          <p className="text-zinc-500 text-sm mb-8">
            Sua conta corporativa no <span className="font-bold text-amber-500">FLEETSYNC</span> foi configurada com sucesso.
          </p>
          <Link to="/login" className="block w-full bg-black text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-zinc-800 transition-all text-sm tracking-wide uppercase">
            Ir para o Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex text-zinc-900 font-sans bg-white">
      {/* Lado Esquerdo - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-20 relative py-12">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-black font-bold transition-colors text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 mb-2">Crie sua conta</h1>
            <p className="text-zinc-500 text-sm">Plataforma exclusiva para Empresas Embarcadoras e Logísticas.</p>
          </div>
          
          {erro && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium text-center">
              {erro}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Nome ou Razão Social</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Empresa Logística Ltda"
                  className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@empresa.com.br"
                  className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">CNPJ da Empresa</label>
                  <input
                    type="text"
                    required
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Telefone (WhatsApp)</label>
                  <input
                    type="text"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 90000-0000"
                    className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Endereço da Sede (Busca Inteligente)</label>
                <input
                  type="text"
                  required
                  value={enderecoSede}
                  onChange={(e) => {
                    setEnderecoSede(e.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder="Ex: Av. Paulista, 1000"
                  className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
                />
                {isSearchingAddress && (
                  <div className="absolute right-3 top-9 text-xs text-amber-500 font-bold">...</div>
                )}
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute top-[75px] left-0 right-0 bg-white border border-zinc-200 rounded-xl shadow-xl z-[9999] max-h-48 overflow-y-auto">
                    {addressSuggestions.map((sug, i) => (
                      <div 
                        key={i} 
                        onClick={() => handleSelectSuggestion(sug)}
                        className="px-3 py-2.5 text-xs hover:bg-amber-50 cursor-pointer border-b border-zinc-100 last:border-0 flex items-start gap-2 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-zinc-700 font-medium">{sug.place_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Crie uma Senha</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium pr-16"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-amber-500 transition-colors text-xs font-bold uppercase tracking-wider"
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Confirmar Senha</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] uppercase font-bold tracking-wider mt-2">
              <div className={`flex items-center gap-1.5 transition-colors ${passwordRules.length ? 'text-emerald-500' : 'text-zinc-400'}`}>
                <span>{passwordRules.length ? '✓' : '•'}</span> 8 caracteres
              </div>
              <div className={`flex items-center gap-1.5 transition-colors ${passwordRules.number ? 'text-emerald-500' : 'text-zinc-400'}`}>
                <span>{passwordRules.number ? '✓' : '•'}</span> 1 número
              </div>
              <div className={`flex items-center gap-1.5 transition-colors ${passwordRules.special ? 'text-emerald-500' : 'text-zinc-400'}`}>
                <span>{passwordRules.special ? '✓' : '•'}</span> 1 especial
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-amber-500 text-black font-black py-3.5 rounded-xl shadow-lg hover:bg-amber-400 transition-all mt-6 text-sm tracking-wide uppercase disabled:opacity-70 flex justify-center"
            >
              {carregando ? 'Processando...' : 'Criar Conta Gratuita'}
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-zinc-500 font-semibold">
            Já possui uma conta? <Link to="/login" className="text-black font-black hover:text-amber-500 ml-1 transition-colors">Faça Login</Link>
          </div>
        </div>
      </div>
      
      {/* Lado Direito - Branding / Visual */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 p-16 flex-col justify-between relative overflow-hidden">
        {/* Glows Decorativos */}
        <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <span className="text-black font-black text-2xl tracking-wider bg-amber-500 px-3 py-1 rounded-lg shadow-sm">FLEETSYNC</span>
        </div>
        
        <div className="relative z-10 mb-10 space-y-10">
          <div className="space-y-8">
            <div className="flex items-start gap-5">
              <div className="bg-white/10 p-3 rounded-xl text-amber-500 border border-white/5 shadow-lg"><Truck className="w-6 h-6" /></div>
              <div className="pt-1">
                <h3 className="text-white font-bold text-base">Despacho Otimizado</h3>
                <p className="text-zinc-400 text-sm mt-1 leading-relaxed">Conecte-se com as melhores transportadoras parceiras em um raio geográfico calculado matematicamente.</p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <div className="bg-white/10 p-3 rounded-xl text-amber-500 border border-white/5 shadow-lg"><Package className="w-6 h-6" /></div>
              <div className="pt-1">
                <h3 className="text-white font-bold text-base">Visibilidade Real-Time</h3>
                <p className="text-zinc-400 text-sm mt-1 leading-relaxed">Acompanhe sua frota em um mapa interativo vivo, sem depender de ligações e planilhas.</p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <div className="bg-white/10 p-3 rounded-xl text-amber-500 border border-white/5 shadow-lg"><ShieldCheck className="w-6 h-6" /></div>
              <div className="pt-1">
                <h3 className="text-white font-bold text-base">Infraestrutura Segura</h3>
                <p className="text-zinc-400 text-sm mt-1 leading-relaxed">Seus dados e credenciais estão blindados com criptografia corporativa robusta.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-zinc-500 text-xs font-medium tracking-wide uppercase">
          © {new Date().getFullYear()} FleetSync. All rights reserved.
        </div>
      </div>
    </div>
  );
}
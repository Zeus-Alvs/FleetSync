import React, { useState, useContext } from 'react';
import api from './services/api';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { ArrowLeft, Truck, Package, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      setCarregando(true);
      const response = await api.post('/api/auth/login', { email, senha });
      login(response.data.token, response.data.usuario);
      if (response.data.usuario.perfil === 'ADMIN') {
        navigate('/administracao');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErro('Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex text-zinc-900 font-sans bg-white">
      {/* Lado Esquerdo - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 relative">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-black font-bold transition-colors text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="max-w-sm w-full mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 mb-2">Bem-vindo de volta</h1>
            <p className="text-zinc-500 text-sm">Acesse sua torre de controle logístico e gerencie suas operações.</p>
          </div>
          {erro && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium text-center">
              {erro}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleLogin}>
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
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Senha</label>
                <button type="button" className="text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors">Esqueceu?</button>
              </div>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-black text-white font-bold py-3.5 rounded-xl shadow-lg shadow-zinc-200 hover:bg-zinc-800 transition-all mt-4 text-sm tracking-wide uppercase disabled:opacity-70 flex justify-center"
            >
              {carregando ? 'Acessando...' : 'Entrar na Plataforma'}
            </button>
          </form>
          <div className="mt-8 text-center text-xs text-zinc-500 font-semibold">
            Ainda não é parceiro? <Link to="/cadastro" className="text-amber-500 font-black hover:text-amber-600 ml-1">Criar Conta</Link>
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

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  if (!isOpen) return null;
  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }
    try {
      setCarregando(true);
      const response = await api.post('/api/auth/login', { email, senha });
      const usuarioLogado = response.data;
      const token = usuarioLogado.token || 'token-temporario-jwt-em-desenvolvimento';
      login(token, usuarioLogado);
      onClose();
      navigate('/dashboard');
    } catch (err) {
      const mensagem = err.response?.data || 'Credenciais inválidas ou servidor offline.';
      setErro(typeof mensagem === 'string' ? mensagem : 'Erro ao tentar autenticar.');
    } finally {
      setCarregando(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-zinc-950 border border-white/10 rounded-xl p-8 w-full max-w-md relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl"
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold text-white mb-2">Acesse o <span className="text-amber-500">FleetSync</span></h3>
        <p className="text-sm text-zinc-400 mb-6">Insira suas credenciais para acessar o painel operacional.</p>
        {erro && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded mb-4">
            {erro}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">E-mail</label>
            <input
              type="email"
              className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Senha</label>
            <input
              type="password"
              className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <div className="text-right">
            <a href="#recuperar" className="text-xs text-amber-500 hover:underline">Esqueceu a senha?</a>
          </div>
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-amber-500 text-black font-bold py-3 rounded hover:bg-amber-400 transition-colors mt-2 disabled:opacity-50"
          >
            {carregando ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}
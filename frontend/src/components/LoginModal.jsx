import React from 'react';

export default function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-zinc-950 border border-white/10 rounded-xl p-8 w-full max-w-md relative animate-fade-in text-white">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl"
        >
          &times;
        </button>
        
        <h3 className="text-2xl font-bold text-white mb-2">Acesse o <span className="text-amber-500">FleetSync</span></h3>
        <p className="text-sm text-zinc-400 mb-6">Insira suas credenciais para acessar o painel operacional.</p>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">E-mail ou Usuário</label>
            <input type="email" className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-amber-500" placeholder="exemplo@email.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Senha</label>
            <input type="password" className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-amber-500" placeholder="••••••••" />
          </div>
          
          <div className="text-right">
            <a href="#recuperar" className="text-xs text-amber-500 hover:underline">Esqueceu a senha?</a>
          </div>

          <button type="submit" className="w-full bg-amber-500 text-black font-bold py-3 rounded hover:bg-amber-400 transition-colors mt-2">
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}
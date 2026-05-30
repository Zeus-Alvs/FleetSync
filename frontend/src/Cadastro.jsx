import React, { useState } from 'react';

export default function Register() {
  const [userType, setUserType] = useState('driver');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const passwordRules = {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<> ]/.test(password),
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white border border-zinc-200/60 rounded-2xl p-8 shadow-xl shadow-zinc-200/50">
        
        {isSubmitted ? (
          <div className="text-center py-12 space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-amber-500 text-black rounded-full flex items-center justify-center text-3xl font-bold mx-auto shadow-md">
              ✓
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Cadastro Realizado!</h2>
              <p className="text-zinc-500 text-sm max-w-md mx-auto">
                Sua conta no <span className="font-bold text-amber-500">FLEETSYNC</span> foi criada com sucesso.
              </p>
            </div>
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-sm text-zinc-600 max-w-md mx-auto font-medium">
              💡 Para acessar a plataforma, utilize as suas credenciais realizando o login na <span className="font-bold text-amber-500 hover:text-black transition-colors cursor-pointer">tela inicial</span> do sistema.
            </div>
          </div>
        ) : (
          <>
            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <span className="text-black font-black text-2xl tracking-wider bg-amber-500 px-3 py-1 rounded-lg shadow-sm">FLEETSYNC</span>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mt-5">Crie sua conta gratuita</h2>
              <p className="text-zinc-500 text-sm mt-1">Selecione o seu perfil para continuar o cadastro.</p>
            </div>

            {/* Toggle de Seleção de Perfil */}
            <div className="flex bg-zinc-100 p-1.5 rounded-xl border border-zinc-200 mb-8">
              <button
                type="button"
                onClick={() => setUserType('driver')}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                  userType === 'driver' 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                🚚 Sou Motorista / Entregador
              </button>
              <button
                type="button"
                onClick={() => setUserType('company')}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                  userType === 'company' 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                🏢 Sou Empresa Cliente
              </button>
            </div>

            {/* Formulário Único */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Dados de Acesso */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
                <h3 className="text-sm font-mono text-zinc-900 uppercase tracking-wider font-bold border-b border-amber-500 pb-1 inline-block">Dados de Acesso</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500">E-mail corporativo/pessoal</label>
                    <input type="email" required placeholder="exemplo@email.com" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5 relative">
                    <label className="text-xs font-semibold text-zinc-500">Senha</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all pr-16" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors text-xs font-bold uppercase tracking-wider"
                      >
                        {showPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Regras da Senha */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className={`flex items-center gap-2 font-medium ${passwordRules.length ? 'text-emerald-600' : 'text-zinc-400'}`}>
                    <span className="text-sm">{passwordRules.length ? '✓' : '•'}</span> Pelo menos 8 caracteres
                  </div>
                  <div className={`flex items-center gap-2 font-medium ${passwordRules.number ? 'text-emerald-600' : 'text-zinc-400'}`}>
                    <span className="text-sm">{passwordRules.number ? '✓' : '•'}</span> Pelo menos 1 número
                  </div>
                  <div className={`flex items-center gap-2 font-medium ${passwordRules.special ? 'text-emerald-600' : 'text-zinc-400'}`}>
                    <span className="text-sm">{passwordRules.special ? '✓' : '•'}</span> 1 caractere especial
                  </div>
                </div>
              </div>

              {/* Formulário do Motorista */}
              {userType === 'driver' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-4">
                    <h3 className="text-sm font-mono text-zinc-900 uppercase tracking-wider font-bold border-b border-amber-500 pb-1 inline-block">Dados Pessoais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Nome Completo" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                      <input type="text" placeholder="CPF" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                      <input type="date" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-600 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                      <input type="text" placeholder="Telefone" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-mono text-zinc-900 uppercase tracking-wider font-bold border-b border-amber-500 pb-1 inline-block">Documentação</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input type="text" placeholder="Número da CNH" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                      <input type="text" placeholder="Categoria (Ex: C, D, E)" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                      <input type="date" placeholder="Validade" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-600 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-mono text-zinc-900 uppercase tracking-wider font-bold border-b border-amber-500 pb-1 inline-block">Informações Operacionais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-600 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all">
                        <option value="">Tipo de Veículo</option>
                        <option value="fiorino">Fiorino / Van</option>
                        <option value="toco">Caminhão Toco</option>
                        <option value="truck">Caminhão Truck</option>
                        <option value="carreta">Carreta</option>
                      </select>
                      <input type="text" placeholder="Placa do Veículo" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                      <input type="text" placeholder="Capacidade de Carga (kg)" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                      <input type="text" placeholder="Região de Atuação (Ex: SP - Baixada Santista)" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {/* Formulário da Empresa */}
              {userType === 'company' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-4">
                    <h3 className="text-sm font-mono text-zinc-900 uppercase tracking-wider font-bold border-b border-amber-500 pb-1 inline-block">Dados Corporativos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Razão Social" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                      <input type="text" placeholder="Nome Fantasia" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                      <input type="text" placeholder="CNPJ" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                      <input type="text" placeholder="Inscrição Estadual (Opcional)" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-mono text-zinc-900 uppercase tracking-wider font-bold border-b border-amber-500 pb-1 inline-block">Contato Responsável</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Nome do Responsável Operacional" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                      <input type="text" placeholder="Telefone Comercial / WhatsApp" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-mono text-zinc-900 uppercase tracking-wider font-bold border-b border-amber-500 pb-1 inline-block">Necessidades Logísticas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-600 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all">
                        <option value="">Frequência de Envios</option>
                        <option value="diario">Diário</option>
                        <option value="semanal">Semanal</option>
                        <option value="esporadico">Esporádico / Sazonal</option>
                      </select>
                      <select className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-600 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all">
                        <option value="">Ramo de Atuação principal</option>
                        <option value="ecommerce">E-commerce / Varejo</option>
                        <option value="industria">Indústria / Manufatura</option>
                        <option value="alimentos">Alimentos & Perecíveis</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Endereço Compartilhado */}
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-zinc-900 uppercase tracking-wider font-bold border-b border-amber-500 pb-1 inline-block">Endereço</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <input type="text" placeholder="CEP" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm col-span-2 md:col-span-1 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                  <input type="text" placeholder="Rua" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm col-span-2 md:col-span-2 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                  <input type="text" placeholder="Nº" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm col-span-2 md:col-span-1 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                  <input type="text" placeholder="Bairro" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm col-span-2 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                  <input type="text" placeholder="Cidade" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm col-span-1 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                  <input type="text" placeholder="UF" className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm col-span-1 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all" />
                </div>
              </div>

              {/* Botão de Envio */}
              <button 
                type="submit" 
                className="w-full bg-amber-500 text-black font-black py-3.5 px-4 rounded-xl shadow-md hover:bg-black hover:text-white transition-all transform hover:-translate-y-0.5 text-center mt-4 tracking-wide uppercase text-sm"
              >
                Finalizar Cadastro do {userType === 'driver' ? 'Motorista' : 'Cliente'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
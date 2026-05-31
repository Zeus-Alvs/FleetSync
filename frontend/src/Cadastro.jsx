import React, { useState } from 'react';
// Importamos nossa API centralizada
import api from './services/api';

export default function Register() {
  const [userType, setUserType] = useState('driver');
  const [showPassword, setShowPassword] = useState(false);

  // States para capturar os campos obrigatórios do Backend
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // States de feedback da tela
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const passwordRules = {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<> ]/.test(password),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    // Validação básica do lado do cliente
    if (!passwordRules.length || !passwordRules.number) {
      setErro("A senha não atende aos requisitos mínimos de segurança.");
      return;
    }

    try {
      setCarregando(true);

      // Enviamos o POST para o nosso Backend Java
      // A role será definida como OPERADOR como padrão por enquanto
      const payload = {
        nome: nome,
        email: email,
        senha: password,
        perfil: "OPERADOR"
      };

      await api.post('/api/auth/cadastro', payload);

      // Se a API retornar sucesso, mostramos a tela verde!
      setIsSubmitted(true);

    } catch (err) {
      // Pega a mensagem de erro que o Java mandar (ex: "Email já cadastrado")
      const mensagem = err.response?.data || "Ocorreu um erro ao tentar cadastrar o usuário no servidor.";
      setErro(typeof mensagem === 'string' ? mensagem : "Erro interno no servidor.");
    } finally {
      setCarregando(false);
    }
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
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${userType === 'driver'
                  ? 'bg-black text-white shadow-md'
                  : 'text-zinc-500 hover:text-zinc-900'
                  }`}
              >
                🚚 Sou Motorista / Entregador
              </button>
              <button
                type="button"
                onClick={() => setUserType('company')}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${userType === 'company'
                  ? 'bg-black text-white shadow-md'
                  : 'text-zinc-500 hover:text-zinc-900'
                  }`}
              >
                🏢 Sou Empresa Cliente
              </button>
            </div>

            {/* Exibe erro da API se houver */}
            {erro && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{erro}</span>
              </div>
            )}

            {/* Formulário Único */}
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* Dados de Acesso */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
                <h3 className="text-sm font-mono text-zinc-900 uppercase tracking-wider font-bold border-b border-amber-500 pb-1 inline-block">Dados de Acesso</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-zinc-500">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Zeus Alves"
                      className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500">E-mail corporativo/pessoal</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemplo@email.com"
                      className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
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
                <div className="space-y-6 animate-fadeIn opacity-50 cursor-not-allowed">
                  <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Aviso</p>
                    <p>O cadastro de dados adicionais do motorista ainda não está integrado à API. Preencha apenas os Dados de Acesso acima por enquanto.</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-mono text-zinc-900 uppercase tracking-wider font-bold border-b border-amber-500 pb-1 inline-block">Dados Pessoais (Desativado temporariamente)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" disabled placeholder="CPF" className="bg-gray-100 border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800" />
                      <input type="text" disabled placeholder="Telefone" className="bg-gray-100 border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800" />
                    </div>
                  </div>
                </div>
              )}

              {/* Formulário da Empresa */}
              {userType === 'company' && (
                <div className="space-y-6 animate-fadeIn opacity-50 cursor-not-allowed">
                  <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Aviso</p>
                    <p>O cadastro de dados empresariais ainda não está integrado à API. Preencha apenas os Dados de Acesso acima por enquanto.</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-mono text-zinc-900 uppercase tracking-wider font-bold border-b border-amber-500 pb-1 inline-block">Dados Corporativos (Desativado temporariamente)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" disabled placeholder="Razão Social" className="bg-gray-100 border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800" />
                      <input type="text" disabled placeholder="CNPJ" className="bg-gray-100 border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-800" />
                    </div>
                  </div>
                </div>
              )}

              {/* Botão de Envio */}
              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-amber-500 text-black font-black py-3.5 px-4 rounded-xl shadow-md hover:bg-black hover:text-white transition-all transform hover:-translate-y-0.5 text-center mt-4 tracking-wide uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {carregando ? 'Processando Cadastro...' : `Finalizar Cadastro do ${userType === 'driver' ? 'Motorista' : 'Cliente'}`}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
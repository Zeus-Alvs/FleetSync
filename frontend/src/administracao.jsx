import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { 
  Users, Truck, MessageSquare, LayoutDashboard, Search, ChevronRight, 
  MapPin, CheckCircle2, Shield, Briefcase, Phone, Mail, User, LogOut, X
} from 'lucide-react';
import api from './services/api';

export default function Administracao() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('transportadoras'); // 'transportadoras', 'usuarios', 'solicitacoes'
  const [activeModal, setActiveModal] = useState(null);
  
  const [transportadoras, setTransportadoras] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redireciona não-admins (Opcional, se o perfil for 'ADMIN')
  if (user && user.perfil !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    carregarDados();
  }, [activeTab]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      if (activeTab === 'transportadoras') {
        const res = await api.get('/api/transportadoras');
        setTransportadoras(res.data);
      } else if (activeTab === 'usuarios') {
        const res = await api.get('/api/usuarios');
        setUsuarios(res.data);
      } else if (activeTab === 'solicitacoes') {
        const res = await api.get('/api/solicitacoes');
        setSolicitacoes(res.data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirTransportadora = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transportadora do sistema?')) {
      try {
        await api.delete(`/api/transportadoras/${id}`);
        setTransportadoras(transportadoras.filter(t => t.id !== id));
      } catch (err) {
        alert('Erro ao excluir transportadora. Ela pode ter dependências (ex: motoristas vinculados).');
      }
    }
  };

  const handleExcluirUsuario = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/api/usuarios/${id}`);
        setUsuarios(usuarios.filter(u => u.id !== id));
      } catch (err) {
        alert('Erro ao excluir usuário.');
      }
    }
  };

  const handleRejeitarSolicitacao = async (id) => {
    if (window.confirm('Tem certeza que deseja rejeitar esta solicitação?')) {
      try {
        await api.delete(`/api/solicitacoes/${id}`);
        setSolicitacoes(solicitacoes.filter(s => s.id !== id));
      } catch (err) {
        alert('Erro ao rejeitar solicitação.');
      }
    }
  };

  const handleAprovarSolicitacao = async (s) => {
    if (window.confirm('Aprovar cadastro e registrar como Transportadora oficial?')) {
      try {
        let lat = 0;
        let lon = 0;
        
        const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
        if (mapboxToken && mapboxToken !== 'COLE_SEU_TOKEN_AQUI') {
          const query = encodeURIComponent(s.endereco + ", Brasil");
          const geoRes = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxToken}&limit=1`);
          const geoData = await geoRes.json();
          if (geoData.features && geoData.features.length > 0) {
             lon = geoData.features[0].center[0];
             lat = geoData.features[0].center[1];
          }
        }

        // Criar transportadora
        const res = await api.post('/api/transportadoras', {
          nomeEmpresa: s.razaoSocial,
          cnpj: s.cnpj,
          telefone: s.telefone,
          email: s.email,
          endereco: s.endereco,
          capacidade: s.capacidadeCarga,
          latitude: lat,
          longitude: lon
        });
        
        setTransportadoras([...transportadoras, res.data]);

        // Deletar da fila de solicitacoes
        await api.delete(`/api/solicitacoes/${s.id}`);
        setSolicitacoes(solicitacoes.filter(sol => sol.id !== s.id));
        alert('Transportadora aprovada e registrada com sucesso!');
      } catch (err) {
        alert('Erro ao aprovar solicitação.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans antialiased text-zinc-800">
      {/* Navbar Superior (Estilo Torre de Controle) */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-800 px-6 flex items-center justify-between z-40 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 text-zinc-950 p-2 rounded-xl flex items-center justify-center shadow-md shadow-amber-400/10 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Shield className="w-5 h-5 fill-zinc-950 stroke-zinc-950 stroke-[1.5]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">
                Fleet<span className="text-amber-400">Sync</span>
              </span>
              <span className="text-[9px] block font-mono text-zinc-500 tracking-widest -mt-1 font-bold">
                ADMINISTRATION
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-[1px] bg-zinc-800"></div>
          <button onClick={() => setActiveModal('profile')} className="flex items-center gap-3 pl-1 pr-2 py-1 hover:bg-zinc-900 rounded-xl transition-all cursor-pointer text-left">
            <div className="w-8 h-8 bg-amber-400 text-zinc-950 rounded-xl flex items-center justify-center font-bold shadow-md">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-zinc-200">Administrador</p>
              <p className="text-[10px] text-amber-400 font-mono tracking-wide font-medium">Painel Admin</p>
            </div>
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
        {/* Cabeçalho da Página */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Painel de Administração</h1>
          <p className="text-sm text-zinc-500 mt-1">Gerencie transportadoras, usuários do sistema e aprovações de onboarding.</p>
        </div>

        {/* Abas Superiores */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-zinc-200 pb-4">
          <button 
            onClick={() => setActiveTab('transportadoras')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'transportadoras' ? 'bg-zinc-950 text-white shadow-md' : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50'
            }`}
          >
            <Truck className="w-4 h-4" /> Frota & Transportadoras
          </button>
          <button 
            onClick={() => setActiveTab('usuarios')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'usuarios' ? 'bg-zinc-950 text-white shadow-md' : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50'
            }`}
          >
            <Users className="w-4 h-4" /> Contas de Usuários
          </button>
          <button 
            onClick={() => setActiveTab('solicitacoes')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'solicitacoes' ? 'bg-zinc-950 text-white shadow-md' : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Solicitações B2B
          </button>
        </div>

        {/* Área de Conteúdo */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm min-h-[500px]">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-zinc-400 font-bold">
              <span className="animate-pulse">Carregando dados estruturais...</span>
            </div>
          ) : (
            <>
              {/* === TAB: TRANSPORTADORAS === */}
              {activeTab === 'transportadoras' && (
                <div className="space-y-4">
                  {transportadoras.length === 0 ? (
                    <div className="text-center text-zinc-400 py-10">Nenhuma transportadora registrada.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {transportadoras.map(t => (
                        <div key={t.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-amber-400 transition-colors group relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/10 rounded-bl-full -z-0"></div>
                          <div className="flex items-center justify-between z-10 relative">
                            <span className="text-xs font-mono font-bold text-zinc-400">CNPJ: {t.cnpj}</span>
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase">{t.capacidade} kg</span>
                          </div>
                          <h4 className="font-bold text-zinc-900 mt-2 z-10 relative">{t.nomeEmpresa}</h4>
                          <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1 z-10 relative"><MapPin className="w-3 h-3 text-zinc-400" /> {t.endereco}</p>
                          <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-xs font-bold z-10 relative">
                            <span className="text-zinc-600 flex items-center gap-1"><Phone className="w-3 h-3"/> {t.telefone}</span>
                            <button onClick={() => handleExcluirTransportadora(t.id)} className="text-rose-600 hover:text-rose-700 flex items-center gap-0.5 transition-colors">Excluir <ChevronRight className="w-3 h-3" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* === TAB: USUARIOS === */}
              {activeTab === 'usuarios' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        <th className="pb-3 pl-2">ID</th>
                        <th className="pb-3">Nome do Operador</th>
                        <th className="pb-3">Contato</th>
                        <th className="pb-3">Perfil</th>
                        <th className="pb-3 text-right pr-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {usuarios.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-10 text-zinc-400">Nenhum usuário cadastrado.</td></tr>
                      ) : (
                        usuarios.map(u => (
                          <tr key={u.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                            <td className="py-3 pl-2 font-mono text-zinc-400 text-xs">#{u.id}</td>
                            <td className="py-3 font-bold text-zinc-900">{u.nome}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-1 text-zinc-500 text-xs"><Mail className="w-3 h-3"/> {u.email}</div>
                              <div className="flex items-center gap-1 text-zinc-500 text-xs mt-0.5"><Phone className="w-3 h-3"/> {u.telefone || '-'}</div>
                            </td>
                            <td className="py-3">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${u.perfil === 'ADMIN' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                                {u.perfil}
                              </span>
                            </td>
                            <td className="py-3 text-right pr-2">
                              <button onClick={() => handleExcluirUsuario(u.id)} className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors">Excluir</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* === TAB: SOLICITACOES === */}
              {activeTab === 'solicitacoes' && (
                <div className="space-y-4">
                  {solicitacoes.length === 0 ? (
                    <div className="text-center text-zinc-400 py-10 flex flex-col items-center">
                      <CheckCircle2 className="w-12 h-12 text-zinc-200 mb-2" />
                      Caixa de entrada limpa. Nenhuma solicitação B2B pendente.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {solicitacoes.map(s => (
                        <div key={s.id} className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-amber-400 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                              <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="font-bold text-zinc-900 text-base">{s.razaoSocial}</h5>
                              <p className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-[10px] bg-zinc-200 px-1.5 rounded text-zinc-700">CNPJ: {s.cnpj}</span>
                                <span>{s.telefone} • {s.email}</span>
                              </p>
                              <p className="text-xs text-zinc-600 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-zinc-400" /> {s.endereco}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right mr-4">
                              <p className="text-[10px] font-bold text-zinc-400 uppercase">Capacidade Info</p>
                              <p className="text-sm font-black text-zinc-900">{s.capacidadeCarga} kg</p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <button onClick={() => handleAprovarSolicitacao(s)} className="bg-zinc-900 text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-amber-500 hover:text-black transition-colors cursor-pointer">Aprovar Cadastro</button>
                              <button onClick={() => handleRejeitarSolicitacao(s.id)} className="bg-zinc-200 text-zinc-700 text-[10px] font-bold px-3 py-1.5 rounded hover:bg-rose-500 hover:text-white transition-colors cursor-pointer">Rejeitar</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal Profile */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-zinc-950 text-white px-5 py-4 flex items-center justify-between">
              <h4 className="text-base font-bold text-amber-400">Perfil do Administrador</h4>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 bg-zinc-950 text-amber-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold border border-zinc-800 shadow-md">
                  {user?.nome ? user.nome.substring(0, 2).toUpperCase() : 'AD'}
                </div>
                <div>
                  <h5 className="font-bold text-zinc-900 text-base">{user?.nome || 'Administrador'}</h5>
                  <p className="text-xs text-amber-500 font-mono font-bold mt-0.5">Perfil: {user?.perfil || 'ADMIN'}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button onClick={() => setActiveModal(null)} className="bg-zinc-100 text-zinc-700 py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-200 cursor-pointer">
                    Voltar
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="bg-rose-50 text-rose-700 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-100 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sair do Sistema
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

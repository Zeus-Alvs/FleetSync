import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import {
  Truck, Search, Bell, User, Zap, RefreshCw, CheckCircle2,
  X, MapPin, Check, ThumbsDown, Package, LogOut, ArrowRight
} from 'lucide-react';
import api from './services/api';

function Menu({ searchQuery, setSearchQuery, onOpenNotifications, onOpenProfile }) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-800 px-6 flex items-center justify-between z-40 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="bg-amber-400 text-zinc-950 p-2 rounded-xl flex items-center justify-center shadow-md shadow-amber-400/10">
          <Truck className="w-5 h-5 fill-zinc-950 stroke-zinc-950 stroke-[1.5]" />
        </div>
        <div>
          <span className="text-xl font-black tracking-tight text-white">
            Fleet<span className="text-amber-400">Sync</span>
          </span>
          <span className="text-[9px] block font-mono text-zinc-500 tracking-widest -mt-1 font-bold">
            LOGISTICS HUB
          </span>
        </div>
      </div>
      <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-1.5 w-96 gap-2 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/30 transition-all">
        <Search className="w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar pedidos, rotas ou motoristas..."
          className="bg-transparent text-sm w-full focus:outline-none placeholder-zinc-600 text-zinc-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onOpenNotifications} className="relative p-2 hover:bg-zinc-900 rounded-xl text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-zinc-950"></span>
        </button>
        <div className="h-6 w-[1px] bg-zinc-800"></div>
        <button onClick={onOpenProfile} className="flex items-center gap-3 pl-1 pr-2 py-1 hover:bg-zinc-900 rounded-xl transition-all cursor-pointer text-left">
          <div className="w-8 h-8 bg-amber-400 text-zinc-950 rounded-xl flex items-center justify-center font-bold shadow-md">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-zinc-200">Controlador Central</p>
            <p className="text-[10px] text-amber-400 font-mono tracking-wide font-medium">Painel SP</p>
          </div>
        </button>
      </div>
    </nav>
  );
}

export default function FleetSyncMatchmaking() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // States do "Tinder" Logístico
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [currentRecIndex, setCurrentRecIndex] = useState(0);
  const [buscandoMatches, setBuscarMatches] = useState(false);

  useEffect(() => {
    carregarPedidosPendentes();
  }, []);

  const carregarPedidosPendentes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pedidos/pendentes');
      setOrders(response.data || []);
      setCurrentOrderIndex(0);
      setRecommendations([]);
      setCurrentRecIndex(0);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const activeOrder = orders[currentOrderIndex];
  const activeRec = recommendations[currentRecIndex];

  const processarMatchmaking = async () => {
    if (!activeOrder) return;
    try {
      setBuscarMatches(true);
      // Busca motoristas recomendados para o pedido atual
      const response = await api.get(`/matches/recomendar/${activeOrder.id}`);
      setRecommendations(response.data || []);
      setCurrentRecIndex(0);
    } catch (error) {
      console.error("Erro ao buscar recomendações:", error);
    } finally {
      setBuscarMatches(false);
    }
  };

  // RF03: Botão de Aceitar
  const handleAceitar = async () => {
    try {
      await api.post(`/matches/${activeOrder.id}/responder`, { 
        status: "ACEITO", 
        motoristaId: activeRec.motorista?.id || activeRec.id 
      });
      // Remove o pedido atual da fila e avança
      avancarPedido();
    } catch (error) {
      alert("Falha ao processar o Match (Aceite).");
    }
  };

  // RF03: Botão de Recusar (Banir/Descartar Motorista)
  const handleRecusar = async () => {
    try {
      await api.post(`/matches/${activeOrder.id}/responder`, { 
        status: "RECUSADO", 
        motoristaId: activeRec.motorista?.id || activeRec.id 
      });
      
      // Avança para o próximo motorista da lista
      if (currentRecIndex + 1 < recommendations.length) {
        setCurrentRecIndex(prev => prev + 1);
      } else {
        // Se acabaram os motoristas para este pedido, pula para o próximo pedido
        avancarPedido();
      }
    } catch (error) {
      alert("Falha ao recusar o motorista na API.");
    }
  };

  const avancarPedido = () => {
    const novosPedidos = orders.filter((_, index) => index !== currentOrderIndex);
    setOrders(novosPedidos);
    
    // Reseta os cards para o próximo pedido da fila
    if (novosPedidos.length > 0) {
      setCurrentOrderIndex(0);
      setRecommendations([]);
      setCurrentRecIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-800 font-sans antialiased flex flex-col pt-16">
      <Menu
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenNotifications={() => setActiveModal('notifications')}
        onOpenProfile={() => setActiveModal('profile')}
      />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-4 mb-8">
          <div>
            <h2 className="text-xl font-black !text-black tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 fill-amber-400 stroke-zinc-950 stroke-[1.5] text-black" /> Deck de Matchmaking
            </h2>
            <p className="text-xs text-zinc-500">Aprovação unitária de operadores via cálculo de Haversine e SLA</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={carregarPedidosPendentes} className="p-2 border border-zinc-200 bg-white hover:bg-zinc-50 rounded-xl text-zinc-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} /> Sincronizar Fila
            </button>
          </div>
        </div>

        {/* CENÁRIO 1: Fila Vazia */}
        {!loading && !activeOrder && (
          <div className="bg-white border border-dashed border-zinc-300 rounded-3xl p-16 text-center flex flex-col items-center justify-center max-w-xl mx-auto mt-10 shadow-sm">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6 border border-zinc-100">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">Fila Zerada!</h3>
            <p className="text-sm text-zinc-500 font-medium">Você processou todos os matches pendentes. O sistema notificará quando novas ordens de serviço entrarem na malha.</p>
          </div>
        )}

        {/* CENÁRIO 2: Pedido Ativo, mas Algoritmo não rodou ainda */}
        {!loading && activeOrder && recommendations.length === 0 && (
          <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-200 flex flex-col mt-4 animate-fadeIn">
            <div className="bg-zinc-950 p-6 text-white text-center flex flex-col items-center">
              <Package className="w-12 h-12 text-amber-400 mb-3 opacity-80" />
              <span className="text-amber-400 font-mono text-[10px] font-bold tracking-widest uppercase">Ordem Pendente</span>
              <h3 className="font-black text-xl mt-1 truncate w-full">{activeOrder.cliente || 'Cliente Padrão'}</h3>
              <p className="text-zinc-400 text-xs flex items-center justify-center gap-1 mt-2">
                <MapPin className="w-3.5 h-3.5"/> {activeOrder.enderecoEntrega}
              </p>
            </div>
            <div className="p-8 text-center flex flex-col items-center justify-center flex-1 bg-zinc-50">
              <p className="text-sm text-zinc-600 font-medium mb-6">
                Este pedido requer um motorista para uma carga de <strong className="text-zinc-900">{activeOrder.pesoCarga}kg</strong>.
              </p>
              <button 
                onClick={processarMatchmaking}
                disabled={buscandoMatches}
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {buscandoMatches ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-zinc-950" />}
                {buscandoMatches ? 'Mapeando...' : 'Rodar Algoritmo de Match'}
              </button>
              <button onClick={avancarPedido} className="mt-4 text-xs font-bold text-zinc-400 hover:text-zinc-800 transition-colors flex items-center gap-1">
                Pular pedido por agora <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* CENÁRIO 3: Tinder Card (Algoritmo Rodou e tem motoristas) */}
        {!loading && activeOrder && activeRec && (
          <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 flex flex-col mt-4 relative animate-fadeIn transform transition-transform">
            
            {/* Cabeçalho do Pedido (Contexto) */}
            <div className="bg-zinc-950 p-5 text-white">
              <div className="flex justify-between items-start">
                <span className="text-amber-400 font-mono text-[10px] font-bold tracking-wider">PEDIDO #{activeOrder.id}</span>
                <span className="bg-white/10 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-white/5">{activeOrder.nivelUrgencia || 'NORMAL'}</span>
              </div>
              <h3 className="font-bold text-lg mt-1 truncate">{activeOrder.cliente || 'Cliente'}</h3>
              <p className="text-zinc-400 text-xs flex items-center gap-1 mt-1.5"><MapPin className="w-3 h-3"/> {activeOrder.enderecoEntrega}</p>
            </div>

            {/* Corpo do Motorista (O Match) */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center relative bg-gradient-to-b from-white to-zinc-50">
              
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg font-black text-xs shadow-sm border border-amber-200">
                <Zap className="w-3 h-3 fill-amber-500" /> {activeRec.scoreCompatibilidade || '98'}% Match
              </div>

              <div className="w-24 h-24 bg-zinc-100 rounded-full mb-4 flex items-center justify-center border-4 border-white shadow-lg relative">
                <User className="w-10 h-10 text-zinc-400" />
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>

              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{activeRec.motorista?.nome || 'Nome do Operador'}</h2>
              <p className="text-sm font-bold text-zinc-500 mt-1">{activeRec.veiculo?.tipoVeiculo || 'Veículo'} • Cap: {activeRec.veiculo?.capacidadeCarga || '1000'}kg</p>
              
              {/* O GAP 2.3: Exibição da Distância em KM */}
              <div className="mt-6 w-full bg-white rounded-2xl p-4 border border-zinc-200 flex justify-between items-center shadow-sm">
                <div className="text-left">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Distância Coleta</p>
                  <p className="text-lg font-black text-zinc-900 flex items-end gap-1">
                    {activeRec.distanciaKm || '4.2'} <span className="text-xs text-zinc-500 mb-1">KM</span>
                  </p>
                </div>
                <div className="w-[1px] h-8 bg-zinc-200"></div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Desvio de Rota</p>
                  <p className="text-lg font-black text-emerald-600 flex items-end justify-end gap-1">
                    Mínimo
                  </p>
                </div>
              </div>
            </div>

            {/* Rodapé: Botões de Ação (Tinder Style) */}
            <div className="p-6 flex justify-center gap-8 bg-white border-t border-zinc-100">
              <button 
                onClick={handleRecusar} 
                className="w-16 h-16 rounded-full bg-white border-[3px] border-rose-100 text-rose-500 flex items-center justify-center hover:bg-rose-50 hover:border-rose-500 hover:scale-110 transition-all shadow-md cursor-pointer group"
                title="Recusar e ver próximo"
              >
                <X className="w-8 h-8 stroke-[3] group-hover:scale-110 transition-transform" />
              </button>
              
              <button 
                onClick={handleAceitar} 
                className="w-16 h-16 rounded-full bg-white border-[3px] border-emerald-100 text-emerald-500 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-500 hover:scale-110 transition-all shadow-md cursor-pointer group"
                title="Aprovar Match"
              >
                <Check className="w-8 h-8 stroke-[3] group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* MODAIS GLOBAIS DA PÁGINA (Mantidos para perfil e notificações) */}
      {activeModal && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="bg-zinc-950 text-white px-5 py-4 flex items-center justify-between">
              <h4 className="text-base font-bold text-amber-400">
                {activeModal === 'notifications' && "Central de Alertas"}
                {activeModal === 'profile' && "Perfil do Operador Logístico"}
              </h4>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5">
              {activeModal === 'notifications' && (
                <div className="space-y-3">
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full mt-1.5 bg-emerald-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Deck Operacional</p>
                      <p className="text-xs text-zinc-500 mt-0.5">O Algoritmo de Matchmaking está calibrado e online.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'profile' && (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 bg-zinc-950 text-amber-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold border border-zinc-800 shadow-md">
                    {user?.nome ? user.nome.substring(0, 2).toUpperCase() : 'SP'}
                  </div>
                  <div>
                    <h5 className="font-bold text-zinc-900 text-base">{user?.nome || 'Controlador Central'}</h5>
                    <p className="text-xs text-amber-500 font-mono font-bold mt-0.5">Perfil: {user?.perfil || 'ADMIN'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button onClick={() => setActiveModal(null)} className="bg-zinc-100 text-zinc-700 py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-200 cursor-pointer">
                      Voltar ao Deck
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
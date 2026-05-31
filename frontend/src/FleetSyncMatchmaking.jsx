import React, { useState, useEffect } from 'react';
import {
  MapPin, X, AlertTriangle, ChevronRight, Zap, RefreshCw, Star,
  ThumbsUp, SlidersHorizontal, Truck, Search, Bell, User, Edit2, Trash2, CheckCircle2
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
  const [activeModal, setActiveModal] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchOrder, setMatchOrder] = useState(null);
  const [matchDriver, setMatchDriver] = useState(null);
  const [orders, setOrders] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    carregarPedidosPendentes();
  }, []);
  const carregarPedidosPendentes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pedidos/pendentes');
      setOrders(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      setOrders([]); 
    } finally {
      setLoading(false);
    }
  };
  const buscarRecomendacoes = async (pedidoId) => {
    try {
      const response = await api.get(`/matches/recomendar/${pedidoId}`);
      setRecommendations(prev => ({
        ...prev,
        [pedidoId]: response.data || []
      }));
    } catch (error) {
      console.error("Erro ao buscar recomendações:", error);
    }
  };
  const handleExecuteMatch = async () => {
    try {
      await api.post(`/matches/${matchOrder.id}/responder`, { status: "ACEITO", motoristaId: matchDriver.id });
      setOrders(orders.filter(o => o.id !== matchOrder.id));
      setActiveModal(null);
      setMatchOrder(null);
      setMatchDriver(null);
    } catch (error) {
      console.error("Erro ao confirmar match:", error);
      alert("Falha ao processar o Match. Verifique a conexão.");
    }
  };
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'ALTA': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'MEDIA': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    }
  };
  const handleOpenOrderDetail = (order) => {
    setSelectedOrder(order);
    setActiveModal('order-detail');
  };
  const handleTriggerMatchModal = (order, driverRecommendation) => {
    setMatchOrder(order);
    setMatchDriver(driverRecommendation);
    setActiveModal('match-confirmation');
  };
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 font-sans antialiased flex flex-col pt-16">
      <Menu
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenNotifications={() => setActiveModal('notifications')}
        onOpenProfile={() => setActiveModal('profile')}
      />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
          <div>
            <h2 className="text-xl font-black !text-black tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 fill-amber-400 stroke-zinc-950 stroke-[1.5] text-black" /> Matchmaking Inteligente de Cargas
            </h2>
            <p className="text-xs text-zinc-500">Atribuição automatizada de operadores com base em proximidade, capacidade e SLA</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={carregarPedidosPendentes} className="p-2 border border-zinc-200 bg-white hover:bg-zinc-50 rounded-xl text-zinc-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} /> Atualizar Fila
            </button>
          </div>
        </div>
        {/* FEEDBACK DE ESTADO VAZIO (NENHUM DADO) */}
        {!loading && orders.length === 0 && (
          <div className="bg-white border border-dashed border-zinc-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Tudo limpo por aqui!</h3>
            <p className="text-sm text-zinc-500 max-w-md">Não há nenhuma entrega pendente aguardando alocação no momento. O sistema exibirá novos cards automaticamente quando um cliente cadastrar um pedido.</p>
          </div>
        )}
        <div className="space-y-4">
          {orders.filter(o => !o.motorista && (String(o.id).includes(searchQuery) || (o.cliente && o.cliente.toLowerCase().includes(searchQuery.toLowerCase())))).map((order) => (
            <div key={order.id} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-4 space-y-3 border-b lg:border-b-0 lg:border-r border-zinc-200 pb-4 lg:pb-0 lg:pr-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-500 bg-zinc-950 px-2 py-0.5 rounded-md">#{order.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 font-bold rounded-md border uppercase ${getPriorityStyle(order.nivelUrgencia)}`}>{order.nivelUrgencia || 'Normal'}</span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-zinc-900">{order.cliente || 'Cliente Padrão'}</h4>
                  <div className="text-xs text-zinc-500 font-medium space-y-1 mt-2">
                    <p className="flex items-center gap-1"><span className="text-zinc-400 font-bold">Destino:</span> {order.enderecoEntrega}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-semibold text-zinc-500">
                  <div className="bg-zinc-50 border border-zinc-100 p-2 rounded-lg">
                    <span className="text-zinc-400 block text-[9px] font-bold uppercase tracking-wider">Peso</span>
                    {order.pesoCarga} kg
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 p-2 rounded-lg">
                    <span className="text-zinc-400 block text-[9px] font-bold uppercase tracking-wider">Ação</span>
                    <button onClick={() => buscarRecomendacoes(order.id)} className="text-amber-600 hover:underline font-bold">Gerar Matches</button>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8 space-y-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">Motoristas Recomendados</span>
                <div className="space-y-2">
                  {recommendations[order.id]?.map((rec, index) => (
                    <div key={index} className="border border-zinc-200/80 bg-zinc-50/50 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-400 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-zinc-950 text-amber-400 rounded-lg flex flex-col items-center justify-center font-mono font-black text-[11px] shrink-0 border border-zinc-800">
                          <span>{rec.scoreCompatibilidade || '99'}%</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-xs font-bold text-zinc-900">{rec.motorista?.nome || 'Motorista'}</h5>
                          </div>
                          <p className="text-[11px] text-zinc-500 font-medium mt-0.5">Veículo Suporta: <span className="text-zinc-900 font-bold">{rec.veiculo?.capacidadeCarga}kg</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          onClick={() => handleTriggerMatchModal(order, rec)}
                          className="px-3 py-1.5 bg-zinc-950 text-amber-400 text-xs font-black rounded-lg hover:bg-amber-400 hover:text-zinc-950 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <ThumbsUp className="w-3 h-3 stroke-[2.5]" /> Aceitar Match
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* Vazio ou sem recomendações geradas ainda */}
                  {(!recommendations[order.id] || recommendations[order.id].length === 0) && (
                    <div className="p-4 border border-dashed border-zinc-200 rounded-xl text-center text-xs text-zinc-400 font-medium">
                      Clique em "Gerar Matches" para processar a compatibilidade da frota.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* Modal de Confirmação de Match */}
      {activeModal === 'match-confirmation' && matchOrder && matchDriver && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="bg-zinc-950 text-white px-5 py-4 flex items-center justify-between">
              <h4 className="text-base font-bold text-amber-400">Revisão e Confirmação</h4>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-amber-50/50 border border-amber-200/60 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-zinc-950 fill-amber-400" />
                  <span className="text-xs font-bold text-zinc-900">Compatibilidade Operacional</span>
                </div>
                <span className="font-mono font-black text-xs bg-zinc-950 text-amber-400 px-2 py-0.5 rounded-md">{matchDriver.scoreCompatibilidade || '99'}%</span>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl space-y-1">
                <p className="text-xs font-bold text-zinc-900">Destino: {matchOrder.enderecoEntrega}</p>
                <p className="text-[11px] text-zinc-500 font-medium">Motorista Selecionado: {matchDriver.motorista?.nome}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button onClick={() => setActiveModal(null)} className="bg-zinc-100 text-zinc-700 py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-200 cursor-pointer">Cancelar</button>
                <button onClick={handleExecuteMatch} className="bg-zinc-950 text-amber-400 py-2.5 rounded-xl text-xs font-black hover:bg-amber-400 cursor-pointer">Confirmar Match</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
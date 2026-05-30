import React, { useState } from 'react';
import { 
  MapPin, 
  X, 
  AlertTriangle, 
  ChevronRight,
  Zap,
  RefreshCw,
  Star,
  ThumbsUp,
  SlidersHorizontal,
  Truck,
  Search,
  Bell,
  User,
  Edit2,
  Trash2
} from 'lucide-react';

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
        <button
          onClick={onOpenNotifications}
          className="relative p-2 hover:bg-zinc-900 rounded-xl text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-zinc-950"></span>
        </button>

        <div className="h-6 w-[1px] bg-zinc-800"></div>

        <button
          onClick={onOpenProfile}
          className="flex items-center gap-3 pl-1 pr-2 py-1 hover:bg-zinc-900 rounded-xl transition-all cursor-pointer text-left"
        >
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

  const [orders, setOrders] = useState([
    { id: "FS-9081", client: "Indústrias Alfa S.A.", origin: "Sorocaba, SP", destination: "São Paulo, SP", status: "Em Rota", deadline: "Hoje - 18:00", priority: "Alta", value: "R$ 4.250,00", weight: "1.200 kg", driverId: "D-101" },
    { id: "FS-9082", client: "Varejo Top Log", origin: "Jundiaí, SP", destination: "Campinas, SP", status: "Pendente", deadline: "Hoje - 19:30", priority: "Média", value: "R$ 1.890,00", weight: "450 kg", driverId: null },
    { id: "FS-9083", client: "Mercado Sul Ltda", origin: "Cubatão, SP", destination: "Santos, SP", status: "Em Rota", deadline: "Hoje - 17:15", priority: "Alta", value: "R$ 7.600,00", weight: "3.100 kg", driverId: "D-102" },
    { id: "FS-9084", client: "Tech Componentes", origin: "Atibaia, SP", destination: "São José dos Campos, SP", status: "Aguardando Coleta", deadline: "Hoje - 21:00", priority: "Baixa", value: "R$ 950,00", weight: "80 kg", driverId: "D-103" }
  ]);

  const drivers = {
    "D-101": { name: "Carlos Henrique Silva", vehicle: "Caminhão Truck - Volvo FH", plate: "ABC-1234", phone: "(11) 99999-1111", rating: "4.9", location: "São Paulo, SP" },
    "D-102": { name: "Marcos Antônio Souza", vehicle: "Carreta Baú - Scania", plate: "XYZ-5678", phone: "(13) 98888-2222", rating: "4.8", location: "Santos, SP" },
    "D-103": { name: "Roberto Alves Lima", vehicle: "Fiorino / Van", plate: "KGB-9012", phone: "(12) 97777-3333", rating: "5.0", location: "São José dos Campos, SP" }
  };

  const recommendations = {
    "FS-9082": [
      { id: "D-103", name: "Roberto Alves Lima", vehicle: "Fiorino / Van", location: "Jundiaí Centro", matchScore: 98, eta: "12 min", distance: "4 km" },
      { id: "D-101", name: "Carlos Henrique Silva", vehicle: "Caminhão Truck", location: "Louveira, SP", matchScore: 85, eta: "26 min", distance: "18 km" }
    ],
    "FS-9084": [
      { id: "D-103", name: "Roberto Alves Lima", vehicle: "Fiorino / Van", location: "Atibaia Próximo", matchScore: 95, eta: "15 min", distance: "7 km" }
    ]
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Alta': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Média': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Em Rota': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Aguardando Coleta': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pendente': return 'bg-zinc-100 text-zinc-700 border-zinc-300';
      default: return 'bg-zinc-50 text-zinc-500';
    }
  };

  const handleOpenOrderDetail = (order) => {
    setSelectedOrder(order);
    setActiveModal('order-detail');
  };

  const handleOpenDriverDetail = (driverId) => {
    setSelectedDriver(drivers[driverId]);
    setActiveModal('driver-detail');
  };

  const handleTriggerMatchModal = (order, driverRecommendation) => {
    setMatchOrder(order);
    setMatchDriver(driverRecommendation);
    setActiveModal('match-confirmation');
  };

  const handleExecuteMatch = () => {
    setOrders(orders.map(o => o.id === matchOrder.id ? { ...o, driverId: matchDriver.id, status: "Aguardando Coleta" } : o));
    setActiveModal(null);
    setMatchOrder(null);
    setMatchDriver(null);
  };

  const handleEditOrder = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setOrders(orders.map(o => o.id === selectedOrder.id ? {
      ...o,
      destination: formData.get('destination'),
      priority: formData.get('priority'),
      value: formData.get('value'),
      weight: formData.get('weight')
    } : o));
    setActiveModal(null);
  };

  const handleCancelOrder = () => {
    setOrders(orders.filter(o => o.id !== selectedOrder.id));
    setActiveModal(null);
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
            <button className="p-2 border border-zinc-200 bg-white hover:bg-zinc-50 rounded-xl text-zinc-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <SlidersHorizontal className="w-4 h-4" /> Filtros Avançados
            </button>
            <button className="p-2 border border-zinc-200 bg-white hover:bg-zinc-50 rounded-xl text-zinc-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <RefreshCw className="w-4 h-4" /> Recalcular Recomendações
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {orders.filter(o => !o.driverId && (o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.client.toLowerCase().includes(searchQuery.toLowerCase()))).map((order) => (
            <div key={order.id} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

              <div className="lg:col-span-4 space-y-3 border-b lg:border-b-0 lg:border-r border-zinc-200 pb-4 lg:pb-0 lg:pr-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-500 bg-zinc-950 px-2 py-0.5 rounded-md">{order.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 font-bold rounded-md border ${getPriorityStyle(order.priority)}`}>{order.priority}</span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-zinc-900">{order.client}</h4>
                  <div className="text-xs text-zinc-500 font-medium space-y-1 mt-2">
                    <p className="flex items-center gap-1"><span className="text-zinc-400 font-bold">Origem:</span> {order.origin}</p>
                    <p className="flex items-center gap-1"><span className="text-zinc-400 font-bold">Destino:</span> {order.destination}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-semibold text-zinc-500">
                  <div className="bg-zinc-50 border border-zinc-100 p-2 rounded-lg">
                    <span className="text-zinc-400 block text-[9px] font-bold uppercase tracking-wider">Carga</span>
                    {order.weight} • {order.value}
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 p-2 rounded-lg">
                    <span className="text-zinc-400 block text-[9px] font-bold uppercase tracking-wider">Prazo Máximo</span>
                    <span className="text-zinc-900 font-bold">{order.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">Motoristas Recomendados (Ranking)</span>

                <div className="space-y-2">
                  {recommendations[order.id]?.map((rec) => (
                    <div key={rec.id} className="border border-zinc-200/80 bg-zinc-50/50 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-400 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-zinc-950 text-amber-400 rounded-lg flex flex-col items-center justify-center font-mono font-black text-[11px] shrink-0 border border-zinc-800">
                          <span>{rec.matchScore}%</span>
                          <span className="text-[7px] uppercase -mt-1 tracking-tighter text-zinc-400">Match</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-xs font-bold text-zinc-900">{rec.name}</h5>
                            <span className="bg-emerald-50 text-emerald-700 font-bold text-[9px] px-1.5 py-0.2 rounded border border-emerald-200">Disponível</span>
                          </div>
                          <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{rec.vehicle} • Proximidade: <span className="text-zinc-900 font-bold">{rec.distance} ({rec.eta} até a coleta)</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          onClick={() => { setSelectedDriver(drivers[rec.id] || rec); setActiveModal('driver-detail'); }}
                          className="px-2.5 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Ver Perfil
                        </button>
                        <button
                          onClick={() => handleTriggerMatchModal(order, rec)}
                          className="px-3 py-1.5 bg-zinc-950 text-amber-400 text-xs font-black rounded-lg hover:bg-amber-400 hover:text-zinc-950 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <ThumbsUp className="w-3 h-3 stroke-[2.5]" /> Aceitar Match
                        </button>
                      </div>
                    </div>
                  ))}

                  {(!recommendations[order.id] || recommendations[order.id].length === 0) && (
                    <div className="p-4 border border-dashed border-zinc-200 rounded-xl text-center text-xs text-zinc-400 font-medium">
                      Nenhum motorista compatível encontrado nas proximidades imediatas.
                      <button className="text-amber-600 hover:underline font-bold ml-1 block sm:inline mt-1 sm:mt-0">Solicitar busca expandida</button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="border-t border-zinc-200 pt-6">
          <div className="mb-4">
            <h3 className="font-bold text-zinc-950 text-base">Visão Geral do Fluxo da Frota</h3>
            <p className="text-xs text-zinc-400">Status updated de todas as ordens de serviço</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-950 text-white border-b border-zinc-800 font-mono text-[10px] tracking-wider uppercase">
                    <th className="p-4 font-bold">Pedido</th>
                    <th className="p-4 font-bold">Cliente / Destino</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Motorista Vinculado</th>
                    <th className="p-4 font-bold text-center">Ações</th> {/* Centralizado alinhamento */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-medium text-zinc-600">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-zinc-900">{order.id}</td>
                      <td className="p-4">
                        <span className="font-bold text-zinc-900 block">{order.client}</span>
                        <span className="text-zinc-400 text-[11px] block mt-0.5">{order.destination}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getStatusStyle(order.status)}`}>{order.status}</span>
                      </td>
                      <td className="p-4 text-zinc-900">
                        {order.driverId ? (
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span>{drivers[order.driverId].name}</span>
                          </div>
                        ) : (
                          <span className="text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-[10px] font-bold">Aguardando Operador</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => { setSelectedOrder(order); setActiveModal('edit'); }}
                            className="p-1.5 text-zinc-500 hover:text-amber-500 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                            title="Editar Dados da Carga"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setSelectedOrder(order); setActiveModal('cancel'); }}
                            className="p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Excluir/Cancelar Pedido"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="h-4 w-[1px] bg-zinc-200 mx-1"></div>
                          <button
                            onClick={() => handleOpenOrderDetail(order)}
                            className="text-zinc-900 hover:text-amber-500 font-bold inline-flex items-center gap-0.5 cursor-pointer"
                          >
                            Ver <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>


      {activeModal && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="bg-zinc-950 text-white px-5 py-4 flex items-center justify-between">
              <h4 className="text-base font-bold text-amber-400">
                {activeModal === 'order-detail' && `Detalhes do Pedido - ${selectedOrder?.id}`}
                {activeModal === 'driver-detail' && "Perfil do Motorista"}
                {activeModal === 'match-confirmation' && "Revisão e Confirmação de Match"}
                {activeModal === 'edit' && "Editar Informações de Carga"}
                {activeModal === 'cancel' && "Aviso: Cancelamento de Pedido"}
              </h4>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">

              {activeModal === 'match-confirmation' && matchOrder && matchDriver && (
                <div className="space-y-4">
                  <div className="bg-amber-50/50 border border-amber-200/60 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-zinc-950 fill-amber-400" />
                      <span className="text-xs font-bold text-zinc-900">Compatibilidade Operacional</span>
                    </div>
                    <span className="font-mono font-black text-xs bg-zinc-950 text-amber-400 px-2 py-0.5 rounded-md">{matchDriver.matchScore}%</span>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-zinc-900">{matchOrder.client}</p>
                    <p className="text-[11px] text-zinc-500 font-medium">{matchOrder.origin} → {matchOrder.destination}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button onClick={() => setActiveModal(null)} className="bg-zinc-100 text-zinc-700 py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-200">Cancelar</button>
                    <button onClick={handleExecuteMatch} className="bg-zinc-950 text-amber-400 py-2.5 rounded-xl text-xs font-black hover:bg-amber-400">Confirmar Match</button>
                  </div>
                </div>
              )}

              {/* MODAL DE EDITAR ADICIONADO NO ESCOPO DESTA TELA */}
              {activeModal === 'edit' && selectedOrder && (
                <form onSubmit={handleEditOrder} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500">Destino</label>
                    <input type="text" name="destination" defaultValue={selectedOrder.destination} required className="bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-zinc-500 block mb-1">Peso</label>
                      <input type="text" name="weight" defaultValue={selectedOrder.weight} placeholder="Peso" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 block mb-1">Valor</label>
                      <input type="text" name="value" defaultValue={selectedOrder.value} placeholder="Valor" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">Prioridade</label>
                    <select name="priority" defaultValue={selectedOrder.priority} className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm cursor-pointer focus:outline-none focus:border-amber-400">
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-amber-500 text-black font-black py-2.5 rounded-xl text-xs cursor-pointer hover:bg-amber-400 transition-colors">Salvar Alterações</button>
                </form>
              )}


              {activeModal === 'cancel' && (
                <div className="space-y-4 text-center py-2">
                  <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto animate-bounce" />

                  <div className="space-y-1 w-full text-center">
                        <h5 className="text-lg font-black text-zinc-900 tracking-tight text-center block w-full">
                          Remover pedido permanentemente?
                        </h5>

                        <p className="text-xs text-zinc-500 font-medium mb-6 text-center block w-full">
                          Essa ação excluirá a ordem {selectedOrder?.id} da fila logística do FleetSync.
                        </p>
                      </div>

                  <div className="flex gap-3">

                    <button
                      onClick={() => setActiveModal(null)}
                      className="flex-1 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/80 text-zinc-700 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Não, manter
                    </button>
                    <button
                      onClick={handleCancelOrder}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-rose-600/10 transition-all cursor-pointer"
                    >
                      Sim, Excluir
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'order-detail' && selectedOrder && (
                <div className="space-y-4">
                  <div className="bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl">
                    <p className="text-xs text-zinc-400 font-semibold font-mono">CLIENTE DESTINATÁRIO</p>
                    <p className="text-base font-bold text-zinc-900">{selectedOrder.client}</p>
                    <p className="text-sm text-zinc-600 flex items-center gap-1 mt-1 font-medium"><MapPin className="w-4 h-4 text-zinc-400" /> {selectedOrder.destination}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-medium text-zinc-600">
                    <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl"><span className="text-zinc-400 block text-[10px] font-bold">PESO</span><span className="text-sm font-bold text-zinc-900">{selectedOrder.weight}</span></div>
                    <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl"><span className="text-zinc-400 block text-[10px] font-bold">VALOR</span><span className="text-sm font-bold text-zinc-900">{selectedOrder.value}</span></div>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="w-full bg-zinc-950 text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer">
                    Voltar ao Hub
                  </button>
                </div>
              )}

              {activeModal === 'driver-detail' && selectedDriver && (
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <h5 className="font-bold text-lg text-zinc-900">{selectedDriver.name}</h5>
                    <p className="text-xs text-zinc-500 mt-0.5">{selectedDriver.vehicle} {selectedDriver.plate && `• ${selectedDriver.plate}`}</p>
                    <div className="flex items-center justify-center gap-1 mt-2 text-xs font-bold text-zinc-900">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {selectedDriver.rating} de Score Geral
                    </div>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="w-full bg-zinc-950 text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer">
                    Fechar Janela
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
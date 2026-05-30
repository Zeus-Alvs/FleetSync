import React, { useState } from 'react';
import { 
  Truck, 
  Users, 
  CheckCircle2, 
  BarChart3, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  X, 
  Edit2, 
  Trash2, 
  Navigation, 
  ShieldCheck,
  Check,
  ChevronRight,
  Search,
  Bell,
  User
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

export default function FleetSyncDashboard() {
  const [activeModal, setActiveModal] = useState(null); 
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [orders, setOrders] = useState([
    { id: "FS-9081", client: "Indústrias Alfa S.A.", destination: "São Paulo, SP", status: "Em Rota", time: "14:22", priority: "Alta", value: "R$ 4.250,00", weight: "1.200 kg", driverId: "D-101" },
    { id: "FS-9082", client: "Varejo Top Log", destination: "Campinas, SP", status: "Pendente", time: "14:45", priority: "Média", value: "R$ 1.890,00", weight: "450 kg", driverId: null },
    { id: "FS-9083", client: "Mercado Sul Ltda", destination: "Santos, SP", status: "Em Rota", time: "15:10", priority: "Alta", value: "R$ 7.600,00", weight: "3.100 kg", driverId: "D-102" },
    { id: "FS-9084", client: "Tech Componentes", destination: "São José dos Campos, SP", status: "Aguardando Coleta", time: "15:30", priority: "Baixa", value: "R$ 950,00", weight: "80 kg", driverId: "D-103" }
  ]);

  const drivers = {
    "D-101": { name: "Carlos Henrique Silva", vehicle: "Caminhão Truck - Volvo FH", plate: "ABC-1234", phone: "(11) 99999-1111", rating: "4.9", status: "Online" },
    "D-102": { name: "Marcos Antônio Souza", vehicle: "Carreta Baú - Scania", plate: "XYZ-5678", phone: "(13) 98888-2222", rating: "4.8", status: "Online" },
    "D-103": { name: "Roberto Alves Lima", vehicle: "Fiorino / Van", plate: "KGB-9012", phone: "(12) 97777-3333", rating: "5.0", status: "Online" }
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
    if(!driverId) {
      setActiveModal('match');
      return;
    }
    setSelectedDriver(drivers[driverId]);
    setActiveModal('driver-detail');
  };

  const handleUpdateStatus = (newStatus) => {
    setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
    setActiveModal(null);
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

  const handleConfirmMatch = (driverId) => {
    setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, driverId: driverId, status: "Aguardando Coleta" } : o));
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 border border-zinc-200/80 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Pedidos Ativos</p>
              <h4 className="text-3xl font-black text-zinc-900 tracking-tight">{orders.length}</h4>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12% vs ontem</span>
            </div>
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 border border-zinc-200/80 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Motoristas Online</p>
              <h4 className="text-3xl font-black text-zinc-900 tracking-tight">48</h4>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">3 em espera</span>
            </div>
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-zinc-900">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 border border-zinc-200/80 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Entregas Concluídas</p>
              <h4 className="text-3xl font-black text-zinc-900 tracking-tight">184</h4>
              <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">Meta: 200/dia</span>
            </div>
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 border border-zinc-200/80 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Taxa de Eficiência</p>
              <h4 className="text-3xl font-black text-zinc-900 tracking-tight">97.4%</h4>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">SLA Excelente</span>
            </div>
            <div className="w-12 h-12 bg-zinc-900 text-amber-400 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex flex-col h-[520px]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-500 fill-amber-500" /> Mapeamento de Frotas em Tempo Real
                </h3>
                <p className="text-xs text-zinc-400">Visualização activa de rotas principais no Estado de São Paulo</p>
              </div>
            </div>

            <div className="flex-1 rounded-xl bg-zinc-100 border border-zinc-200/60 relative overflow-hidden bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px]">
              <svg className="absolute inset-0 w-full h-full opacity-40">
                <path d="M 150 120 Q 280 180 380 250 T 520 380" fill="transparent" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6" />
              </svg>

              <div className="absolute top-1/4 left-1/4 group cursor-pointer" onClick={() => handleOpenOrderDetail(orders[0])}>
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping absolute"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full border-2 border-white relative"></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col h-[520px]">
            <div className="mb-4">
              <h3 className="font-bold text-zinc-900">Monitoramento de Pedidos</h3>
              <p className="text-xs text-zinc-400">Selecione um item para gerenciar</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {orders.filter(o => o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.client.toLowerCase().includes(searchQuery.toLowerCase())).map((order) => (
                <div key={order.id} onClick={() => handleOpenOrderDetail(order)} className="p-3.5 bg-zinc-50 border border-zinc-200/70 hover:border-zinc-400 rounded-xl transition-all cursor-pointer group flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-zinc-400 group-hover:text-black">{order.id}</span>
                      <h5 className="text-sm font-bold text-zinc-900 mt-0.5">{order.client}</h5>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 font-bold rounded-md border ${getPriorityStyle(order.priority)}`}>{order.priority}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className={`text-[11px] px-2.5 py-0.5 font-bold border rounded-full ${getStatusStyle(order.status)}`}>{order.status}</span>
                    <span className="text-[11px] text-zinc-400 group-hover:text-zinc-900 font-bold flex items-center gap-0.5">Gerenciar <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </div>
              ))}
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
                {activeModal === 'driver-detail' && "Perfil do Motorista Alocado"}
                {activeModal === 'status' && "Atualizar Status da Entrega"}
                {activeModal === 'edit' && "Editar Informações de Carga"}
                {activeModal === 'cancel' && "Aviso: Cancelamento de Pedido"}
                {activeModal === 'match' && "Confirmação de Vínculo (Match)"}
                {activeModal === 'notifications' && "Central de Alertas e Notificações"}
                {activeModal === 'profile' && "Perfil do Operador Logístico"}
              </h4>
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {activeModal === 'notifications' && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full mt-1.5 bg-amber-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Alerta de Rota Crítica</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Pedido FS-9083 está enfrentando tráfego acima da média na saída de Santos.</p>
                    </div>
                  </div>
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full mt-1.5 bg-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Motorista Disponível</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Roberto Alves Lima alterou status para online em São José dos Campos.</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="w-full mt-2 bg-zinc-950 text-white py-2 rounded-xl text-xs font-bold">
                    Fechar Notificações
                  </button>
                </div>
              )}

              {activeModal === 'profile' && (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 bg-zinc-950 text-amber-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold border border-zinc-800 shadow-md">
                    SP
                  </div>
                  <div>
                    <h5 className="font-bold text-zinc-900 text-base">Controlador Central</h5>
                    <p className="text-xs text-amber-500 font-mono font-bold mt-0.5">ID Operador: #40821</p>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-left space-y-1.5 text-xs font-medium text-zinc-600">
                    <p><span className="text-zinc-400 font-bold">Filial vinculada:</span> Painel Estratégico SP Matriz</p>
                    <p><span className="text-zinc-400 font-bold">Nível de Acesso:</span> Administrador Master</p>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="w-full bg-zinc-100 text-zinc-700 py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-200">
                    Voltar ao Hub
                  </button>
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
                  <div className="flex items-center justify-between border-y border-zinc-100 py-3">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400">OPERADOR</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedOrder.driverId ? drivers[selectedOrder.driverId].name : "Sem motorista alocado"}</p>
                    </div>
                    <button onClick={() => handleOpenDriverDetail(selectedOrder.driverId)} className="text-xs font-bold bg-zinc-900 text-white hover:bg-amber-500 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer">
                      {selectedOrder.driverId ? "Ver Perfil" : "Vincular"}
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <button onClick={() => setActiveModal('status')} className="bg-amber-500 text-black font-bold py-2.5 rounded-xl text-xs cursor-pointer">Mudar Status</button>
                    <button onClick={() => setActiveModal('edit')} className="bg-zinc-100 text-zinc-800 font-bold py-2.5 rounded-xl text-xs cursor-pointer">Editar</button>
                    <button onClick={() => setActiveModal('cancel')} className="bg-rose-50 text-rose-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer">Cancelar</button>
                  </div>
                </div>
              )}

              {activeModal === 'driver-detail' && selectedDriver && (
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <h5 className="font-bold text-lg text-zinc-900">{selectedDriver.name}</h5>
                    <p className="text-xs text-zinc-500">{selectedDriver.vehicle} • {selectedDriver.plate}</p>
                  </div>
                  <button onClick={() => setActiveModal('order-detail')} className="w-full bg-zinc-950 text-white py-2.5 rounded-xl text-xs cursor-pointer">Voltar ao Pedido</button>
                </div>
              )}

              {activeModal === 'status' && (
                <div className="space-y-2">
                  {['Pendente', 'Aguardando Coleta', 'Em Rota', 'Entregue'].map((statusOption) => (
                    <button key={statusOption} onClick={() => handleUpdateStatus(statusOption)} className="w-full text-left p-3 rounded-xl border text-xs font-bold bg-zinc-50 border-zinc-200 cursor-pointer hover:border-zinc-400">
                      {statusOption}
                    </button>
                  ))}
                </div>
              )}

              {activeModal === 'edit' && selectedOrder && (
                <form onSubmit={handleEditOrder} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500">Destino</label>
                    <input type="text" name="destination" defaultValue={selectedOrder.destination} required className="bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" name="weight" defaultValue={selectedOrder.weight} placeholder="Peso" className="bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm" />
                    <input type="text" name="value" defaultValue={selectedOrder.value} placeholder="Valor" className="bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm" />
                  </div>
                  <select name="priority" defaultValue={selectedOrder.priority} className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm cursor-pointer">
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                  <button type="submit" className="w-full bg-amber-500 text-black font-black py-2.5 rounded-xl text-xs cursor-pointer">Salvar Alterações</button>
                </form>
              )}

              {activeModal === 'cancel' && (
                <div className="space-y-4 text-center py-2">
                  <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
                  <h5 className="font-bold text-zinc-900">Remover pedido permanentemente?</h5>
                  <div className="flex gap-2">
                    <button onClick={() => setActiveModal('order-detail')} className="flex-1 bg-zinc-100 py-2.5 rounded-xl text-xs cursor-pointer">Não</button>
                    <button onClick={handleCancelOrder} className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl text-xs cursor-pointer">Sim, Cancelar</button>
                  </div>
                </div>
              )}

              {activeModal === 'match' && (
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-zinc-700">
                    Selecione um operador disponível na região de atuação para assumir a carga:
                  </div>
                  {Object.entries(drivers).map(([id, d]) => (
                    <div key={id} onClick={() => handleConfirmMatch(id)} className="p-3 bg-zinc-50 border border-zinc-200 hover:border-amber-500 rounded-xl transition-all cursor-pointer flex justify-between items-center group">
                      <div>
                        <p className="text-xs font-bold text-zinc-900">{d.name}</p>
                        <p className="text-[11px] text-zinc-400">{d.vehicle}</p>
                      </div>
                      <span className="text-[10px] bg-zinc-950 text-white px-2 py-1 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity">Vincular</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
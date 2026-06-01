
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import {
  Truck, Users, CheckCircle2, BarChart3, MapPin, Clock, AlertTriangle,
  X, Edit2, Trash2, Navigation, ChevronRight, Search, Bell, User, LogOut, Plus
} from 'lucide-react';
import api from './services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const motoristaIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const pedidoIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
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
export default function FleetSyncDashboard() {
  const [activeModal, setActiveModal] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [novoPedido, setNovoPedido] = useState({ cliente: '', enderecoEntrega: '', cidade: 'SANTOS', pesoCarga: '', nivelUrgencia: 'MEDIO', valorCarga: '' });
  const [enviandoPedido, setEnviandoPedido] = useState(false);

  // States do Autocomplete
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);

  const [orders, setOrders] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [analytics, setAnalytics] = useState({
    taxaAceite: 0,
    entregasConcluidas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDashboard();
  }, []);

  // Hook do Autocomplete
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (novoPedido.enderecoEntrega.length > 4 && showSuggestions && !selectedCoords) {
        setIsSearchingAddress(true);
        try {
          const cityNameMap = { 'SANTOS': 'Santos', 'SAO_VICENTE': 'São Vicente', 'PRAIA_GRANDE': 'Praia Grande', 'CUBATAO': 'Cubatão' };
          const friendlyCity = cityNameMap[novoPedido.cidade] || 'Santos';
          const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(novoPedido.enderecoEntrega + ", " + friendlyCity + ", SP, Brasil")}&limit=4`);
          const geoData = await geoResponse.json();
          setAddressSuggestions(geoData || []);
        } catch (error) {
          console.error("Erro na busca de endereço:", error);
        } finally {
          setIsSearchingAddress(false);
        }
      } else {
        setAddressSuggestions([]);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [novoPedido.enderecoEntrega, novoPedido.cidade, showSuggestions, selectedCoords]);

  const handleSelectSuggestion = (sug) => {
    // Pega as primeiras partes do endereço retornado
    const displayNameParts = sug.display_name.split(',');
    const displayName = displayNameParts.length >= 2 ? `${displayNameParts[0].trim()}, ${displayNameParts[1].trim()}` : sug.display_name;
    
    setNovoPedido({ ...novoPedido, enderecoEntrega: displayName });
    setSelectedCoords({ lat: parseFloat(sug.lat), lon: parseFloat(sug.lon) });
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };
  const carregarDashboard = async () => {
    try {
      setLoading(true);

      const [resPedidos, resMotoristas, resAnalytics] = await Promise.all([
        api.get('/api/pedidos'),
        api.get('/api/motoristas'),
        api.get('/api/analytics/taxa-aceite')
      ]);
      setOrders(resPedidos.data || []);
      setMotoristas(resMotoristas.data || []);

      setAnalytics({
        taxaAceite: resAnalytics.data?.taxa || 0,
        entregasConcluidas: resPedidos.data?.filter(p => p.statusPedido === 'ENTREGUE').length || 0
      });
    } catch (error) {
      console.error("Erro ao carregar Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'ALTA': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'MEDIA': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    }
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case 'EM_ROTA': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ENTREGUE': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PENDENTE': return 'bg-zinc-100 text-zinc-700 border-zinc-300';
      default: return 'bg-zinc-50 text-zinc-500';
    }
  };
  const handleOpenOrderDetail = (order) => {
    setSelectedOrder(order);
    setActiveModal('order-detail');
  };
  const handleOpenDriverDetail = (motorista) => {
    if (!motorista) return;
    setSelectedDriver(motorista);
    setActiveModal('driver-detail');
  };
  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.patch(`/api/pedidos/${selectedOrder.id}/status`, { statusPedido: newStatus });
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, statusPedido: newStatus } : o));
      setActiveModal(null);
    } catch (error) {
      alert("Erro ao atualizar status na API.");
    }
  };
  const handleCancelOrder = async () => {
    try {
      await api.delete(`/api/pedidos/${selectedOrder.id}`);
      setOrders(orders.filter(o => o.id !== selectedOrder.id));
      setActiveModal(null);
    } catch (error) {
      alert("Erro ao excluir pedido na API.");
    }
  };
  const handleCriarPedido = async (e) => {
    e.preventDefault();
    
    let finalLat, finalLon;

    // Se o usuário selecionou uma sugestão, usa a coordenada exata
    if (selectedCoords) {
      finalLat = selectedCoords.lat;
      finalLon = selectedCoords.lon;
    } else {
      // Se a API for fraca e não achar a rua, usamos a cidade como base (Fallback)
      const cityCoords = {
        'SANTOS': { lat: -23.9618, lon: -46.3322 },
        'SAO_VICENTE': { lat: -23.9650, lon: -46.3800 },
        'PRAIA_GRANDE': { lat: -24.0058, lon: -46.4127 },
        'CUBATAO': { lat: -23.8950, lon: -46.4233 }
      };
      const defaultCoord = cityCoords[novoPedido.cidade] || cityCoords['SANTOS'];
      finalLat = defaultCoord.lat + (Math.random() * 0.005); 
      finalLon = defaultCoord.lon + (Math.random() * 0.005);
    }

    try {
      setEnviandoPedido(true);

      // Dispara o POST real para a sua API Java, já com a coordenada cravada
      const response = await api.post('/api/pedidos', {
        ...novoPedido,
        pesoCarga: Number(novoPedido.pesoCarga) || 0,
        statusPedido: 'PENDENTE', // Nasce aguardando motorista
        cidade: novoPedido.cidade,
        latitudeDestino: finalLat,
        longitudeDestino: finalLon
      });
      
      // Adiciona o novo pedido no topo da lista atual sem precisar recarregar a tela
      setOrders([response.data, ...orders]);
      setActiveModal(null);
      // Limpa o formulário
      setNovoPedido({ cliente: '', enderecoEntrega: '', cidade: 'SANTOS', pesoCarga: '', nivelUrgencia: 'MEDIO', valorCarga: '' });
      setSelectedCoords(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("O Backend rejeitou o pedido! Motivo provável: O endereço que você digitou fica num raio menor que 5km do Hub Logístico (Regra de Negócio Java).");
      } else {
        alert("Erro ao criar pedido. Verifique se o servidor está rodando.");
      }
    } finally {
      setEnviandoPedido(false);
    }
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
        {/* CARDS ANALÍTICOS SUPERIORES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 border border-zinc-200/80 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Pedidos Ativos</p>
              <h4 className="text-3xl font-black text-zinc-900 tracking-tight">{loading ? '...' : orders.filter(o => o.statusPedido !== 'ENTREGUE').length}</h4>
            </div>
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white p-5 border border-zinc-200/80 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Motoristas Base</p>
              <h4 className="text-3xl font-black text-zinc-900 tracking-tight">{loading ? '...' : motoristas.length}</h4>
            </div>
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-zinc-900">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white p-5 border border-zinc-200/80 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Entregas Concluídas</p>
              <h4 className="text-3xl font-black text-zinc-900 tracking-tight">{loading ? '...' : analytics.entregasConcluidas}</h4>
            </div>
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white p-5 border border-zinc-200/80 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Taxa de Eficiência</p>
              <h4 className="text-3xl font-black text-zinc-900 tracking-tight">{loading ? '...' : `${analytics.taxaAceite}%`}</h4>
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
            <div className="flex-1 rounded-xl bg-zinc-100 border border-zinc-200/60 relative overflow-hidden z-0">
              <MapContainer center={[-23.9618, -46.3322]} zoom={11} className="w-full h-full z-0">
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {motoristas.map(m => (
                  <Marker 
                    key={`motorista-${m.id}`} 
                    position={[m.latitudeAtual, m.longitudeAtual]} 
                    icon={motoristaIcon}
                  >
                    <Popup>
                      <b>{m.nome}</b><br/>
                      CNH: {m.cnh}<br/>
                      {m.disponivel ? "🟢 Disponível" : "🔴 Em rota"}
                    </Popup>
                  </Marker>
                ))}

                {orders.filter(o => o.statusPedido !== 'ENTREGUE').map(o => (
                  <Marker 
                    key={`pedido-${o.id}`} 
                    position={[o.latitudeDestino, o.longitudeDestino]} 
                    icon={pedidoIcon}
                  >
                    <Popup>
                      <b>Pedido #{o.id}</b><br/>
                      Cliente: {o.cliente}<br/>
                      Status: {o.statusPedido}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col h-[520px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-zinc-900">Monitoramento de Pedidos</h3>
                <p className="text-xs text-zinc-400">Selecione um item para gerenciar</p>
              </div>
              {/* BOTÃO ADICIONADO AQUI */}
              <button 
                onClick={() => setActiveModal('novo-pedido')}
                className="bg-zinc-950 hover:bg-amber-500 text-white hover:text-black transition-colors px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Novo
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {!loading && orders.length === 0 && (
                <div className="text-center text-xs text-zinc-400 py-10">Nenhum pedido registrado no sistema.</div>
              )}
              {orders.filter(o => String(o.id).includes(searchQuery) || (o.cliente && o.cliente.toLowerCase().includes(searchQuery.toLowerCase()))).map((order) => (
                <div key={order.id} onClick={() => handleOpenOrderDetail(order)} className="p-3.5 bg-zinc-50 border border-zinc-200/70 hover:border-zinc-400 rounded-xl transition-all cursor-pointer group flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-zinc-400 group-hover:text-black">#{order.id}</span>
                      <h5 className="text-sm font-bold text-zinc-900 mt-0.5">{order.cliente || 'Cliente'}</h5>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 font-bold rounded-md border uppercase ${getPriorityStyle(order.nivelUrgencia)}`}>{order.nivelUrgencia || 'Normal'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className={`text-[11px] px-2.5 py-0.5 font-bold border rounded-full uppercase ${getStatusStyle(order.statusPedido)}`}>{order.statusPedido || 'PENDENTE'}</span>
                    <span className="text-[11px] text-zinc-400 group-hover:text-zinc-900 font-bold flex items-center gap-0.5">Gerenciar <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      {/* MODAIS (MANTIDOS IDÊNTICOS PARA NÃO QUEBRAR O SEU ESTILO) */}
      {activeModal && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="bg-zinc-950 text-white px-5 py-4 flex items-center justify-between">
              <h4 className="text-base font-bold text-amber-400">
                {activeModal === 'order-detail' && `Detalhes do Pedido - #${selectedOrder?.id}`}
                {activeModal === 'driver-detail' && "Perfil do Motorista Alocado"}
                {activeModal === 'status' && "Atualizar Status da Entrega"}
                {activeModal === 'cancel' && "Aviso: Cancelamento de Pedido"}
                {activeModal === 'notifications' && "Central de Alertas e Notificações"}
                {activeModal === 'profile' && "Perfil do Operador Logístico"}
                {activeModal === 'novo-pedido' && "Cadastrar Nova Ordem de Serviço"}
              </h4>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              {activeModal === 'notifications' && (
                <div className="space-y-3">
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full mt-1.5 bg-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Sistema Conectado</p>
                      <p className="text-xs text-zinc-500 mt-0.5">A API do FleetSync está online e recebendo dados.</p>
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
              )}
              {activeModal === 'order-detail' && selectedOrder && (
                <div className="space-y-4">
                  <div className="bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl">
                    <p className="text-xs text-zinc-400 font-semibold font-mono">CLIENTE DESTINATÁRIO</p>
                    <p className="text-base font-bold text-zinc-900">{selectedOrder.cliente}</p>
                    <p className="text-sm text-zinc-600 flex items-center gap-1 mt-1 font-medium"><MapPin className="w-4 h-4 text-zinc-400" /> {selectedOrder.enderecoEntrega}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-medium text-zinc-600">
                    <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl"><span className="text-zinc-400 block text-[10px] font-bold">PESO</span><span className="text-sm font-bold text-zinc-900">{selectedOrder.pesoCarga} kg</span></div>
                  </div>
                  <div className="flex items-center justify-between border-y border-zinc-100 py-3">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400">OPERADOR</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedOrder.motorista ? selectedOrder.motorista.nome : "Sem motorista alocado"}</p>
                    </div>
                    {selectedOrder.motorista && (
                      <button onClick={() => handleOpenDriverDetail(selectedOrder.motorista)} className="text-xs font-bold bg-zinc-900 text-white hover:bg-amber-500 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer">Ver Perfil</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button onClick={() => setActiveModal('status')} className="bg-amber-500 text-black font-bold py-2.5 rounded-xl text-xs cursor-pointer">Mudar Status</button>
                    <button onClick={() => setActiveModal('cancel')} className="bg-rose-50 text-rose-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer">Cancelar/Excluir</button>
                  </div>
                </div>
              )}
              {activeModal === 'driver-detail' && selectedDriver && (
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <h5 className="font-bold text-lg text-zinc-900">{selectedDriver.nome}</h5>
                    <p className="text-xs text-zinc-500">CNH: {selectedDriver.cnh}</p>
                  </div>
                  <button onClick={() => setActiveModal('order-detail')} className="w-full bg-zinc-950 text-white py-2.5 rounded-xl text-xs cursor-pointer">Voltar ao Pedido</button>
                </div>
              )}
              {activeModal === 'status' && (
                <div className="space-y-2">
                  {['PENDENTE', 'EM_ROTA', 'ENTREGUE'].map((statusOption) => (
                    <button key={statusOption} onClick={() => handleUpdateStatus(statusOption)} className="w-full text-left p-3 rounded-xl border text-xs font-bold bg-zinc-50 border-zinc-200 cursor-pointer hover:border-zinc-400">
                      {statusOption}
                    </button>
                  ))}
                </div>
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
              {activeModal === 'novo-pedido' && (
                <form onSubmit={handleCriarPedido} className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200/60 p-3 rounded-xl text-xs text-amber-800 font-medium mb-4">
                    Preencha os dados da carga. O sistema de Matchmaking buscará motoristas após a criação.
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500">Cliente / Empresa Solicitante</label>
                    <input 
                      type="text" 
                      required 
                      value={novoPedido.cliente}
                      onChange={(e) => setNovoPedido({...novoPedido, cliente: e.target.value})}
                      placeholder="Ex: Indústrias Alfa S.A." 
                      className="bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 relative">
                    <label className="text-xs font-bold text-zinc-500">Endereço de Destino (Busca Inteligente)</label>
                    <input 
                      type="text" 
                      required 
                      value={novoPedido.enderecoEntrega}
                      onChange={(e) => {
                        setNovoPedido({...novoPedido, enderecoEntrega: e.target.value});
                        setShowSuggestions(true);
                        setSelectedCoords(null);
                      }}
                      placeholder="Ex: Av. Paulista, 1000" 
                      className="bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" 
                    />
                    {isSearchingAddress && (
                      <div className="absolute right-3 top-8 text-xs text-amber-500 font-bold">...</div>
                    )}
                    {showSuggestions && addressSuggestions.length > 0 && (
                      <div className="absolute top-[65px] left-0 right-0 bg-white border border-zinc-200 rounded-xl shadow-xl z-[9999] max-h-48 overflow-y-auto">
                        {addressSuggestions.map((sug, i) => (
                          <div 
                            key={i} 
                            onClick={() => handleSelectSuggestion(sug)}
                            className="px-3 py-2.5 text-xs hover:bg-amber-50 cursor-pointer border-b border-zinc-100 last:border-0 flex items-start gap-2 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-zinc-700 font-medium">{sug.display_name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500">Cidade (Para precisão do Mapa)</label>
                    <select 
                      value={novoPedido.cidade}
                      onChange={(e) => setNovoPedido({...novoPedido, cidade: e.target.value})}
                      className="bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="SANTOS">Santos</option>
                      <option value="SAO_VICENTE">São Vicente</option>
                      <option value="PRAIA_GRANDE">Praia Grande</option>
                      <option value="CUBATAO">Cubatão</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">Peso Estimado (kg)</label>
                      <input 
                        type="number" 
                        required 
                        value={novoPedido.pesoCarga}
                        onChange={(e) => setNovoPedido({...novoPedido, pesoCarga: e.target.value})}
                        placeholder="Ex: 1200" 
                        className="bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">Prioridade / SLA</label>
                      <select 
                        value={novoPedido.nivelUrgencia}
                        onChange={(e) => setNovoPedido({...novoPedido, nivelUrgencia: e.target.value})}
                        className="bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="BAIXO">Baixo (Flexível)</option>
                        <option value="MEDIO">Médio (Padrão)</option>
                        <option value="ALTO">Alto Urgência (Express)</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={enviandoPedido}
                    className="w-full bg-amber-500 text-black font-black py-3 rounded-xl text-xs cursor-pointer hover:bg-amber-400 transition-colors mt-2 disabled:opacity-50"
                  >
                    {enviandoPedido ? 'Registrando Pedido...' : 'Salvar e Gerar OS'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
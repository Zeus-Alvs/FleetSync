
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const companyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const frotaIcon = new L.Icon({
  iconUrl: '/frota.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

const finalizadoIcon = new L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #10b981; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">✓</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});
function Menu({ searchQuery, setSearchQuery, onOpenNotifications, onOpenProfile, activeTab }) {
  const navigate = useNavigate(); // Habilita a navegação dentro do Menu

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-800 px-6 flex items-center justify-between z-40 shadow-lg">
      <div className="flex items-center gap-6">
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

        {/* LINKS DE NAVEGAÇÃO ADICIONADOS AQUI */}
        <div className="hidden sm:flex items-center gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => navigate('/dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-amber-400 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Torre de Controle
          </button>
          <button
            onClick={() => navigate('/matchmaking')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'matchmaking'
                ? 'bg-amber-400 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Deck de Match
          </button>
        </div>
      </div>

      <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-1.5 w-80 gap-2 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/30 transition-all">
        <Search className="w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar pedidos, rotas ou filiais..."
          className="bg-transparent text-sm w-full focus:outline-none placeholder-zinc-600 text-zinc-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
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
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);

  const [novoPedido, setNovoPedido] = useState({ cliente: '', enderecoColeta: '', enderecoEntrega: '', pesoCarga: '', nivelUrgencia: 'MEDIO', valorCarga: '' });
  const [enviandoPedido, setEnviandoPedido] = useState(false);

  // States do Autocomplete Entrega
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);

  // States do Autocomplete Coleta
  const [coletaSuggestions, setColetaSuggestions] = useState([]);
  const [isSearchingColeta, setIsSearchingColeta] = useState(false);
  const [showColetaSuggestions, setShowColetaSuggestions] = useState(false);
  const [selectedColetaCoords, setSelectedColetaCoords] = useState(null);

  const [companyCoords, setCompanyCoords] = useState(null);

  const [orders, setOrders] = useState([]);
  const [transportadoras, setTransportadoras] = useState([]);
  const [analytics, setAnalytics] = useState({
    taxaAceite: 0,
    entregasConcluidas: 0
  });
  const [loading, setLoading] = useState(true);

  // === SIMULAÇÃO DE ENTREGA ===
  const MAX_SIMULACOES = 5;
  const [simulacoes, setSimulacoes] = useState({});
  const intervalosRef = useRef({});

  // Limpa intervalos ao desmontar
  useEffect(() => {
    return () => { 
      Object.values(intervalosRef.current).forEach(id => clearInterval(id)); 
    };
  }, []);

  const buscarPontosDaRua = async (latOrigem, lonOrigem, latDestino, lonDestino) => {
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${lonOrigem},${latOrigem};${lonDestino},${latDestino}?geometries=geojson&access_token=${mapboxToken}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar rota no Mapbox:", error);
      return [];
    }
  };

  const iniciarSimulacaoCarga = async (pedido, transportadora) => {
    if (Object.keys(simulacoes).length >= MAX_SIMULACOES && !simulacoes[pedido.id]) {
      alert(`Limite de ${MAX_SIMULACOES} simulações simultâneas atingido.`);
      return;
    }

    if (intervalosRef.current[pedido.id]) clearInterval(intervalosRef.current[pedido.id]);
    
    setSimulacoes(prev => ({
      ...prev,
      [pedido.id]: {
        pedido,
        faseSimulacao: 'COLETA',
        posicaoCarrinho: null,
        exibirPinoColeta: true,
        liberarConfirmacao: false
      }
    }));
    setActiveModal(null);

    // FASE 1: Transportadora -> Coleta
    const rotaAteColeta = await buscarPontosDaRua(
      transportadora.latitude, transportadora.longitude,
      pedido.latitudeColeta, pedido.longitudeColeta
    );
    if (rotaAteColeta.length === 0) {
      setSimulacoes(prev => { const copy = {...prev}; delete copy[pedido.id]; return copy; });
      return;
    }

    const velocidadeFase1 = Math.max(100, Math.round(30000 / rotaAteColeta.length));
    let idx = 0;
    intervalosRef.current[pedido.id] = setInterval(async () => {
      if (idx < rotaAteColeta.length) {
        setSimulacoes(prev => ({
          ...prev,
          [pedido.id]: { ...prev[pedido.id], posicaoCarrinho: rotaAteColeta[idx] }
        }));
        idx++;
      } else {
        clearInterval(intervalosRef.current[pedido.id]);
        
        setSimulacoes(prev => ({
          ...prev,
          [pedido.id]: { ...prev[pedido.id], exibirPinoColeta: false, faseSimulacao: 'ENTREGA' }
        }));

        // Atualiza status no backend
        try {
          await api.patch(`/api/pedidos/${pedido.id}/status`, { statusPedido: 'EM_ROTA_ENTREGA' });
          setOrders(prev => prev.map(o => o.id === pedido.id ? { ...o, statusPedido: 'EM_ROTA_ENTREGA' } : o));
        } catch(e) { console.error(e); }

        // FASE 2: Coleta -> Entrega
        const rotaAteEntrega = await buscarPontosDaRua(
          pedido.latitudeColeta, pedido.longitudeColeta,
          pedido.latitudeDestino, pedido.longitudeDestino
        );
        const velocidadeFase2 = Math.max(100, Math.round(30000 / rotaAteEntrega.length));
        let idx2 = 0;
        intervalosRef.current[pedido.id] = setInterval(() => {
          if (idx2 < rotaAteEntrega.length) {
             setSimulacoes(prev => ({
               ...prev,
               [pedido.id]: { ...prev[pedido.id], posicaoCarrinho: rotaAteEntrega[idx2] }
             }));
             idx2++;
          } else {
            clearInterval(intervalosRef.current[pedido.id]);
            setSimulacoes(prev => ({
               ...prev,
               [pedido.id]: { ...prev[pedido.id], faseSimulacao: 'CONCLUIDO', liberarConfirmacao: true }
            }));
          }
        }, velocidadeFase2);
      }
    }, velocidadeFase1);
  };

  const location = useLocation();
  const autoSimulouRef = useRef(false);

  useEffect(() => {
    carregarDashboard();
  }, []);

  // Auto-iniciar simulação quando vem do Matchmaking
  useEffect(() => {
    if (location.state?.autoSimular && location.state?.pedido && location.state?.transportadora && !loading) {
      if (autoSimulouRef.current) return;
      autoSimulouRef.current = true;

      const { pedido, transportadora } = location.state;
      // Busca o pedido atualizado da lista (já com status EM_ROTA_COLETA)
      const pedidoAtualizado = orders.find(o => o.id === pedido.id);
      
      iniciarSimulacaoCarga(pedidoAtualizado || pedido, transportadora);
      
      // Limpa o state corretamente usando React Router
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, loading, orders, navigate, location.pathname]);

  useEffect(() => {
    if (user?.enderecoSede) {
      const geocodeCompany = async () => {
        try {
          const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
          if (!mapboxToken || mapboxToken === 'COLE_SEU_TOKEN_AQUI') return;
          const query = encodeURIComponent(user.enderecoSede + ", SP, Brasil");
          const bbox = "-47.05,-24.35,-45.90,-23.75";
          const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxToken}&bbox=${bbox}&limit=1`);
          const data = await res.json();
          if (data.features && data.features.length > 0) {
            const [lon, lat] = data.features[0].center;
            setCompanyCoords({ lat, lon });
          }
        } catch (err) {
          console.error("Erro ao localizar sede no mapa:", err);
        }
      };
      geocodeCompany();
    }
  }, [user]);

  // Hook do Autocomplete Entrega
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (novoPedido.enderecoEntrega.length > 4 && showSuggestions && !selectedCoords) {
        setIsSearchingAddress(true);
        try {
          const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
          if (!mapboxToken || mapboxToken === 'COLE_SEU_TOKEN_AQUI') return;
          const query = encodeURIComponent(novoPedido.enderecoEntrega + ", SP, Brasil");
          const bbox = "-47.05,-24.35,-45.90,-23.75";
          const geoResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxToken}&bbox=${bbox}&limit=5&language=pt`);
          const geoData = await geoResponse.json();
          setAddressSuggestions(geoData.features || []);
        } catch (error) {
          console.error("Erro na busca de endereço de entrega:", error);
        } finally {
          setIsSearchingAddress(false);
        }
      } else {
        setAddressSuggestions([]);
      }
    }, 600);
    return () => clearTimeout(delayDebounceFn);
  }, [novoPedido.enderecoEntrega, showSuggestions, selectedCoords]);

  const handleSelectSuggestion = (sug) => {
    const displayNameParts = sug.place_name.split(',');
    const displayName = displayNameParts.length >= 2 ? `${displayNameParts[0].trim()}, ${displayNameParts[1].trim()}` : sug.place_name;
    setNovoPedido({ ...novoPedido, enderecoEntrega: displayName });
    setSelectedCoords({ lat: sug.center[1], lon: sug.center[0] });
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  // Hook do Autocomplete Coleta
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (novoPedido.enderecoColeta.length > 4 && showColetaSuggestions && !selectedColetaCoords) {
        setIsSearchingColeta(true);
        try {
          const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
          if (!mapboxToken || mapboxToken === 'COLE_SEU_TOKEN_AQUI') return;
          const query = encodeURIComponent(novoPedido.enderecoColeta + ", SP, Brasil");
          const bbox = "-47.05,-24.35,-45.90,-23.75";
          const geoResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxToken}&bbox=${bbox}&limit=5&language=pt`);
          const geoData = await geoResponse.json();
          setColetaSuggestions(geoData.features || []);
        } catch (error) {
          console.error("Erro na busca de endereço de coleta:", error);
        } finally {
          setIsSearchingColeta(false);
        }
      } else {
        setColetaSuggestions([]);
      }
    }, 600);
    return () => clearTimeout(delayDebounceFn);
  }, [novoPedido.enderecoColeta, showColetaSuggestions, selectedColetaCoords]);

  const handleSelectColetaSuggestion = (sug) => {
    const displayNameParts = sug.place_name.split(',');
    const displayName = displayNameParts.length >= 2 ? `${displayNameParts[0].trim()}, ${displayNameParts[1].trim()}` : sug.place_name;
    setNovoPedido({ ...novoPedido, enderecoColeta: displayName });
    setSelectedColetaCoords({ lat: sug.center[1], lon: sug.center[0] });
    setShowColetaSuggestions(false);
    setColetaSuggestions([]);
  };
  const carregarDashboard = async () => {
    try {
      setLoading(true);

      const [resPedidos, resTransportadoras, resAnalytics] = await Promise.all([
        api.get('/api/pedidos'),
        api.get('/api/transportadoras'),
        api.get('/api/analytics/taxa-aceite')
      ]);
      setOrders(resPedidos.data || []);
      setTransportadoras(resTransportadoras.data || []);

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
      case 'EM_ROTA_COLETA': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'EM_ROTA_ENTREGA': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
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

  const handleUpdateAddress = async () => {
    if (!newAddress.trim()) return;
    try {
      setSavingAddress(true);
      const res = await api.patch('/api/usuarios/me/endereco', { enderecoSede: newAddress });
      const updatedUser = res.data;
      const token = localStorage.getItem('@FleetSync:token');
      login(token, updatedUser);
      setIsEditingAddress(false);
    } catch (err) {
      alert("Erro ao atualizar endereço da sede.");
    } finally {
      setSavingAddress(false);
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
    
    let finalLatDest, finalLonDest, finalLatCol, finalLonCol;

    if (selectedCoords) {
      finalLatDest = selectedCoords.lat;
      finalLonDest = selectedCoords.lon;
    } else {
      finalLatDest = -23.9618 + (Math.random() * 0.005); 
      finalLonDest = -46.3322 + (Math.random() * 0.005);
    }

    if (selectedColetaCoords) {
      finalLatCol = selectedColetaCoords.lat;
      finalLonCol = selectedColetaCoords.lon;
    } else {
      finalLatCol = -23.9718 + (Math.random() * 0.005); 
      finalLonCol = -46.3422 + (Math.random() * 0.005);
    }

    const distMin = 0.001; 
    const dLat = Math.abs(finalLatDest - finalLatCol);
    const dLon = Math.abs(finalLonDest - finalLonCol);
    if (dLat < distMin && dLon < distMin) {
      alert("Operação Bloqueada: O Endereço de Coleta e o Endereço de Entrega não podem ser o mesmo local.");
      return;
    }

    try {
      setEnviandoPedido(true);

      const response = await api.post('/api/pedidos', {
        ...novoPedido,
        pesoCarga: Number(novoPedido.pesoCarga) || 0,
        statusPedido: 'PENDENTE',
        latitudeDestino: finalLatDest,
        longitudeDestino: finalLonDest,
        latitudeColeta: finalLatCol,
        longitudeColeta: finalLonCol
      });
      
      setOrders([response.data, ...orders]);
      setActiveModal(null);
      setNovoPedido({ cliente: '', enderecoColeta: '', enderecoEntrega: '', pesoCarga: '', nivelUrgencia: 'MEDIO', valorCarga: '' });
      setSelectedCoords(null);
      setSelectedColetaCoords(null);
      
      navigate('/matchmaking');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("O Backend rejeitou o pedido! Motivo provável: Origem e Destino muito próximos (Regra de Negócio).");
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
        onOpenProfile={() => {
          setIsEditingAddress(false);
          setNewAddress(user?.enderecoSede || '');
          setActiveModal('profile');
        }}
        activeTab="dashboard"
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
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Transportadoras Ativas</p>
              <h4 className="text-3xl font-black text-zinc-900 tracking-tight">{loading ? '...' : transportadoras.length}</h4>
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
              <MapContainer 
                center={[-23.9618, -46.3322]} 
                zoom={11} 
                minZoom={10} 
                maxZoom={18} 
                maxBounds={[
                  [-24.35, -47.05], // Sudoeste
                  [-23.75, -45.90]  // Nordeste
                ]}
                maxBoundsViscosity={1.0}
                className="w-full h-full z-0"
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {transportadoras.map(t => (
                  <Marker 
                    key={`transportadora-${t.id}`} 
                    position={[t.latitude, t.longitude]} 
                    icon={motoristaIcon}
                  >
                    <Popup>
                      <b>{t.nomeEmpresa}</b><br/>
                      CNPJ: {t.cnpj}<br/>
                      Tel: {t.telefone}<br/>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.5 mt-1 rounded font-bold uppercase">Capacidade: {t.capacidade} kg</span>
                    </Popup>
                  </Marker>
                ))}

                {companyCoords && (
                  <Marker position={[companyCoords.lat, companyCoords.lon]} icon={companyIcon}>
                    <Popup>
                      <div className="text-center">
                        <b className="text-blue-700">Sua Sede Operacional</b><br/>
                        <span className="font-bold text-zinc-900">{user?.nome}</span><br/>
                        <span className="text-[10px] text-zinc-500 leading-tight">{user?.enderecoSede}</span>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {orders.filter(o => o.statusPedido !== 'ENTREGUE').filter(o => !simulacoes[o.id]).map(o => (
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

                {/* === SIMULAÇÕES EM MOVIMENTO === */}
                {Object.values(simulacoes).map(sim => (
                  <React.Fragment key={`sim-${sim.pedido.id}`}>
                    {/* Carrinho em movimento */}
                    {sim.faseSimulacao !== 'IDLE' && sim.posicaoCarrinho && (
                      <Marker position={sim.posicaoCarrinho} icon={sim.faseSimulacao === 'CONCLUIDO' ? finalizadoIcon : frotaIcon}>
                        <Popup>
                          <b>🚚 {sim.pedido.cliente}</b><br/>
                          Fase: <span style={{color:'#f59e0b', fontWeight:'bold'}}>{sim.faseSimulacao === 'COLETA' ? 'Indo para Coleta' : sim.faseSimulacao === 'ENTREGA' ? 'Entregando' : 'Concluído'}</span>
                        </Popup>
                      </Marker>
                    )}

                    {/* Pino de Coleta (some ao coletar) */}
                    {sim.exibirPinoColeta && sim.faseSimulacao === 'COLETA' && (
                      <Marker position={[sim.pedido.latitudeColeta, sim.pedido.longitudeColeta]} icon={pedidoIcon}>
                        <Popup>📦 Ponto de Coleta</Popup>
                      </Marker>
                    )}

                    {/* Pino de Destino Final (permanece visível até entrega) */}
                    {sim.faseSimulacao !== 'IDLE' && sim.faseSimulacao !== 'CONCLUIDO' && (
                      <Marker position={[sim.pedido.latitudeDestino, sim.pedido.longitudeDestino]} icon={pedidoIcon}>
                        <Popup>🏁 Destino Final de Entrega</Popup>
                      </Marker>
                    )}
                  </React.Fragment>
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
                      <h5 className="text-sm font-bold text-zinc-900 mt-0.5 flex items-center gap-1.5">
                        {order.cliente || 'Cliente'}
                        {simulacoes[order.id] && simulacoes[order.id].faseSimulacao === 'CONCLUIDO' && (
                          <span title="Entrega Concluída - Aguardando Confirmação" className="inline-flex relative items-center justify-center">
                            <Bell className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                            <span className="absolute top-0 right-0 -mt-0.5 -mr-0.5 flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                          </span>
                        )}
                      </h5>
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
                  
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-500">Endereço da Sede</span>
                      {!isEditingAddress && (
                        <button onClick={() => setIsEditingAddress(true)} className="text-[10px] bg-zinc-200 hover:bg-amber-400 text-zinc-700 hover:text-black px-2 py-0.5 rounded transition-colors font-bold cursor-pointer">Alterar</button>
                      )}
                    </div>
                    {isEditingAddress ? (
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          value={newAddress}
                          onChange={(e) => setNewAddress(e.target.value)}
                          placeholder="Digite o novo endereço"
                          className="w-full text-xs p-2 border border-zinc-300 rounded focus:outline-none focus:border-amber-400"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => setIsEditingAddress(false)} className="flex-1 bg-zinc-200 py-1.5 rounded text-[10px] font-bold text-zinc-700 cursor-pointer">Cancelar</button>
                          <button onClick={handleUpdateAddress} disabled={savingAddress} className="flex-1 bg-zinc-950 text-white py-1.5 rounded text-[10px] font-bold hover:bg-amber-500 hover:text-black transition-colors cursor-pointer disabled:opacity-50">
                            {savingAddress ? 'Salvando...' : 'Salvar'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-zinc-900 flex items-start gap-1">
                        <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" /> 
                        {user?.enderecoSede || 'Não cadastrado'}
                      </p>
                    )}
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
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-zinc-600 flex items-start gap-1.5 font-medium"><MapPin className="w-4 h-4 text-amber-500 shrink-0" /> <span><span className="font-bold">Coleta:</span> {selectedOrder.enderecoColeta}</span></p>
                      <p className="text-xs text-zinc-600 flex items-start gap-1.5 font-medium"><MapPin className="w-4 h-4 text-emerald-500 shrink-0" /> <span><span className="font-bold">Entrega:</span> {selectedOrder.enderecoEntrega}</span></p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-medium text-zinc-600">
                    <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl">
                      <span className="text-zinc-400 block text-[10px] font-bold">PESO</span>
                      <span className="text-sm font-bold text-zinc-900">{selectedOrder.pesoCarga} kg</span>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl">
                      <span className="text-zinc-400 block text-[10px] font-bold">STATUS ATUAL</span>
                      <span className="text-sm font-bold text-zinc-900">{selectedOrder.statusPedido}</span>
                    </div>
                  </div>

                  {/* NOVIDADE: BOTÃO PROCURAR TRANSPORTE CONDICIONAL */}
                  {selectedOrder.statusPedido === 'PENDENTE' && (
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        navigate('/matchmaking');
                      }}
                      className="w-full bg-zinc-950 hover:bg-amber-500 text-white hover:text-black font-black py-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-zinc-950/10"
                    >
                      <Navigation className="w-4 h-4 fill-current rotate-45" />
                      Procurar Transporte Adequado
                    </button>
                  )}

                  <div className="flex items-center justify-between border-y border-zinc-100 py-3">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400">OPERADOR ALOCADO</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedOrder.transportadora ? selectedOrder.transportadora.nomeEmpresa : "Aguardando transportadora"}</p>
                    </div>
                    {selectedOrder.transportadora && (
                      <button className="text-xs font-bold bg-zinc-900 text-white hover:bg-amber-500 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer">Ver Perfil</button>
                    )}
                  </div>
                  {/* Banner quando simulação está ativa para este pedido */}
                  {simulacoes[selectedOrder.id] && (
                    <div className={`p-3 rounded-xl text-xs font-bold text-center mb-2 ${
                      simulacoes[selectedOrder.id].faseSimulacao === 'COLETA' ? 'bg-amber-50 border border-amber-200 text-amber-800' :
                      simulacoes[selectedOrder.id].faseSimulacao === 'ENTREGA' ? 'bg-blue-50 border border-blue-200 text-blue-800' :
                      'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    }`}>
                      {simulacoes[selectedOrder.id].faseSimulacao === 'COLETA' && '🚚 Veículo em rota para COLETA...'}
                      {simulacoes[selectedOrder.id].faseSimulacao === 'ENTREGA' && '📦 Carga coletada! Em rota para ENTREGA...'}
                      {simulacoes[selectedOrder.id].faseSimulacao === 'CONCLUIDO' && '✅ Veículo chegou ao destino!'}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {/* Botão de confirmação de entrega - bloqueado durante simulação */}
                    {simulacoes[selectedOrder.id] ? (
                      <button
                        disabled={!simulacoes[selectedOrder.id].liberarConfirmacao}
                        onClick={async () => {
                          await api.patch(`/api/pedidos/${selectedOrder.id}/status`, { statusPedido: 'ENTREGUE' });
                          setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, statusPedido: 'ENTREGUE' } : o));
                          
                          setSimulacoes(prev => {
                            const copy = { ...prev };
                            delete copy[selectedOrder.id];
                            return copy;
                          });
                          
                          setActiveModal(null);
                          carregarDashboard();
                        }}
                        className={`py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                          simulacoes[selectedOrder.id].liberarConfirmacao
                            ? 'bg-emerald-500 border border-emerald-600 text-white hover:bg-emerald-600 cursor-pointer shadow-sm shadow-emerald-500/20'
                            : 'bg-zinc-100 border border-zinc-200 text-zinc-400 cursor-not-allowed'
                        }`}
                      >
                        {simulacoes[selectedOrder.id].faseSimulacao === 'CONCLUIDO' ? '✅ Confirmar Entrega' : '🚚 Em Trânsito...'}
                      </button>
                    ) : selectedOrder.statusPedido === 'EM_ROTA_COLETA' ? (
                      <div className="bg-amber-50 border border-amber-200 text-amber-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center">Aguardando Simulação</div>
                    ) : selectedOrder.statusPedido === 'EM_ROTA_ENTREGA' ? (
                      <div className="bg-blue-50 border border-blue-200 text-blue-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center">Em Trânsito</div>
                    ) : (
                      <div className="bg-zinc-50 border border-zinc-200 text-zinc-400 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center">Aguardando Rota</div>
                    )}
                    <button onClick={() => setActiveModal('cancel')} className="bg-rose-50 text-rose-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer hover:bg-rose-100">Cancelar/Excluir</button>
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
                    Preencha os dados da carga. O sistema buscará transportadoras após a criação.
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
                    <label className="text-xs font-bold text-zinc-500">Endereço de Coleta (Busca Inteligente)</label>
                    <input 
                      type="text" 
                      required 
                      value={novoPedido.enderecoColeta}
                      onFocus={() => setShowColetaSuggestions(true)}
                      onChange={(e) => {
                        setNovoPedido({...novoPedido, enderecoColeta: e.target.value});
                        setShowColetaSuggestions(true);
                        setSelectedColetaCoords(null);
                      }}
                      placeholder="Ex: Av. Ana Costa, 50" 
                      className="bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" 
                    />
                    {isSearchingColeta && (
                      <div className="absolute right-3 top-8 text-xs text-amber-500 font-bold">...</div>
                    )}
                    {showColetaSuggestions && (coletaSuggestions.length > 0 || (user?.enderecoSede && companyCoords)) && (
                      <div className="absolute top-[65px] left-0 right-0 bg-white border border-zinc-200 rounded-xl shadow-xl z-[9999] max-h-48 overflow-y-auto">
                        {user?.enderecoSede && companyCoords && (
                          <div 
                            onClick={() => {
                              setNovoPedido({ ...novoPedido, enderecoColeta: user.enderecoSede });
                              setSelectedColetaCoords({ lat: companyCoords.lat, lon: companyCoords.lon });
                              setShowColetaSuggestions(false);
                            }}
                            className="px-3 py-2.5 text-xs bg-amber-50 hover:bg-amber-100 cursor-pointer border-b border-amber-200/50 flex items-start gap-2 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <div className="flex flex-col">
                              <span className="text-amber-800 font-bold uppercase tracking-wider text-[10px]">Endereço da sua empresa</span>
                              <span className="text-zinc-900 font-bold">{user.enderecoSede}</span>
                            </div>
                          </div>
                        )}
                        {coletaSuggestions.map((sug, i) => (
                          <div 
                            key={i} 
                            onClick={() => handleSelectColetaSuggestion(sug)}
                            className="px-3 py-2.5 text-xs hover:bg-amber-50 cursor-pointer border-b border-zinc-100 last:border-0 flex items-start gap-2 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-zinc-700 font-medium">{sug.place_name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 relative">
                    <label className="text-xs font-bold text-zinc-500">Endereço de Destino (Busca Inteligente)</label>
                    <input 
                      type="text" 
                      required 
                      value={novoPedido.enderecoEntrega}
                      onFocus={() => setShowSuggestions(true)}
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
                    {showSuggestions && (addressSuggestions.length > 0 || (user?.enderecoSede && companyCoords)) && (
                      <div className="absolute top-[65px] left-0 right-0 bg-white border border-zinc-200 rounded-xl shadow-xl z-[9999] max-h-48 overflow-y-auto">
                        {user?.enderecoSede && companyCoords && (
                          <div 
                            onClick={() => {
                              setNovoPedido({ ...novoPedido, enderecoEntrega: user.enderecoSede });
                              setSelectedCoords({ lat: companyCoords.lat, lon: companyCoords.lon });
                              setShowSuggestions(false);
                            }}
                            className="px-3 py-2.5 text-xs bg-amber-50 hover:bg-amber-100 cursor-pointer border-b border-amber-200/50 flex items-start gap-2 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <div className="flex flex-col">
                              <span className="text-amber-800 font-bold uppercase tracking-wider text-[10px]">Endereço da sua empresa</span>
                              <span className="text-zinc-900 font-bold">{user.enderecoSede}</span>
                            </div>
                          </div>
                        )}
                        {addressSuggestions.map((sug, i) => (
                          <div 
                            key={i} 
                            onClick={() => handleSelectSuggestion(sug)}
                            className="px-3 py-2.5 text-xs hover:bg-amber-50 cursor-pointer border-b border-zinc-100 last:border-0 flex items-start gap-2 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-zinc-700 font-medium">{sug.place_name}</span>
                          </div>
                        ))}
                      </div>
                    )}
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
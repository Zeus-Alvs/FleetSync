package com.fatec.fleetsync.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fatec.fleetsync.dto.MatchResponseDTO;
import com.fatec.fleetsync.exception.ResourceNotFoundException;
import com.fatec.fleetsync.model.MatchEntrega;
import com.fatec.fleetsync.model.Transportadora;
import com.fatec.fleetsync.model.Pedido;
import com.fatec.fleetsync.model.enums.NivelUrgencia;
import com.fatec.fleetsync.model.enums.StatusMatch;
import com.fatec.fleetsync.model.enums.StatusPedido;
import com.fatec.fleetsync.repository.MatchEntregaRepository;
import com.fatec.fleetsync.repository.TransportadoraRepository;
import com.fatec.fleetsync.repository.PedidoRepository;
import com.fatec.fleetsync.repository.TransportadoraRepository;

@Service
public class MatchService {

    @Autowired private PedidoRepository       pedidoRepository;
    @Autowired private TransportadoraRepository transportadoraRepository;
    @Autowired private MatchEntregaRepository matchEntregaRepository;

    private double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.asin(Math.sqrt(a));
    }

    private double scoreDistancia(double km) {
        return Math.max(0, Math.min(100, 100.0 - km));
    }

    private double scoreCarga(double pesoCarga, double capacidade) {
        if (capacidade <= 0) return 0;
        double aproveitamento = pesoCarga / capacidade;
        if (aproveitamento > 1.0) return 0;
        return Math.max(0, Math.min(100, aproveitamento * 100.0));
    }

    private double bonusUrgencia(NivelUrgencia urgencia) {
        if (urgencia == null) return 0;
        switch (urgencia) {
            case CRITICO: return 30;
            case ALTO:    return 20;
            case MEDIO:   return 10;
            default:      return 0;
        }
    }

    private int calcularScore(Pedido pedido, Transportadora transportadora) {
        double dist   = calcularDistancia(
            transportadora.getLatitude(),  transportadora.getLongitude(),
            pedido.getLatitudeColeta(),    pedido.getLongitudeColeta());
        double sDist  = scoreDistancia(dist) * 0.40;
        double sCarga = scoreCarga(pedido.getPesoCarga(),
                        transportadora.getCapacidade()) * 0.40;
        double sUrg   = (bonusUrgencia(pedido.getNivelUrgencia()) / 30.0) * 20.0;
        return (int) Math.round(Math.min(100, sDist + sCarga + sUrg));
    }

    @Transactional
    public List<MatchResponseDTO> recomendar(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + pedidoId));

        List<MatchEntrega> sugestoes = new ArrayList<>();

        for (Transportadora t : transportadoraRepository.findAll()) {
            if (t.getCapacidade() < pedido.getPesoCarga()) continue;
            if (matchEntregaRepository.existsByPedidoAndTransportadoraAndStatusMatch(
                    pedido, t, StatusMatch.RECUSADO))                        continue;

            MatchEntrega match = new MatchEntrega();
            match.setPedido(pedido);
            match.setTransportadora(t);
            match.setScoreCompatibilidade(calcularScore(pedido, t));
            match.setStatusMatch(StatusMatch.SUGERIDO);
            sugestoes.add(matchEntregaRepository.save(match));
        }

        sugestoes.sort(Comparator.comparingInt(MatchEntrega::getScoreCompatibilidade).reversed());

        List<MatchResponseDTO> resultado = new ArrayList<>();
        for (MatchEntrega me : sugestoes) {
            double dist = calcularDistancia(
                me.getTransportadora().getLatitude(), me.getTransportadora().getLongitude(),
                pedido.getLatitudeColeta(), pedido.getLongitudeColeta());
            resultado.add(MatchResponseDTO.from(me, Math.round(dist * 10.0) / 10.0));
        }
        return resultado;
    }

    @Transactional
    public MatchEntrega responder(Long matchId, String statusStr) {
        MatchEntrega match = matchEntregaRepository.findById(matchId)
            .orElseThrow(() -> new ResourceNotFoundException("Match não encontrado: " + matchId));

        StatusMatch novoStatus = StatusMatch.valueOf(statusStr.toUpperCase());

        if (novoStatus == StatusMatch.ACEITO) {
            match.setStatusMatch(StatusMatch.ACEITO);
            match.getPedido().setStatusPedido(StatusPedido.EM_ROTA_COLETA);
            
            // ADICIONE ESTA LINHA: Carimba a filial escolhida dentro do pedido
            match.getPedido().setTransportadora(match.getTransportadora()); 
            
            pedidoRepository.save(match.getPedido());
        } else if (novoStatus == StatusMatch.RECUSADO) {
            match.setStatusMatch(StatusMatch.RECUSADO);
        } else {
            throw new IllegalArgumentException("Use ACEITO ou RECUSADO neste endpoint.");
        }

        return matchEntregaRepository.save(match);
    }

    @Transactional
    public MatchEntrega iniciarEntrega(Long matchId) {
        MatchEntrega match = matchEntregaRepository.findById(matchId)
            .orElseThrow(() -> new ResourceNotFoundException("Match não encontrado: " + matchId));

        if (match.getStatusMatch() != StatusMatch.ACEITO) {
            throw new IllegalArgumentException(
                "Apenas matches ACEITOS podem ser iniciados. Status atual: "
                + match.getStatusMatch());
        }

        match.setStatusMatch(StatusMatch.EM_ANDAMENTO);
        return matchEntregaRepository.save(match);
    }

    @Transactional
    public MatchEntrega concluir(Long matchId) {
        MatchEntrega match = matchEntregaRepository.findById(matchId)
            .orElseThrow(() -> new ResourceNotFoundException("Match não encontrado: " + matchId));

        if (match.getStatusMatch() != StatusMatch.EM_ANDAMENTO) {
            throw new IllegalArgumentException(
                "Apenas matches EM_ANDAMENTO podem ser concluídos. Status atual: "
                + match.getStatusMatch());
        }

        match.setStatusMatch(StatusMatch.CONCLUIDO);
        match.getPedido().setStatusPedido(StatusPedido.ENTREGUE);
        pedidoRepository.save(match.getPedido());

        return matchEntregaRepository.save(match);
    }
}

package com.fatec.fleetsync.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fatec.fleetsync.exception.RegraNegocioException;
import com.fatec.fleetsync.model.Pedido;
import com.fatec.fleetsync.model.Usuario;
import com.fatec.fleetsync.model.enums.StatusPedido;
import com.fatec.fleetsync.repository.PedidoRepository;
import com.fatec.fleetsync.repository.MatchEntregaRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private MatchEntregaRepository matchEntregaRepository;

    public Pedido cadastrarPedido(Pedido pedido, Usuario usuarioLogado) {
        if (pedido.getLatitudeDestino() != null && pedido.getLongitudeDestino() != null &&
            pedido.getLatitudeColeta() != null && pedido.getLongitudeColeta() != null) {
            double distMin = 0.001; 
            double dLat = Math.abs(pedido.getLatitudeDestino()  - pedido.getLatitudeColeta());
            double dLon = Math.abs(pedido.getLongitudeDestino() - pedido.getLongitudeColeta());
            if (dLat < distMin && dLon < distMin) {
                throw new RegraNegocioException(
                    "O endereço de entrega não pode ser o mesmo que o endereço de coleta.");
            }
        }
        pedido.setUsuario(usuarioLogado);
        pedido.setStatusPedido(StatusPedido.PENDENTE);
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listarPorUsuario(Usuario usuarioLogado) {
        return pedidoRepository.findByUsuario(usuarioLogado);
    }

    public List<Pedido> listarPendentesPorUsuario(Usuario usuarioLogado) {
        return pedidoRepository.findByUsuarioAndStatusPedido(usuarioLogado, StatusPedido.PENDENTE);
    }

    @Transactional
    public void deletarPedido(Long id, Usuario usuarioLogado) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + id));
        if (pedido.getUsuario() != null && !pedido.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Não autorizado a deletar este pedido");
        }
        matchEntregaRepository.deleteByPedido(pedido);
        pedidoRepository.delete(pedido);
    }

    public Pedido atualizarStatus(Long id, String novoStatus, Usuario usuarioLogado) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + id));
        if (pedido.getUsuario() != null && !pedido.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Não autorizado a atualizar este pedido");
        }
        pedido.setStatusPedido(StatusPedido.valueOf(novoStatus.toUpperCase()));
        return pedidoRepository.save(pedido);
    }
}

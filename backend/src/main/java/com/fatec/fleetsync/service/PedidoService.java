package com.fatec.fleetsync.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fatec.fleetsync.exception.RegraNegocioException;
import com.fatec.fleetsync.model.Pedido;
import com.fatec.fleetsync.model.enums.StatusPedido;
import com.fatec.fleetsync.repository.PedidoRepository;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public Pedido cadastrarPedido(Pedido pedido) {
        if (pedido.getLatitudeDestino() != null && pedido.getLongitudeDestino() != null) {
            double latHub  = -23.9608;
            double lonHub  = -46.3339;
            double distMin = 0.001; // Reduzido de 0.05 para aceitar entregas próximas (ex: mesma cidade)
            double dLat = Math.abs(pedido.getLatitudeDestino()  - latHub);
            double dLon = Math.abs(pedido.getLongitudeDestino() - lonHub);
            if (dLat < distMin && dLon < distMin) {
                throw new RegraNegocioException(
                    "O endereço de entrega não pode ser o mesmo que a origem do hub logístico.");
            }
        }
        pedido.setStatusPedido(StatusPedido.PENDENTE);
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public List<Pedido> listarPendentes() {
        return pedidoRepository.findByStatusPedido(StatusPedido.PENDENTE);
    }

    public void deletarPedido(Long id) {
        if (!pedidoRepository.existsById(id)) {
            throw new RuntimeException("Pedido não encontrado: " + id);
        }
        pedidoRepository.deleteById(id);
    }

    public Pedido atualizarStatus(Long id, String novoStatus) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + id));
        pedido.setStatusPedido(StatusPedido.valueOf(novoStatus.toUpperCase()));
        return pedidoRepository.save(pedido);
    }
}

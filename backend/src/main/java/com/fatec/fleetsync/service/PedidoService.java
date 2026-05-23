package com.fatec.fleetsync.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fatec.fleetsync.model.Pedido;
import com.fatec.fleetsync.model.enums.StatusPedido;
import com.fatec.fleetsync.repository.PedidoRepository;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public Pedido cadastrarPedido(Pedido pedido) {
        pedido.setStatusPedido(StatusPedido.PENDENTE);
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listarPendentes() {
        return pedidoRepository.findByStatusPedido(StatusPedido.PENDENTE);
    }
}
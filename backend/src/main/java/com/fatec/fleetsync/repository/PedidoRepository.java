package com.fatec.fleetsync.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fatec.fleetsync.model.Pedido;
import com.fatec.fleetsync.model.enums.StatusPedido;

import com.fatec.fleetsync.model.Usuario;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByStatusPedido(StatusPedido statusPedido);
    List<Pedido> findByUsuario(Usuario usuario);
    List<Pedido> findByUsuarioAndStatusPedido(Usuario usuario, StatusPedido statusPedido);
}

package com.fatec.fleetsync.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.fatec.fleetsync.model.Pedido;
import com.fatec.fleetsync.model.enums.StatusPedido;
@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByStatusPedido(StatusPedido statusPedido);
}

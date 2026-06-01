package com.fatec.fleetsync.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.fatec.fleetsync.model.MatchEntrega;
import com.fatec.fleetsync.model.Motorista;
import com.fatec.fleetsync.model.Pedido;
import com.fatec.fleetsync.model.enums.StatusMatch;

@Repository
public interface MatchEntregaRepository extends JpaRepository<MatchEntrega, Long> {

    boolean existsByPedidoAndMotoristaAndStatusMatch(Pedido pedido, Motorista motorista, StatusMatch statusMatch);

    long countByStatusMatch(StatusMatch statusMatch);

    @Query("SELECT m.motorista.nome, COUNT(m.id) AS total " +
           "FROM MatchEntrega m " +
           "WHERE m.statusMatch = com.fatec.fleetsync.model.enums.StatusMatch.CONCLUIDO " +
           "GROUP BY m.motorista.nome " +
           "ORDER BY total DESC")
    List<Object[]> rankingProdutividade();

    @Query("SELECT p.cidade, COUNT(m.id) AS total " +
           "FROM MatchEntrega m " +
           "JOIN m.pedido p " +
           "WHERE p.cidade IS NOT NULL " +
           "GROUP BY p.cidade " +
           "ORDER BY total DESC")
    List<Object[]> gargalosPorCidade();
}

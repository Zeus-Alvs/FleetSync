package com.fatec.fleetsync.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.fatec.fleetsync.model.MatchEntrega;
@Repository
public interface MatchEntregaRepository extends JpaRepository<MatchEntrega, Long> {
}

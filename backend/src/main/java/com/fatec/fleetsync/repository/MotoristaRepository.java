package com.fatec.fleetsync.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.fatec.fleetsync.model.Motorista;
@Repository
public interface MotoristaRepository extends JpaRepository<Motorista, Long> {
}

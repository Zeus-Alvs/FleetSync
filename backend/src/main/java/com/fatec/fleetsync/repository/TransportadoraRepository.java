package com.fatec.fleetsync.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fatec.fleetsync.model.Transportadora;

@Repository
public interface TransportadoraRepository extends JpaRepository<Transportadora, Long> {
}

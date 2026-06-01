package com.fatec.fleetsync.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fatec.fleetsync.model.Motorista;
import com.fatec.fleetsync.repository.MotoristaRepository;

@Service
public class MotoristaService {

    @Autowired
    private MotoristaRepository motoristaRepository;

    public Motorista cadastrarMotorista(Motorista motorista) {
        motorista.setDisponivel(true);
        return motoristaRepository.save(motorista);
    }

    public List<Motorista> listarTodos() {
        return motoristaRepository.findAll();
    }

    public Motorista alterarDisponibilidade(Long id, Boolean disponivel) {
        Motorista motorista = motoristaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Motorista não encontrado."));
        
        motorista.setDisponivel(disponivel);
        return motoristaRepository.save(motorista);
    }
}
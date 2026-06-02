package com.fatec.fleetsync.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fatec.fleetsync.model.Transportadora;
import com.fatec.fleetsync.repository.TransportadoraRepository;

@Service
public class TransportadoraService {

    @Autowired
    private TransportadoraRepository transportadoraRepository;

    public List<Transportadora> listarTodos() {
        return transportadoraRepository.findAll();
    }

    public Transportadora cadastrarTransportadora(Transportadora transportadora) {
        return transportadoraRepository.save(transportadora);
    }
}

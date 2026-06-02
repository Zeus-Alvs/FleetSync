package com.fatec.fleetsync.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatec.fleetsync.model.Transportadora;
import com.fatec.fleetsync.service.TransportadoraService;
import com.fatec.fleetsync.repository.TransportadoraRepository;

@RestController
@RequestMapping("/api/transportadoras")
@CrossOrigin(origins = "http://localhost:5173")
public class TransportadoraController {

    @Autowired
    private TransportadoraService transportadoraService;

    @Autowired
    private TransportadoraRepository transportadoraRepository;

    @GetMapping
    public ResponseEntity<List<Transportadora>> listarTodos() {
        return ResponseEntity.ok(transportadoraService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<Transportadora> cadastrarTransportadora(@RequestBody Transportadora transportadora) {
        return ResponseEntity.ok(transportadoraService.cadastrarTransportadora(transportadora));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        transportadoraRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

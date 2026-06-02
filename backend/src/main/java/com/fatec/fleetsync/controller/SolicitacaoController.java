package com.fatec.fleetsync.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatec.fleetsync.model.Solicitacao;
import com.fatec.fleetsync.repository.SolicitacaoRepository;

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin(origins = "http://localhost:5173")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @GetMapping
    public ResponseEntity<List<Solicitacao>> listarTodas() {
        return ResponseEntity.ok(solicitacaoRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Solicitacao> criar(@RequestBody Solicitacao solicitacao) {
        return ResponseEntity.ok(solicitacaoRepository.save(solicitacao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        solicitacaoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

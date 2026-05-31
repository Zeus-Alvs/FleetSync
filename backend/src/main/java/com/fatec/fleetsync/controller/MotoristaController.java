package com.fatec.fleetsync.controller;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fatec.fleetsync.model.Motorista;
import com.fatec.fleetsync.service.MotoristaService;
@RestController
@RequestMapping("/api/motoristas")
@CrossOrigin(origins = "http://localhost:5173")
public class MotoristaController {
    @Autowired
    private MotoristaService motoristaService;
    @PostMapping
    public ResponseEntity<Motorista> criarMotorista(@RequestBody Motorista motorista) {
        try {
            Motorista novo = motoristaService.cadastrarMotorista(motorista);
            return ResponseEntity.ok(novo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping
    public ResponseEntity<List<Motorista>> listar() {
        return ResponseEntity.ok(motoristaService.listarTodos());
    }
    @PutMapping("/{id}/disponibilidade")
    public ResponseEntity<Motorista> atualizarDisponibilidade(
            @PathVariable Long id, 
            @RequestBody Map<String, Boolean> payload) {
        try {
            Boolean disponivel = payload.get("disponivel");
            Motorista atualizado = motoristaService.alterarDisponibilidade(id, disponivel);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
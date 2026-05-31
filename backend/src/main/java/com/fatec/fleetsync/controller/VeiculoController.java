package com.fatec.fleetsync.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fatec.fleetsync.model.Veiculo;
import com.fatec.fleetsync.service.VeiculoService;
@RestController
@RequestMapping("/api/veiculos")
@CrossOrigin(origins = "http://localhost:5173")
public class VeiculoController {
    @Autowired
    private VeiculoService veiculoService;
    @PostMapping
    public ResponseEntity<Veiculo> criarVeiculo(@RequestBody Veiculo veiculo) {
        try {
            Veiculo novoVeiculo = veiculoService.cadastrarVeiculo(veiculo);
            return ResponseEntity.ok(novoVeiculo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping
    public ResponseEntity<List<Veiculo>> listar() {
        return ResponseEntity.ok(veiculoService.listarTodos());
    }
}
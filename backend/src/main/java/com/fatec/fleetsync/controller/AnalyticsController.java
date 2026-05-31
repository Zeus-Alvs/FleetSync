package com.fatec.fleetsync.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
    @GetMapping("/taxa-aceite")
    public ResponseEntity<?> getTaxaAceite() {
        Map<String, Integer> mockDados = new HashMap<>();
        mockDados.put("aceitos", 0);
        mockDados.put("recusados", 0);
        return ResponseEntity.ok(mockDados);
    }
    @GetMapping("/gargalos-regiao")
    public ResponseEntity<?> getGargalosRegiao() {
        return ResponseEntity.ok(new ArrayList<>());
    }
    @GetMapping("/ranking")
    public ResponseEntity<?> getRankingProdutividade() {
        return ResponseEntity.ok(new ArrayList<>());
    }
}
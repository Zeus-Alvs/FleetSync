package com.fatec.fleetsync.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*") 
public class MatchController {
    @GetMapping("/recomendar/{pedidoId}")
    public ResponseEntity<?> recomendarMotoristas(@PathVariable Long pedidoId) {
        return ResponseEntity.ok(new ArrayList<>()); 
    }
    @PostMapping("/{matchId}/responder")
    public ResponseEntity<?> responderMatch(@PathVariable Long matchId, @RequestBody Map<String, String> resposta) {
        Map<String, String> retornoFake = new HashMap<>();
        retornoFake.put("mensagem", "Decisão (" + resposta.get("status") + ") processada pelo esqueleto com sucesso!");
        return ResponseEntity.ok(retornoFake);
    }
}
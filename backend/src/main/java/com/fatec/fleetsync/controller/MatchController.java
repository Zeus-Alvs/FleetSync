package com.fatec.fleetsync.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatec.fleetsync.dto.MatchResponseDTO;
import com.fatec.fleetsync.model.MatchEntrega;
import com.fatec.fleetsync.service.MatchService;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "http://localhost:5173")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @GetMapping("/recomendar/{pedidoId}")
    public ResponseEntity<List<MatchResponseDTO>> recomendarMotoristas(@PathVariable Long pedidoId) {
        return ResponseEntity.ok(matchService.recomendar(pedidoId));
    }

    @PostMapping("/{matchId}/responder")
    public ResponseEntity<MatchEntrega> responderMatch(
            @PathVariable Long matchId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(matchService.responder(matchId, body.get("status")));
    }

    @PatchMapping("/{matchId}/iniciar")
    public ResponseEntity<MatchEntrega> iniciarEntrega(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchService.iniciarEntrega(matchId));
    }

    @PatchMapping("/{matchId}/concluir")
    public ResponseEntity<MatchEntrega> concluirMatch(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchService.concluir(matchId));
    }
}

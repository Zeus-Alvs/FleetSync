package com.fatec.fleetsync.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatec.fleetsync.model.enums.StatusMatch;
import com.fatec.fleetsync.repository.MatchEntregaRepository;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {

    @Autowired
    private MatchEntregaRepository matchEntregaRepository;

    @GetMapping("/taxa-aceite")
    public ResponseEntity<Map<String, Object>> getTaxaAceite() {
        long aceitos   = matchEntregaRepository.countByStatusMatch(StatusMatch.ACEITO);
        long recusados = matchEntregaRepository.countByStatusMatch(StatusMatch.RECUSADO);
        long total     = aceitos + recusados;
        double taxa    = total > 0 ? Math.round((aceitos * 100.0 / total) * 10.0) / 10.0 : 0.0;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("aceitos",   aceitos);
        result.put("recusados", recusados);
        result.put("total",     total);
        result.put("taxa",      taxa);
        return ResponseEntity.ok(result);
    }

    @GetMapping({"/ranking-produtividade", "/ranking"})
    public ResponseEntity<List<Map<String, Object>>> getRankingProdutividade() {
        List<Object[]> rows = matchEntregaRepository.rankingProdutividade();
        List<Map<String, Object>> resultado = new ArrayList<>();
        int posicao = 1;
        for (Object[] row : rows) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("posicao",    posicao++);
            item.put("motorista",  row[0]);
            item.put("concluidos", row[1]);
            resultado.add(item);
        }
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/gargalos-regiao")
    public ResponseEntity<List<Map<String, Object>>> getGargalosRegiao() {
        List<Object[]> rows = matchEntregaRepository.gargalosPorCidade();
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("cidade", row[0]);
            item.put("total",  row[1]);
            resultado.add(item);
        }
        return ResponseEntity.ok(resultado);
    }
}

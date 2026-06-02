package com.fatec.fleetsync.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.fatec.fleetsync.model.Pedido;
import com.fatec.fleetsync.model.Usuario;
import com.fatec.fleetsync.service.PedidoService;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<Pedido> criarPedido(@RequestBody Pedido pedido, @AuthenticationPrincipal Usuario usuarioLogado) {
        try {
            return ResponseEntity.ok(pedidoService.cadastrarPedido(pedido, usuarioLogado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> listarTodos(@AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(pedidoService.listarPorUsuario(usuarioLogado));
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<Pedido>> buscarPendentes(@AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(pedidoService.listarPendentesPorUsuario(usuarioLogado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPedido(@PathVariable Long id, @AuthenticationPrincipal Usuario usuarioLogado) {
        try {
            pedidoService.deletarPedido(id, usuarioLogado);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Pedido> atualizarStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body, @AuthenticationPrincipal Usuario usuarioLogado) {
        try {
            return ResponseEntity.ok(pedidoService.atualizarStatus(id, body.get("statusPedido"), usuarioLogado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

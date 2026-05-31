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
import com.fatec.fleetsync.model.Pedido;
import com.fatec.fleetsync.service.PedidoService;
@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173") 
public class PedidoController {
    @Autowired
    private PedidoService pedidoService;
    @PostMapping
    public ResponseEntity<Pedido> criarPedido(@RequestBody Pedido pedido) {
        try {
            Pedido novoPedido = pedidoService.cadastrarPedido(pedido);
            return ResponseEntity.ok(novoPedido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/pendentes")
    public ResponseEntity<List<Pedido>> buscarPendentes() {
        List<Pedido> pendentes = pedidoService.listarPendentes();
        return ResponseEntity.ok(pendentes);
    }
}
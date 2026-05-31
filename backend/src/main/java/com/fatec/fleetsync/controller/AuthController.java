package com.fatec.fleetsync.controller;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fatec.fleetsync.model.Usuario;
import com.fatec.fleetsync.dto.CadastroRequestDTO;
import com.fatec.fleetsync.service.AuthService;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody CadastroRequestDTO dto) {
        try {
            Usuario salvo = authService.cadastrarUsuario(dto);
            return ResponseEntity.ok(salvo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        try {
            String email = credenciais.get("email");
            String senha = credenciais.get("senha");
            Usuario usuarioLogado = authService.autenticar(email, senha);
            return ResponseEntity.ok(usuarioLogado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
package com.fatec.fleetsync.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatec.fleetsync.dto.UsuarioResponseDTO;
import com.fatec.fleetsync.model.Usuario;
import com.fatec.fleetsync.dto.CadastroRequestDTO;
import com.fatec.fleetsync.service.AuthService;
import com.fatec.fleetsync.service.TokenService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    public record LoginResponseDTO(UsuarioResponseDTO usuario, String token) {}

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody CadastroRequestDTO dto) {
        try {
            Usuario salvo = authService.cadastrarUsuario(dto);
            return ResponseEntity.ok(UsuarioResponseDTO.from(salvo));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        try {
            var authenticationToken = new UsernamePasswordAuthenticationToken(credenciais.get("email"), credenciais.get("senha"));
            var authentication = authenticationManager.authenticate(authenticationToken);

            var usuario = (Usuario) authentication.getPrincipal();
            var tokenJWT = tokenService.gerarToken(usuario);

            return ResponseEntity.ok(new LoginResponseDTO(UsuarioResponseDTO.from(usuario), tokenJWT));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Credenciais inválidas");
        }
    }
}

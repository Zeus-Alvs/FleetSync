package com.fatec.fleetsync.controller;

import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fatec.fleetsync.dto.UsuarioResponseDTO;
import com.fatec.fleetsync.model.Usuario;
import com.fatec.fleetsync.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodos() {
        List<UsuarioResponseDTO> usuarios = usuarioRepository.findAll().stream()
                .map(UsuarioResponseDTO::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(usuarios);
    }

    @PatchMapping("/me/endereco")
    public ResponseEntity<?> atualizarEndereco(@AuthenticationPrincipal Usuario usuarioLogado, @RequestBody Map<String, String> body) {
        String novoEndereco = body.get("enderecoSede");
        if (novoEndereco == null || novoEndereco.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Endereço inválido");
        }
        usuarioLogado.setEnderecoSede(novoEndereco);
        Usuario salvo = usuarioRepository.save(usuarioLogado);
        return ResponseEntity.ok(UsuarioResponseDTO.from(salvo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

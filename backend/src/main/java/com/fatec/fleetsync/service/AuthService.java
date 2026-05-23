package com.fatec.fleetsync.service;

import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fatec.fleetsync.model.Usuario;
import com.fatec.fleetsync.repository.UsuarioRepository;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario cadastrarUsuario(Usuario novoUsuario) {
        Optional<Usuario> existente = usuarioRepository.findByEmail(novoUsuario.getEmail());
        if (existente.isPresent()) {
            throw new RuntimeException("E-mail já cadastrado no sistema.");
        }
        
        String senhaHash = BCrypt.hashpw(novoUsuario.getSenha(), BCrypt.gensalt());
        novoUsuario.setSenha(senhaHash);
        
        return usuarioRepository.save(novoUsuario);
    }

    public Usuario autenticar(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (!BCrypt.checkpw(senha, usuario.getSenha())) {
            throw new RuntimeException("Senha incorreta.");
        }

        return usuario;
    }
}
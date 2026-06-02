package com.fatec.fleetsync.service;

import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.fatec.fleetsync.model.Usuario;
import com.fatec.fleetsync.repository.UsuarioRepository;
import com.fatec.fleetsync.dto.CadastroRequestDTO;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario cadastrarUsuario(CadastroRequestDTO dto) {
        Optional<Usuario> existente = usuarioRepository.findByEmail(dto.email());
        if (existente.isPresent()) {
            throw new RuntimeException("E-mail já cadastrado no sistema.");
        }
        
        Usuario novoUsuario = new Usuario(
                dto.nome(),
                dto.email(),
                passwordEncoder.encode(dto.senha()),
                dto.documento(),
                dto.telefone(),
                dto.enderecoSede(),
                dto.perfil()
        );
        
        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        return usuarioSalvo;
    }
}
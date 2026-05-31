package com.fatec.fleetsync.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fatec.fleetsync.model.Usuario;
import com.fatec.fleetsync.model.Motorista;
import com.fatec.fleetsync.model.enums.PerfilUsuario;
import com.fatec.fleetsync.dto.CadastroRequestDTO;
import com.fatec.fleetsync.repository.UsuarioRepository;
import com.fatec.fleetsync.repository.MotoristaRepository;
@Service
public class AuthService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private MotoristaRepository motoristaRepository;
    public Usuario cadastrarUsuario(CadastroRequestDTO dto) {

        if (usuarioRepository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("Este e-mail já está em uso.");
        }

        Usuario novoUsuario = new Usuario(
                dto.nome(),
                dto.email(),
                dto.senha(), 
                dto.documento(),
                dto.telefone(),
                dto.perfil());
        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        if (dto.perfil() == PerfilUsuario.MOTORISTA) {
            Motorista perfilMotorista = new Motorista();
            perfilMotorista.setNome(dto.nome());

            perfilMotorista.setCnh("PENDENTE-" + dto.documento());
            perfilMotorista.setDisponivel(false); 
            perfilMotorista.setAvaliacao(5.0); 

            perfilMotorista.setLatitudeAtual(-24.0058);
            perfilMotorista.setLongitudeAtual(-46.4127);
            motoristaRepository.save(perfilMotorista);
        }
        return usuarioSalvo;
    }

    public Usuario autenticar(String email, String senha) {

        return new Usuario();
    }
}
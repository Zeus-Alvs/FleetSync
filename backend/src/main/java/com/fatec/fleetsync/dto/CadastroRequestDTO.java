package com.fatec.fleetsync.dto;
import com.fatec.fleetsync.model.enums.PerfilUsuario;
public record CadastroRequestDTO(
    String nome, 
    String email, 
    String senha, 
    String documento, 
    String telefone, 
    String enderecoSede,
    PerfilUsuario perfil
) {}
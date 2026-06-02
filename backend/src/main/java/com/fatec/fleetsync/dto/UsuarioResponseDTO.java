package com.fatec.fleetsync.dto;

import com.fatec.fleetsync.model.Usuario;

public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String perfil;
    private String enderecoSede;
    private String documento;
    private String telefone;

    public static UsuarioResponseDTO from(Usuario u) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.id     = u.getId();
        dto.nome   = u.getNome();
        dto.email  = u.getEmail();
        dto.perfil = u.getPerfil().name();
        dto.enderecoSede = u.getEnderecoSede();
        dto.documento = u.getDocumento();
        dto.telefone = u.getTelefone();
        return dto;
    }

    public Long getId()      { return id; }
    public String getNome()  { return nome; }
    public String getEmail() { return email; }
    public String getPerfil(){ return perfil; }
    public String getEnderecoSede() { return enderecoSede; }
    public String getDocumento() { return documento; }
    public String getTelefone() { return telefone; }
}

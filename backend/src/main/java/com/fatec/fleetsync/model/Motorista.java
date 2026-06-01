package com.fatec.fleetsync.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_motoristas")
public class Motorista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String cnh;

    @Column(nullable = false)
    private Boolean disponivel = true;

    @Column(nullable = false)
    private Double avaliacao;

    @Column(nullable = false)
    private Double latitudeAtual;

    @Column(nullable = false)
    private Double longitudeAtual;

    @OneToOne
    @JoinColumn(name = "veiculo_id", unique = true)
    private Veiculo veiculo;

    public Motorista() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCnh() { return cnh; }
    public void setCnh(String cnh) { this.cnh = cnh; }

    public Boolean getDisponivel() { return disponivel; }
    public void setDisponivel(Boolean disponivel) { this.disponivel = disponivel; }

    public Double getAvaliacao() { return avaliacao; }
    public void setAvaliacao(Double avaliacao) { this.avaliacao = avaliacao; }

    public Double getLatitudeAtual() { return latitudeAtual; }
    public void setLatitudeAtual(Double latitudeAtual) { this.latitudeAtual = latitudeAtual; }

    public Double getLongitudeAtual() { return longitudeAtual; }
    public void setLongitudeAtual(Double longitudeAtual) { this.longitudeAtual = longitudeAtual; }

    public Veiculo getVeiculo() { return veiculo; }
    public void setVeiculo(Veiculo veiculo) { this.veiculo = veiculo; }
}   
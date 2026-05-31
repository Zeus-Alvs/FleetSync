package com.fatec.fleetsync.model;
import com.fatec.fleetsync.model.enums.TipoVeiculo;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity
@Table(name = "tb_veiculos")
public class Veiculo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false, length = 7)
    private String placa;
    @Column(nullable = false)
    private Double capacidadeCarga;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoVeiculo tipoVeiculo;
    @Column(nullable = false)
    private Boolean emUso = false;
    public Veiculo() {}
    public Veiculo(String placa, Double capacidadeCarga, TipoVeiculo tipoVeiculo) {
        this.placa = placa;
        this.capacidadeCarga = capacidadeCarga;
        this.tipoVeiculo = tipoVeiculo;
        this.emUso = false;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPlaca() { return placa; }
    public void setPlaca(String placa) { this.placa = placa; }
    public Double getCapacidadeCarga() { return capacidadeCarga; }
    public void setCapacidadeCarga(Double capacidadeCarga) { this.capacidadeCarga = capacidadeCarga; }
    public TipoVeiculo getTipoVeiculo() { return tipoVeiculo; }
    public void setTipoVeiculo(TipoVeiculo tipoVeiculo) { this.tipoVeiculo = tipoVeiculo; }
    public Boolean getEmUso() { return emUso; }
    public void setEmUso(Boolean emUso) { this.emUso = emUso; }
}
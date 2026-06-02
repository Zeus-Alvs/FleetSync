package com.fatec.fleetsync.model;

import java.time.LocalDateTime;

import com.fatec.fleetsync.model.enums.StatusMatch;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import jakarta.persistence.Table;

@Entity
@Table(name = "tb_matches")
public class MatchEntrega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;



    @ManyToOne
    @JoinColumn(name = "transportadora_id", nullable = false)
    private Transportadora transportadora;

    @Column(nullable = false)
    private Integer scoreCompatibilidade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusMatch statusMatch = StatusMatch.SUGERIDO;

    @Column(nullable = false)
    private LocalDateTime dataGeracao = LocalDateTime.now();

    public MatchEntrega() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }



    public Transportadora getTransportadora() { return transportadora; }
    public void setTransportadora(Transportadora transportadora) { this.transportadora = transportadora; }

    public Integer getScoreCompatibilidade() { return scoreCompatibilidade; }
    public void setScoreCompatibilidade(Integer scoreCompatibilidade) { this.scoreCompatibilidade = scoreCompatibilidade; }

    public StatusMatch getStatusMatch() { return statusMatch; }
    public void setStatusMatch(StatusMatch statusMatch) { this.statusMatch = statusMatch; }

    public LocalDateTime getDataGeracao() { return dataGeracao; }
    public void setDataGeracao(LocalDateTime dataGeracao) { this.dataGeracao = dataGeracao; }
}
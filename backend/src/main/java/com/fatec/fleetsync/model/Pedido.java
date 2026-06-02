package com.fatec.fleetsync.model;

import com.fatec.fleetsync.model.enums.CidadeBaixada;
import com.fatec.fleetsync.model.enums.NivelUrgencia;
import com.fatec.fleetsync.model.enums.StatusPedido;

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

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tb_pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cliente;

    @Column(nullable = false)
    private String enderecoColeta;

    @Column(nullable = false)
    private String enderecoEntrega;

    @Enumerated(EnumType.STRING)
    @Column
    private CidadeBaixada cidade;

    @Column(nullable = false)
    private Double pesoCarga;

    @Column(nullable = false)
    private Double latitudeColeta;

    @Column(nullable = false)
    private Double longitudeColeta;

    @Column(nullable = false)
    private Double latitudeDestino;

    @Column(nullable = false)
    private Double longitudeDestino;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NivelUrgencia nivelUrgencia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido statusPedido = StatusPedido.PENDENTE;

    @ManyToOne
    @JoinColumn(name = "transportadora_id")
    private Transportadora transportadora; // Alocado após o Match

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @JsonIgnore
    private Usuario usuario; // Dono do pedido

    public Pedido() {}

    public Long getId()                             { return id; }
    public void setId(Long id)                      { this.id = id; }
    public String getCliente()                      { return cliente; }
    public void setCliente(String cliente)          { this.cliente = cliente; }
    public String getEnderecoColeta()               { return enderecoColeta; }
    public void setEnderecoColeta(String c)         { this.enderecoColeta = c; }
    public String getEnderecoEntrega()              { return enderecoEntrega; }
    public void setEnderecoEntrega(String e)        { this.enderecoEntrega = e; }
    public CidadeBaixada getCidade()                { return cidade; }
    public void setCidade(CidadeBaixada cidade)     { this.cidade = cidade; }
    public Double getPesoCarga()                    { return pesoCarga; }
    public void setPesoCarga(Double p)              { this.pesoCarga = p; }
    public Double getLatitudeColeta()               { return latitudeColeta; }
    public void setLatitudeColeta(Double lat)       { this.latitudeColeta = lat; }
    public Double getLongitudeColeta()              { return longitudeColeta; }
    public void setLongitudeColeta(Double lon)      { this.longitudeColeta = lon; }
    public Double getLatitudeDestino()              { return latitudeDestino; }
    public void setLatitudeDestino(Double lat)      { this.latitudeDestino = lat; }
    public Double getLongitudeDestino()             { return longitudeDestino; }
    public void setLongitudeDestino(Double lon)     { this.longitudeDestino = lon; }
    public NivelUrgencia getNivelUrgencia()         { return nivelUrgencia; }
    public void setNivelUrgencia(NivelUrgencia n)   { this.nivelUrgencia = n; }
    public StatusPedido getStatusPedido()           { return statusPedido; }
    public void setStatusPedido(StatusPedido s)     { this.statusPedido = s; }
    public Transportadora getTransportadora()                 { return transportadora; }
    public void setTransportadora(Transportadora transportadora)   { this.transportadora = transportadora; }
    public Usuario getUsuario()                     { return usuario; }
    public void setUsuario(Usuario usuario)         { this.usuario = usuario; }
}

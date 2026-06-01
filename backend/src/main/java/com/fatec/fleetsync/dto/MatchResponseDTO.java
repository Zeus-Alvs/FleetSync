package com.fatec.fleetsync.dto;

import com.fatec.fleetsync.model.MatchEntrega;

public class MatchResponseDTO {

    private Long matchId;
    private MotoristaSummary motorista;
    private VeiculoSummary veiculo;
    private Integer scoreCompatibilidade;
    private Double distanciaKm;
    private String statusMatch;

    public static MatchResponseDTO from(MatchEntrega me, double distanciaKm) {
        MatchResponseDTO dto = new MatchResponseDTO();
        dto.matchId = me.getId();
        dto.scoreCompatibilidade = me.getScoreCompatibilidade();
        dto.distanciaKm = distanciaKm;
        dto.statusMatch = me.getStatusMatch().name();

        MotoristaSummary ms = new MotoristaSummary();
        ms.id        = me.getMotorista().getId();
        ms.nome      = me.getMotorista().getNome();
        ms.avaliacao = me.getMotorista().getAvaliacao();
        dto.motorista = ms;

        VeiculoSummary vs = new VeiculoSummary();
        vs.id              = me.getVeiculo().getId();
        vs.placa           = me.getVeiculo().getPlaca();
        vs.tipoVeiculo     = me.getVeiculo().getTipoVeiculo().name();
        vs.capacidadeCarga = me.getVeiculo().getCapacidadeCarga();
        dto.veiculo = vs;

        return dto;
    }

    public static class MotoristaSummary {
        public Long id;
        public String nome;
        public Double avaliacao;
    }

    public static class VeiculoSummary {
        public Long id;
        public String placa;
        public String tipoVeiculo;
        public Double capacidadeCarga;
    }

    public Long getMatchId()                { return matchId; }
    public MotoristaSummary getMotorista()  { return motorista; }
    public VeiculoSummary getVeiculo()      { return veiculo; }
    public Integer getScoreCompatibilidade(){ return scoreCompatibilidade; }
    public Double getDistanciaKm()          { return distanciaKm; }
    public String getStatusMatch()          { return statusMatch; }
}

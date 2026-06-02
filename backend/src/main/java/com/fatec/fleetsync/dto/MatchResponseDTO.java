package com.fatec.fleetsync.dto;

import com.fatec.fleetsync.model.MatchEntrega;

public class MatchResponseDTO {

    private Long matchId;
    private TransportadoraSummary transportadora;
    private Integer scoreCompatibilidade;
    private Double distanciaKm;
    private String statusMatch;

    public static MatchResponseDTO from(MatchEntrega me, double distanciaKm) {
        MatchResponseDTO dto = new MatchResponseDTO();
        dto.matchId = me.getId();
        dto.scoreCompatibilidade = me.getScoreCompatibilidade();
        dto.distanciaKm = distanciaKm;
        dto.statusMatch = me.getStatusMatch().name();



        TransportadoraSummary ts = new TransportadoraSummary();
        ts.id              = me.getTransportadora().getId();
        ts.nomeEmpresa     = me.getTransportadora().getNomeEmpresa();
        ts.capacidade      = me.getTransportadora().getCapacidade();
        ts.latitude        = me.getTransportadora().getLatitude();
        ts.longitude       = me.getTransportadora().getLongitude();
        dto.transportadora = ts;

        return dto;
    }



    public static class TransportadoraSummary {
        public Long id;
        public String nomeEmpresa;
        public Double capacidade;
        public Double latitude;
        public Double longitude;
    }

    public Long getMatchId()                { return matchId; }
    public TransportadoraSummary getTransportadora() { return transportadora; }
    public Integer getScoreCompatibilidade(){ return scoreCompatibilidade; }
    public Double getDistanciaKm()          { return distanciaKm; }
    public String getStatusMatch()          { return statusMatch; }
}

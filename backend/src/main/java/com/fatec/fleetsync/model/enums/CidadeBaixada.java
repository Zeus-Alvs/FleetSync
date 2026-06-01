package com.fatec.fleetsync.model.enums;

public enum CidadeBaixada {

    SANTOS("Santos"),
    SAO_VICENTE("São Vicente"),
    PRAIA_GRANDE("Praia Grande"),
    CUBATAO("Cubatão");

    private final String descricao;

    CidadeBaixada(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}

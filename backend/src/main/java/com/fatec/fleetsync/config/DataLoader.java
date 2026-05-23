package com.fatec.fleetsync.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner; 
import org.springframework.stereotype.Component;

import com.fatec.fleetsync.model.Motorista;
import com.fatec.fleetsync.model.Veiculo;
import com.fatec.fleetsync.model.enums.TipoVeiculo;
import com.fatec.fleetsync.repository.MotoristaRepository;
import com.fatec.fleetsync.repository.VeiculoRepository;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Autowired
    private MotoristaRepository motoristaRepository;

    @Override
    public void run(String... args) throws Exception {

        if (veiculoRepository.count() == 0 && motoristaRepository.count() == 0) {
            System.out.println("====== INICIANDO SIMULAÇÃO GEOGRÁFICA (BAIXADA SANTISTA) ======");

            Veiculo v1 = new Veiculo();
            v1.setPlaca("ABC1234");
            v1.setTipoVeiculo(TipoVeiculo.MOTO);
            v1.setCapacidadeCarga(25.0); 
            v1.setEmUso(false);

            Veiculo v2 = new Veiculo();
            v2.setPlaca("FI02026");
            v2.setTipoVeiculo(TipoVeiculo.FIORINO);
            v2.setCapacidadeCarga(650.0); 
            v2.setEmUso(false);

            Veiculo v3 = new Veiculo();
            v3.setPlaca("VAN5555");
            v3.setTipoVeiculo(TipoVeiculo.VAN);
            v3.setCapacidadeCarga(1200.0); 
            v3.setEmUso(false);

            Veiculo v4 = new Veiculo();
            v4.setPlaca("CAM7777");
            v4.setTipoVeiculo(TipoVeiculo.CAMINHAO);
            v4.setCapacidadeCarga(8000.0); 
            v4.setEmUso(false);

            veiculoRepository.saveAll(Arrays.asList(v1, v2, v3, v4));

            
            Motorista m1 = new Motorista();
            m1.setNome("Carlos Santos Express");
            m1.setCnh("11111111111");
            m1.setDisponivel(true);
            m1.setAvaliacao(4.8);
            m1.setLatitudeAtual(-23.9608);
            m1.setLongitudeAtual(-46.3339);
            m1.setVeiculo(v1); 

            Motorista m2 = new Motorista();
            m2.setNome("Marcos Silva Log");
            m2.setCnh("22222222222");
            m2.setDisponivel(true);
            m2.setAvaliacao(4.5);
            m2.setLatitudeAtual(-23.9631);
            m2.setLongitudeAtual(-46.3919);
            m2.setVeiculo(v2); 

            Motorista m3 = new Motorista();
            m3.setNome("Rogério PG Entregas");
            m3.setCnh("33333333333");
            m3.setDisponivel(true);
            m3.setAvaliacao(4.9);
            m3.setLatitudeAtual(-24.0058);
            m3.setLongitudeAtual(-46.4127);
            m3.setVeiculo(v3);

            Motorista m4 = new Motorista();
            m4.setNome("Antônio Pesados Cubatão");
            m4.setCnh("44444444444");
            m4.setDisponivel(true);
            m4.setAvaliacao(4.2);
            m4.setLatitudeAtual(-23.8950);
            m4.setLongitudeAtual(-46.4250);
            m4.setVeiculo(v4);

            motoristaRepository.saveAll(Arrays.asList(m1, m2, m3, m4));

            System.out.println("====== BANCO DE DADOS POPULADO COM SUCESSO ======");
        }
    }
}
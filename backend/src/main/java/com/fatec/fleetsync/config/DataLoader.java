package com.fatec.fleetsync.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.fatec.fleetsync.model.Motorista;
import com.fatec.fleetsync.model.Pedido;
import com.fatec.fleetsync.model.Veiculo;
import com.fatec.fleetsync.model.enums.CidadeBaixada;
import com.fatec.fleetsync.model.enums.NivelUrgencia;
import com.fatec.fleetsync.model.enums.TipoVeiculo;
import com.fatec.fleetsync.repository.MotoristaRepository;
import com.fatec.fleetsync.repository.PedidoRepository;
import com.fatec.fleetsync.repository.VeiculoRepository;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired private VeiculoRepository   veiculoRepository;
    @Autowired private MotoristaRepository motoristaRepository;
    @Autowired private PedidoRepository    pedidoRepository;

    @Override
    public void run(String... args) throws Exception {

        if (veiculoRepository.count() == 0 && motoristaRepository.count() == 0) {
            System.out.println("====== INICIANDO SIMULAÇÃO GEOGRÁFICA (BAIXADA SANTISTA) ======");

            Veiculo v1 = new Veiculo("ABC1234", 25.0,   TipoVeiculo.MOTO);
            Veiculo v2 = new Veiculo("FIO2026", 650.0,  TipoVeiculo.FIORINO);
            Veiculo v3 = new Veiculo("VAN5555", 1200.0, TipoVeiculo.VAN);
            Veiculo v4 = new Veiculo("CAM7777", 8000.0, TipoVeiculo.CAMINHAO);
            veiculoRepository.saveAll(Arrays.asList(v1, v2, v3, v4));

            Motorista m1 = buildMotorista("Carlos Santos Express",  "11111111111", 4.8, -23.9608, -46.3339, v1);
            Motorista m2 = buildMotorista("Marcos Silva Log",        "22222222222", 4.5, -23.9631, -46.3919, v2);
            Motorista m3 = buildMotorista("Rogério PG Entregas",     "33333333333", 4.9, -24.0058, -46.4127, v3);
            Motorista m4 = buildMotorista("Antônio Pesados Cubatão", "44444444444", 4.2, -23.8950, -46.4250, v4);
            motoristaRepository.saveAll(Arrays.asList(m1, m2, m3, m4));

            System.out.println("====== MOTORISTAS E VEÍCULOS POPULADOS ======");
        }

        if (pedidoRepository.count() == 0) {
            Pedido p1 = buildPedido("Supermercado Pão de Açúcar",
                "Av. Ana Costa, 123 - Santos", CidadeBaixada.SANTOS,
                20.0, -23.9618, -46.3322, NivelUrgencia.ALTO);

            Pedido p2 = buildPedido("Farmácia Drogasil",
                "Av. Presidente Kennedy, 500 - Praia Grande", CidadeBaixada.PRAIA_GRANDE,
                8.0, -24.0050, -46.4020, NivelUrgencia.CRITICO);

            Pedido p3 = buildPedido("Indústria Química Cubatão",
                "Rua Industrial, 80 - Cubatão", CidadeBaixada.CUBATAO,
                4500.0, -23.8940, -46.4200, NivelUrgencia.MEDIO);

            Pedido p4 = buildPedido("Construtora São Vicente",
                "Rua Frei Gaspar, 200 - São Vicente", CidadeBaixada.SAO_VICENTE,
                600.0, -23.9640, -46.3900, NivelUrgencia.BAIXO);

            pedidoRepository.saveAll(Arrays.asList(p1, p2, p3, p4));
            System.out.println("====== PEDIDOS DE EXEMPLO POPULADOS ======");
        }
    }

    private Motorista buildMotorista(String nome, String cnh, double aval,
                                     double lat, double lon, Veiculo veiculo) {
        Motorista m = new Motorista();
        m.setNome(nome); m.setCnh(cnh); m.setDisponivel(true);
        m.setAvaliacao(aval); m.setLatitudeAtual(lat); m.setLongitudeAtual(lon);
        m.setVeiculo(veiculo);
        return m;
    }

    private Pedido buildPedido(String cliente, String endereco, CidadeBaixada cidade,
                                double peso, double lat, double lon, NivelUrgencia urgencia) {
        Pedido p = new Pedido();
        p.setCliente(cliente); p.setEnderecoEntrega(endereco); p.setCidade(cidade);
        p.setPesoCarga(peso);  p.setLatitudeDestino(lat);      p.setLongitudeDestino(lon);
        p.setNivelUrgencia(urgencia);
        return p;
    }
}

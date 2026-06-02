package com.fatec.fleetsync.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.fatec.fleetsync.model.Transportadora;
import com.fatec.fleetsync.model.Usuario;
import com.fatec.fleetsync.model.enums.PerfilUsuario;
import com.fatec.fleetsync.repository.TransportadoraRepository;
import com.fatec.fleetsync.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private TransportadoraRepository transportadoraRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        if (usuarioRepository.findByEmail("admin@fleetsync.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador Master");
            admin.setEmail("admin@fleetsync.com");
            admin.setSenha(passwordEncoder.encode("senha123"));
            admin.setPerfil(PerfilUsuario.ADMIN);
            admin.setDocumento("00000000000");
            admin.setTelefone("00000000000");
            
            usuarioRepository.save(admin);
            System.out.println("====== USUÁRIO ADMIN PADRÃO CRIADO ======");
        }

        if (transportadoraRepository.count() == 0) {
            System.out.println("====== INICIANDO POPULAÇÃO DE FROTAS B2B (BAIXADA SANTISTA) ======");

            // === SANTOS ===
            transportadoraRepository.save(new Transportadora("JSL Logística Santos", "11.222.333/0001-44", "13 3222-1111", "santos@jsl.com.br", "Av. Brasil, 100, Santos", -23.9535, -46.3350, 15000.0));
            transportadoraRepository.save(new Transportadora("Santos Cargas Express", "11.222.333/0002-44", "13 3222-2222", "contato@santoscargas.com", "Rua General Câmara, 200, Santos", -23.9856, -46.3015, 8000.0)); // Ponta da Praia
            transportadoraRepository.save(new Transportadora("Porto Log", "11.222.333/0003-44", "13 3222-3333", "operacao@portolog.com", "Av. Ana Costa, 500, Santos", -23.9372, -46.3682, 12000.0)); // Zona Noroeste

            // === SÃO VICENTE ===
            transportadoraRepository.save(new Transportadora("São Vicente Log", "22.333.444/0001-55", "13 3467-1111", "sv@svlog.com", "Av. Presidente Wilson, 150, São Vicente", -23.9631, -46.3919, 5000.0));
            transportadoraRepository.save(new Transportadora("Expresso Calunga", "22.333.444/0002-55", "13 3467-2222", "contato@expressocalunga.com", "Rua Frei Gaspar, 300, São Vicente", -23.9650, -46.3880, 6500.0)); // Ajustado (era no mar)
            transportadoraRepository.save(new Transportadora("Biquinha Transportes", "22.333.444/0003-55", "13 3467-3333", "frota@biquinha.com", "Av. Antonio Emmerich, 1000, São Vicente", -23.9550, -46.4682, 4500.0)); // Área Continental

            // === PRAIA GRANDE ===
            transportadoraRepository.save(new Transportadora("DHL Supply Chain PG", "33.444.555/0001-66", "13 3491-1111", "pg.brasil@dhl.com", "Av. Presidente Castelo Branco, 100, Praia Grande", -24.0093, -46.3980, 20000.0)); // Canto do Forte
            transportadoraRepository.save(new Transportadora("Litoral Sul Cargas", "33.444.555/0002-66", "13 3491-2222", "log@litoralsul.com", "Av. Costa e Silva, 500, Praia Grande", -24.0150, -46.4250, 7000.0)); // Ajustado (era no mar)
            transportadoraRepository.save(new Transportadora("PG Logística", "33.444.555/0003-66", "13 3491-3333", "atendimento@pglog.com", "Rua do Comércio, 50, Praia Grande", -24.0050, -46.4350, 9000.0)); // Ajustado (era no mar)

            // === GUARUJÁ ===
            transportadoraRepository.save(new Transportadora("Pérola do Atlântico Log", "44.555.666/0001-77", "13 3386-1111", "guaruja@perolalog.com", "Av. Adhemar de Barros, 200, Guarujá", -23.9934, -46.2564, 11000.0));
            transportadoraRepository.save(new Transportadora("Enseada Express", "44.555.666/0002-77", "13 3386-2222", "enseada@enseadaexpress.com", "Av. Dom Pedro I, 800, Guarujá", -23.9482, -46.1824, 5500.0)); // Praia de Pernambuco
            transportadoraRepository.save(new Transportadora("Vicente de Carvalho Cargas", "44.555.666/0003-77", "13 3386-3333", "vicente@vccargas.com", "Av. Thiago Ferreira, 150, Guarujá", -23.9550, -46.2900, 7500.0)); // Ajustado (era no mar)

            // === CUBATÃO ===
            transportadoraRepository.save(new Transportadora("Braspress Baixada", "55.666.777/0001-88", "13 3361-1111", "cubatao@braspress.com.br", "Rodovia Anchieta, Km 60, Cubatão", -23.8824, -46.4253, 25000.0));
            transportadoraRepository.save(new Transportadora("Polo Industrial Trans", "55.666.777/0002-88", "13 3361-2222", "polo@polotrans.com", "Av. Nove de Abril, 2000, Cubatão", -23.9216, -46.3820, 18000.0)); // Casqueiro
            transportadoraRepository.save(new Transportadora("Cubatão Logística", "55.666.777/0003-88", "13 3361-3333", "contato@cubataolog.com", "Rodovia Cônego Domênico Rangoni, Km 260, Cubatão", -23.8550, -46.3650, 22000.0)); // Fabrica Piaçaguera

            // === MONGAGUÁ ===
            transportadoraRepository.save(new Transportadora("Mongaguá Fretes", "66.777.888/0001-99", "13 3448-1111", "contato@mongaguafretes.com", "Av. Monteiro Lobato, 300, Mongaguá", -24.0934, -46.6202, 3000.0)); // Centro
            transportadoraRepository.save(new Transportadora("Praia Cargas", "66.777.888/0002-99", "13 3448-2222", "praia@praiacargas.com", "Av. Governador Mario Covas, 100, Mongaguá", -24.0722, -46.5861, 4500.0)); // Vera Cruz
            transportadoraRepository.save(new Transportadora("Agenor de Campos Log", "66.777.888/0003-99", "13 3448-3333", "agenor@agenorlog.com", "Av. Nossa Senhora de Fátima, 50, Mongaguá", -24.1105, -46.6582, 3500.0)); // Florida Mirim

            // === ITANHAÉM ===
            transportadoraRepository.save(new Transportadora("Itanhaém Transportes", "77.888.999/0001-00", "13 3422-1111", "ita@itanhaemtrans.com", "Rua João Mariano, 100, Itanhaém", -24.1834, -46.7865, 5000.0));
            transportadoraRepository.save(new Transportadora("Camaçari Express", "77.888.999/0002-00", "13 3422-2222", "camacari@express.com", "Av. Harry Forssell, 500, Itanhaém", -24.1780, -46.7800, 6000.0)); // Ajustado (era no mar)
            transportadoraRepository.save(new Transportadora("Suarão Log", "77.888.999/0003-00", "13 3422-3333", "suarao@suaraolog.com", "Av. Padre Teodoro Ratisbone, 200, Itanhaém", -24.1650, -46.7600, 4000.0)); // Suarão

            // === PERUÍBE ===
            transportadoraRepository.save(new Transportadora("Peruíbe Logística", "88.999.000/0001-11", "13 3455-1111", "peruibe@peruibelog.com", "Av. Padre Anchieta, 1500, Peruíbe", -24.3204, -46.9996, 4500.0)); // Centro
            transportadoraRepository.save(new Transportadora("Guaraú Express", "88.999.000/0002-11", "13 3455-2222", "guarau@guarauexpress.com", "Av. Governador Mario Covas, 2000, Peruíbe", -24.3400, -47.0150, 3500.0)); // Guaraú Extremo
            transportadoraRepository.save(new Transportadora("Ruínas Cargas", "88.999.000/0003-11", "13 3455-3333", "ruinas@ruinascargas.com", "Rua Riachuelo, 50, Peruíbe", -24.2694, -46.9416, 5000.0)); // Arpoador / Oásis

            // === BERTIOGA ===
            transportadoraRepository.save(new Transportadora("Bertioga Transportes", "99.000.111/0001-22", "13 3317-1111", "bertioga@bertiogatrans.com", "Av. Anchieta, 300, Bertioga", -23.8542, -46.1388, 6000.0)); // Centro
            transportadoraRepository.save(new Transportadora("Riviera Log", "99.000.111/0002-22", "13 3317-2222", "riviera@rivieralog.com", "Av. Marginal, 100, Bertioga", -23.8050, -46.0350, 8000.0)); // Riviera
            transportadoraRepository.save(new Transportadora("Maitinga Express", "99.000.111/0003-22", "13 3317-3333", "maitinga@maitinga.com", "Rua João Ramalho, 500, Bertioga", -23.8400, -46.1350, 5000.0)); // Ajustado (era no mar)

            System.out.println("====== POPULAÇÃO DE TRANSPORTADORAS CONCLUÍDA ======");
        }
    }
}
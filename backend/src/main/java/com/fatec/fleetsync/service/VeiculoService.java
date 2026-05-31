package com.fatec.fleetsync.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fatec.fleetsync.model.Veiculo;
import com.fatec.fleetsync.repository.VeiculoRepository;
@Service
public class VeiculoService {
    @Autowired
    private VeiculoRepository veiculoRepository;
    public Veiculo cadastrarVeiculo(Veiculo veiculo) {
        veiculo.setEmUso(false);
        return veiculoRepository.save(veiculo);
    }
    public List<Veiculo> listarTodos() {
        return veiculoRepository.findAll();
    }
}
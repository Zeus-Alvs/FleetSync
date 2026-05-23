Markdown
# FleetSync - Fullstack

Plataforma inteligente de alocação e matchmaking logístico (estilo "Tinder" Operacional), desenvolvida em React e Spring Boot.

## 🛠️ Stack Tecnológica
* **Frontend:** React + Vite, Tailwind CSS
* **Backend:** Java 17, Spring Boot 3.x, Hibernate
* **Banco de Dados:** PostgreSQL

---

## 🔐 Configuração das Variáveis de Ambiente (.env)

Para garantir a segurança das credenciais e facilitar a configuração em diferentes máquinas, o projeto utiliza arquivos `.env` (que são ignorados pelo Git). Antes de rodar o projeto, configure-os localmente:

### 1. Configurando o .env do Backend
Na raiz da pasta `backend/`, crie um arquivo chamado exatamente `.env` e adicione a senha do seu PostgreSQL local:
```env
DB_PASSWORD=sua_senha_aqui
(Certifique-se de que o arquivo application.properties está configurado para ler essa variável, utilizando: spring.datasource.password=${DB_PASSWORD}).

2. Configurando o .env do Frontend
Na raiz da pasta `frontend/`, crie um arquivo chamado `.env` e aponte para a URL da nossa API:

Snippet de código
VITE_API_URL=http://localhost:8080

⚙️ Como Executar o Backend (API)
Crie um banco de dados vazio no seu PostgreSQL chamado fleetsync_db.

Abra o terminal na pasta backend e rode o comando:

Bash
mvn spring-boot:run
O servidor iniciará em http://localhost:8080.

Nota: Ao rodar com o banco vazio, o sistema injetará automaticamente motoristas fictícios na Baixada Santista para testes via DataLoader.java.

💻 Como Executar o Frontend (React)
Abra um novo terminal e navegue até a pasta do projeto React:

Bash
cd frontend
Instale as dependências do Node (necessário apenas na primeira vez):

Bash
npm install
Inicie o servidor de desenvolvimento:

Bash
npm run dev
Acesse a interface no navegador através do link gerado no terminal (geralmente http://localhost:5173).

Estrutura do Repositório (Monorepo)
O projeto deve estar organizado da seguinte forma:

FleetSync/
├── README.md                  # Documentação geral do projeto
├── .vscode/                   # Configurações locais da IDE
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/fatec/fleetsync/
│   │   │   │   ├── config/
│   │   │   │   │   └── DataLoader.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── MatchController.java
│   │   │   │   │   ├── MotoristaController.java
│   │   │   │   │   ├── PedidoController.java
│   │   │   │   │   └── VeiculoController.java
│   │   │   │   ├── model/
│   │   │   │   │   ├── enums/
│   │   │   │   │   │   ├── NivelUrgencia.java
│   │   │   │   │   │   ├── PerfilUsuario.java
│   │   │   │   │   │   ├── StatusMatch.java
│   │   │   │   │   │   ├── StatusPedido.java
│   │   │   │   │   │   └── TipoVeiculo.java
│   │   │   │   │   ├── MatchEntrega.java
│   │   │   │   │   ├── Motorista.java
│   │   │   │   │   ├── Pedido.java
│   │   │   │   │   ├── Usuario.java
│   │   │   │   │   └── Veiculo.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── MatchEntregaRepository.java
│   │   │   │   │   ├── MotoristaRepository.java
│   │   │   │   │   ├── PedidoRepository.java
│   │   │   │   │   ├── UsuarioRepository.java
│   │   │   │   │   └── VeiculoRepository.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── MatchService.java
│   │   │   │   │   ├── MotoristaService.java
│   │   │   │   │   ├── PedidoService.java
│   │   │   │   │   └── VeiculoService.java
│   │   │   │   └── ProjetoApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   ├── .env                   # Variáveis locais do banco (Não commitar!)
│   ├── .gitignore             # Ignora compilados do Java
│   └── pom.xml                # Dependências do Maven
└── frontend/                  # ⚛️ Frontend React (Vite)
    ├── src/                   # Componentes, Telas e integração Axios
    ├── .env                   # Variáveis locais da API (Não commitar!)
    ├── package.json           # Dependências do Node
    └── .gitignore             # Ignora node_modules
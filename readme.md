# FleetSync - Fullstack

Plataforma inteligente de alocação e matchmaking logístico (estilo "Tinder" Operacional), desenvolvida em React e Spring Boot.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- React (Vite)
- Tailwind CSS
- Gerenciador de dependências: NPM

**Backend:**
- Java 17
- Spring Boot 3.x
- Gerenciador de dependências: Maven
- ORM: Hibernate / Spring Data JPA

**Banco de Dados:**
- PostgreSQL

---

## 🚀 Como Rodar o Projeto (Guia Passo a Passo)

Como os arquivos binários, logs, e pacotes instalados (`node_modules`, `target`, `dist`) estão protegidos pelo `.gitignore` de ambas as pastas, seu repositório recém-clonado está "zerado". Siga rigorosamente as etapas abaixo para baixar as dependências e inicializar a aplicação em sua máquina local.

### 1. Requisitos Prévios
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (Versão 18+ recomendada)
- [Java JDK 17](https://adoptium.net/)
- [PostgreSQL](https://www.postgresql.org/) rodando na porta 5432

### 2. Configurando o Banco de Dados
1. Abra seu SGBD (pgAdmin, DBeaver, etc) ou seu terminal SQL.
2. Crie um banco de dados vazio com o exato nome: `fleetsync_db`.
3. Verifique o arquivo `backend/src/main/resources/application.properties`. Por padrão, o projeto clonado utiliza as credenciais:
   - **Username:** `postgres`
   - **Password:** `admin`
   > ⚠️ **Atenção:** Se a senha do seu banco PostgreSQL local for diferente, altere a linha `spring.datasource.password=admin` neste arquivo colocando a sua senha real. Não há necessidade de usar arquivos `.env` caso preencha diretamente neste arquivo de propriedades.

### 3. Executando o Backend (API Spring Boot)
Abra o seu terminal na raiz do projeto clonado e navegue para a pasta do backend:

```bash
cd backend
```

Faça o download das dependências do Maven e inicie o servidor. O projeto inclui um executável local (*Maven Wrapper*), ou seja, você não precisa instalar o Maven na sua máquina se não quiser:

**No Windows:**
```bash
.\mvnw.cmd spring-boot:run
```
*(Se você já possuir o Apache Maven instalado nas variáveis de sistema, basta usar `mvn spring-boot:run`)*

**No Linux/Mac:**
```bash
./mvnw spring-boot:run
```

> **Nota:** Ao rodar o backend pela primeira vez (com o banco vazio), o arquivo utilitário `DataLoader.java` irá popular automaticamente o seu banco de dados com veículos e motoristas fictícios simulando a Baixada Santista. O servidor rodará na porta `8080`. Mantenha este terminal aberto.

### 4. Executando o Frontend (React / Vite)
Abra uma **nova janela de terminal** (não feche o do backend) na raiz do projeto clonado e navegue para a pasta do frontend:

```bash
cd frontend
```

Você precisa baixar todas as dependências da interface listadas no arquivo `package.json`. No seu terminal, execute:

```bash
npm install
```

Após a barra de progresso terminar (pode levar 1 a 2 minutos), inicie o servidor de desenvolvimento do Vite:

```bash
npm run dev
```

A interface da aplicação estará rodando! Acesse no seu navegador preferido o link impresso no console (geralmente `http://localhost:5173`).

---

## 📂 Estrutura do Repositório (Monorepo)

```text
FleetSync/
├── README.md                  # Documentação com passos de execução do projeto
├── backend/                   # ☕ Backend Java (Spring Boot)
│   ├── .gitignore             # Ignora compilados Java (*.class, *.jar), /target e .env
│   ├── mvnw / mvnw.cmd        # Maven Wrapper
│   ├── pom.xml                # Arquivo de dependências do Java
│   └── src/
│       ├── main/java/com/fatec/fleetsync/
│       │   ├── config/
│       │   │   ├── CorsConfig.java
│       │   │   └── DataLoader.java                # Seeder Geográfico
│       │   ├── controller/                        # Endpoints da API REST
│       │   │   ├── AuthController.java
│       │   │   ├── MatchController.java
│       │   │   ├── MotoristaController.java
│       │   │   ├── PedidoController.java
│       │   │   └── VeiculoController.java
│       │   ├── dto/                               # Data Transfer Objects (Segurança)
│       │   │   └── CadastroRequestDTO.java
│       │   ├── model/                             # Entidades de Domínio (JPA)
│       │   │   ├── enums/                         # NivelUrgencia, StatusPedido, etc.
│       │   │   ├── MatchEntrega.java
│       │   │   ├── Motorista.java
│       │   │   ├── Pedido.java
│       │   │   ├── Usuario.java
│       │   │   └── Veiculo.java
│       │   ├── repository/                        # Interfaces do Spring Data JPA
│       │   ├── service/                           # Lógicas de Negócio e Algoritmo
│       │   │   ├── AuthService.java
│       │   │   ├── MatchService.java              # Lógica core (Haversine/Score)
│       │   │   ├── MotoristaService.java
│       │   │   ├── PedidoService.java
│       │   │   └── VeiculoService.java
│       │   └── ProjetoApplication.java
│       └── main/resources/
│           └── application.properties             # Credenciais do Banco
└── frontend/                  # ⚛️ Frontend React (Vite)
    ├── .gitignore             # Ignora pastas de build e dependências pesadas
    ├── package.json           # Scripts de Run e dependências Node
    ├── vite.config.js         # Configurações do empacotador web
    ├── index.html
    └── src/                   # Diretório Raiz do Código React
        ├── assets/            # Imagens SVG e estáticos
        ├── components/        # Componentes Reutilizáveis e Modais
        │   ├── About.jsx, Contact.jsx, Features.jsx
        │   ├── Footer.jsx, Hero.jsx, LoginModal.jsx
        │   ├── Navbar.jsx, Team.jsx
        ├── Cadastro.jsx           # Painel de Formulário de Registro
        ├── dashboard.jsx          # Painel Analítico e Operacional
        ├── FleetSyncMatchmaking.jsx # Interface Rica Estilo "Tinder Logístico"
        ├── App.jsx                # Router e roteador base da aplicação
        ├── main.jsx               # Ponto de Injeção de renderização da DOM
        └── index.css              # Estilos utilitários globais do TailwindCSS
```
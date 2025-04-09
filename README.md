# VINTRA - Visualização INtegrativa TRAjetorial

VINTRA é uma aplicação moderna para análise dimensional clínica, permitindo que profissionais de saúde capturem, transcrevam e analisem sessões com pacientes.

## Sobre o Projeto

VINTRA foi migrado de uma implementação vanilla JavaScript para uma arquitetura moderna com React (frontend) e microserviços backend (Node.js e Python), mantendo suas características visuais e funcionais originais enquanto melhorando sua estrutura, segurança e manutenibilidade.

### Recursos Principais

- **Análise Dimensional**: Visualização de dados clínicos em múltiplas dimensões
- **Gravação de Áudio**: Capture sessões de atendimento diretamente na aplicação
- **Transcrição com IA**: Transforme áudio em texto usando Google Cloud Speech-to-Text
- **Análise com IA**: Processamento utilizando Claude via VertexAI
- **Documentação Clínica**: Geração automática de diversos formatos de documentação
- **Biblioteca de Documentos**: Repositório organizado de documentos por paciente
- **Banco de Dados de Grafos**: Armazenamento de relações clínicas com Neo4j
- **Busca Vetorial**: Busca semântica de casos similares com embeddings

## Arquitetura do Sistema

- **Frontend**: React com Vite, Styled Components, e Recharts
- **Backend Node.js**: Express.js para transcrição de áudio e API principal
- **Backend Python**: FastAPI para análise dimensional VINTRA e integração com bancos de dados especializados
- **Bancos de Dados**: 
  - Neo4j para dados de grafo (relacionamentos entre entidades)
  - Firestore para dados estruturados
  - Vertex AI Vector Search para busca semântica

## Como Iniciar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Python 3.9+
- Docker e Docker Compose (recomendado)

### Instalação com Docker

1. Clone o repositório
   ```bash
   git clone https://github.com/seu-usuario/vintra.git
   cd vintra
   ```

2. Configure as variáveis de ambiente
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

3. Inicie os serviços com Docker Compose
   ```bash
   docker-compose up
   ```

4. Acesse os serviços:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend Node.js: [http://localhost:5000](http://localhost:5000)
   - Backend Python: [http://localhost:8000](http://localhost:8000)
   - Neo4j Browser: [http://localhost:7474](http://localhost:7474)

### Instalação Manual

1. Clone o repositório
   ```bash
   git clone https://github.com/seu-usuario/vintra.git
   cd vintra
   ```

2. Configure as variáveis de ambiente
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

3. Instale todas as dependências
   ```bash
   npm run setup
   ```

4. Inicie os serviços separadamente:
   - Frontend: `npm run dev`
   - Backend Node.js: `npm run dev:node`
   - Backend Python: `npm run dev:python`

### Scripts Disponíveis

- `npm run dev`: Inicia o frontend React
- `npm run dev:node`: Inicia o backend Node.js
- `npm run dev:python`: Inicia o backend Python
- `npm run dev:all`: Inicia todos os serviços via Docker Compose
- `npm run setup`: Instala todas as dependências (frontend e backends)
- `npm run build`: Compila o frontend para produção

## Estrutura do Projeto

```
/vintra/
├── frontend/               # Frontend React (atual diretório raiz)
│   ├── public/
│   ├── src/
│   └── package.json
│
├── backend-node/           # Backend Express.js
│   ├── src/
│   │   ├── api/            # API endpoints
│   │   └── server.js       # Servidor Express
│   └── package.json
│
├── backend-python/         # Backend FastAPI
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── models/         # Modelos Pydantic
│   │   └── services/       # Serviços (Claude, Neo4j, etc.)
│   ├── main.py             # Ponto de entrada FastAPI
│   └── requirements.txt    # Dependências Python
│
├── docker-compose.yml      # Configuração Docker Compose
└── .env.example            # Exemplo de variáveis de ambiente
```

## Acesso à Aplicação

## Funcionalidades Implementadas

- [x] Autenticação básica
- [x] Dashboard com lista de pacientes
- [x] Visualização de detalhes de paciente
- [x] Sistema de modais e notificações toast
- [x] Tema claro/escuro
- [x] Gravação de áudio (frontend)
- [x] Transcrição com Whisper
- [x] Análise dimensional com Claude
- [x] Integração com bancos de dados
- [ ] Visualização dimensional completa
- [ ] Gestão completa de pacientes

## Configuração e Integração de Serviços

### Whisper (Transcrição)
- Implementado via biblioteca @xenova/transformers no backend Node.js
- Pode ser substituído pela versão Python em produção

### Claude (via VertexAI)
- Configurado para análise dimensional no backend Python
- Requer credenciais do Google Cloud

### Neo4j (Banco de Dados de Grafos)
- Armazena relacionamentos entre pacientes, sessões e estados dimensionais
- Configurado via variáveis de ambiente

### Vertex Vector Search (Busca Semântica)
- Implementado para buscar casos clinicamente similares
- Utiliza embeddings gerados a partir das transcrições

## Licença

Este projeto está licenciado sob a licença ISC.
# Guia para Desenvolvedores VINTRA

Este documento fornece informações detalhadas para desenvolvedores que trabalham no projeto VINTRA, incluindo configuração do ambiente, arquitetura do sistema e guias de integração.

## Arquitetura do Sistema

O VINTRA é composto por três componentes principais:

1. **Frontend React**: Interface do usuário construída com React, Vite e Styled Components
2. **Backend Node.js**: Serviço Express para transcrição de áudio e API principal
3. **Backend Python**: Serviço FastAPI para análise dimensional e integração com bancos de dados especializados

### Diagrama de Arquitetura

```
+---------------------+       +---------------------+
|                     |       |                     |
|   Frontend React    +------>+   Backend Node.js   |
|                     |       |                     |
+----------+----------+       +----------+----------+
           |                             |
           |                             |
           v                             v
+---------------------+       +---------------------+
|                     |       |                     |
|     Cliente Web     |       |   Backend Python    |
|                     |       |                     |
+---------------------+       +---------+-----------+
                                        |
                                        |
                              +---------v----------+
                              |                    |
                              | Neo4j & Vertex AI  |
                              |                    |
                              +--------------------+
```

## Configuração do Ambiente de Desenvolvimento

### Configurando Credenciais

1. **Google Cloud / VertexAI**
   - Crie um projeto no Google Cloud: https://console.cloud.google.com/
   - Habilite a API do Vertex AI
   - Crie uma conta de serviço com as seguintes permissões:
     - `roles/aiplatform.user`
     - `roles/storage.objectViewer`
   - Baixe o arquivo JSON de credenciais e salve como `google-credentials.json` na raiz do projeto

2. **Neo4j**
   - Instale o Neo4j Desktop: https://neo4j.com/download/
   - Crie um novo banco de dados local
   - Configure usuário e senha no arquivo `.env`

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example` e configure as seguintes variáveis:

```bash
# Backend Node.js (Express)
PORT=5000
NODE_ENV=development

# Google Cloud / VertexAI
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
VERTEX_AI_LOCATION=us-central1

# Whisper Configuration
WHISPER_MODEL=small
WHISPER_LANGUAGE=portuguese

# API Configuration
API_URL=/api
MAX_AUDIO_SIZE=30
MAX_PROCESSING_TIME=300

# Backend Python (FastAPI)
PYTHON_API_URL=http://localhost:8000

# Neo4j
NEO4J_URI=neo4j://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=yourpassword

# Development Mode
LOCAL_DEVELOPMENT=true
```

## Fluxo de Trabalho para Desenvolvimento

### Gravação e Transcriação de Áudio

1. Usuário grava áudio na interface React
2. Frontend envia o blob de áudio para o backend Node.js (`/api/transcribe`)
3. Backend Node.js processa o áudio com Whisper
4. O resultado da transcrição é retornado ao frontend

### Análise Dimensional VINTRA

1. Frontend envia a transcrição para o backend Node.js (`/api/process`)
2. Backend Node.js pode processar diretamente com Claude ou encaminhar para o backend Python
3. Se encaminhado para o Python, o endpoint `/api/vintra/analisar` é chamado
4. Backend Python:
   - Processa a transcrição com Claude
   - Extrai valores dimensionais
   - Armazena no Firestore
   - Cria nós no Neo4j
   - Gera embeddings para busca vetorial
5. Resultados são retornados ao frontend para visualização

## API Endpoints

### Backend Node.js

- `POST /api/transcribe`: Transcreve áudio usando Whisper
- `POST /api/process`: Processa transcrição para gerar documentos
- `GET /api/status/:id`: Obtém status de processamento
- `GET /api/health`: Verifica saúde do sistema

### Backend Python

- `POST /api/vintra/analisar`: Realiza análise dimensional VINTRA
- `GET /api/vintra/similar/{sessao_id}`: Busca sessões similares
- `POST /api/pacientes/`: Cria novo paciente
- `GET /api/pacientes/{patient_id}`: Obtém dados de um paciente

## Integração com Bancos de Dados

### Neo4j (Banco de Dados de Grafos)

O Neo4j é usado para armazenar e consultar:
- Pacientes (nodes `Patient`)
- Sessões (nodes `Session`)
- Estados dimensionais (nodes `DimensionalState`)
- Relacionamentos entre eles

Exemplo de consulta para encontrar estados dimensionais similares:

```cypher
MATCH (d:DimensionalState)
WITH d, 
     sqrt(
        (d.v1 - $dim.v1)^2 + 
        (d.v2 - $dim.v2)^2 + 
        (d.v3 - $dim.v3)^2
        // ...outros valores dimensionais
     ) as distance
ORDER BY distance ASC
LIMIT 5
MATCH (s:Session)-[:HAS_STATE]->(d)
RETURN d, distance, s.session_id
```

### Firestore (Banco de Dados Documental)

O Firestore é usado para armazenar:
- Dados de pacientes
- Sessões clínicas
- Análises dimensionais
- Configurações do sistema

### Vertex AI Vector Search (Busca Semântica)

Usado para armazenar embeddings vetoriais e realizar busca semântica para:
- Encontrar sessões clinicamente similares
- Realizar pesquisa semântica em transcrições
- Identificar padrões em dados clínicos

## Boas Práticas de Desenvolvimento

1. **Versionamento**
   - Use branches separadas para cada feature
   - Faça commits frequentes e descritivos
   - Use Pull Requests para revisão de código

2. **Estilo de Código**
   - Frontend: Siga o ESLint configurado
   - Backend Node.js: Siga o padrão de módulos ES
   - Backend Python: Siga PEP 8

3. **Logs e Monitoramento**
   - Use os serviços de log configurados
   - Adicione logs em pontos críticos
   - Monitore erros e performance

4. **Testes**
   - Escreva testes unitários para componentes críticos
   - Realize testes de integração entre os serviços
   - Verifique comportamento com casos extremos (audio longo, etc)

## Troubleshooting

### Problemas Comuns

1. **Erro de conexão com Neo4j**
   - Verifique se o Neo4j está rodando
   - Confirme as credenciais no arquivo `.env`
   - Teste a conexão usando o Neo4j Browser

2. **Erro nas APIs do Google Cloud**
   - Verifique se as credenciais estão configuradas corretamente
   - Confirme se as APIs necessárias estão habilitadas
   - Verifique os limites de quota

3. **Problemas com o Whisper**
   - Baixe os modelos manualmente para cache local
   - Verifique espaço em disco e memória disponível
   - Considere usar modelos mais leves para testes

## Recursos Adicionais

- [Documentação do Vertex AI](https://cloud.google.com/vertex-ai/docs)
- [Documentação do Neo4j](https://neo4j.com/docs/)
- [Documentação do FastAPI](https://fastapi.tiangolo.com/)
- [Documentação do Claude](https://docs.anthropic.com/claude/docs)
- [Documentação do Whisper](https://github.com/openai/whisper)
# VINTRA - Visualização INtegrativa TRAjetorial

VINTRA é uma aplicação moderna para análise dimensional clínica, permitindo que profissionais de saúde capturem, transcrevam e analisem sessões com pacientes.

## Sobre o Projeto

VINTRA foi migrado de uma implementação vanilla JavaScript para uma arquitetura React moderna, mantendo suas características visuais e funcionais originais enquanto melhorando sua estrutura, segurança e manutenibilidade.

### Recursos Principais

- **Análise Dimensional**: Visualização de dados clínicos em múltiplas dimensões
- **Gravação de Áudio**: Capture sessões de atendimento diretamente na aplicação
- **Transcrição**: Transforme áudio em texto para análise posterior
- **Documentação Clínica**: Geração automática de diversos formatos de documentação
- **Biblioteca de Documentos**: Repositório organizado de documentos por paciente
- **Interface Rica**: Design visual sofisticado com animações fluidas

## Tecnologias Utilizadas

- **React**: Biblioteca core de componentes
- **React Router**: Gerenciamento de rotas
- **Styled Components**: Estilização baseada em componentes
- **Recharts**: Visualização de dados
- **GSAP**: Animações avançadas
- **Vite**: Build tool e bundler

## Como Iniciar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório
   ```bash
   git clone https://github.com/seu-usuario/vintra.git
   cd vintra
   ```

2. Instale as dependências
   ```bash
   npm install
   # ou
   yarn
   ```

3. Inicie o servidor de desenvolvimento
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

### Build para Produção

```bash
npm run build
# ou
yarn build
```

## Deploy na Vercel

### 1. Configuração do Projeto

1. Fork este repositório
2. Conecte à sua conta Vercel
3. Importe o projeto

### 2. Configuração de Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no projeto Vercel:

```bash
VERTEX_AI_LOCATION=us-central1
GOOGLE_CLOUD_PROJECT=seu-projeto-id
GOOGLE_APPLICATION_CREDENTIALS={}  # JSON de credenciais do Google Cloud
WHISPER_MODEL=small
WHISPER_LANGUAGE=portuguese
MAX_AUDIO_SIZE=30
MAX_PROCESSING_TIME=300
```

### 3. Configuração do Google Cloud

1. Crie um projeto no Google Cloud
2. Habilite a API do Vertex AI
3. Crie uma conta de serviço com as seguintes permissões:
   - `roles/aiplatform.user`
   - `roles/storage.objectViewer`
4. Baixe o arquivo JSON de credenciais
5. Cole o conteúdo do JSON na variável `GOOGLE_APPLICATION_CREDENTIALS`

### 4. Deploy

A Vercel irá:
1. Detectar automaticamente que é um projeto Vite
2. Construir o frontend
3. Configurar as serverless functions na pasta `/api`
4. Configurar o roteamento conforme o `vercel.json`

### 5. Verificação

Após o deploy, verifique:
1. Frontend está acessível
2. APIs serverless estão respondendo
3. Integração com VertexAI está funcionando
4. Processamento de áudio com Whisper está funcionando

## Desenvolvimento Local

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env.local`:
```bash
cp .env.example .env.local
```

4. Execute o projeto:
```bash
npm run dev
```

## Estrutura do Projeto

```
/
├── api/                # Serverless functions
├── src/               # Frontend React
└── public/            # Arquivos estáticos
```

## Acesso à Aplicação

Para fins de demonstração, a senha de acesso é `123`.

## Funcionalidades Implementadas

- [x] Autenticação básica
- [x] Dashboard com lista de pacientes
- [x] Visualização de detalhes de paciente
- [x] Sistema de modais
- [x] Notificações toast
- [x] Tema claro/escuro
- [ ] Gravação de áudio
- [ ] Transcrição de áudio
- [ ] Processamento de documentos
- [ ] Visualização dimensional completa

## Tecnologias

- Frontend: React + Vite
- Estilização: Styled Components
- Backend: Vercel Serverless
- ML/AI: Whisper + VertexAI (Claude)

## Licença

Este projeto está licenciado sob a licença ISC.

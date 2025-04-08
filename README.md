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

## Estrutura do Projeto

```
/vintra/
├── public/               # Arquivos estáticos
├── src/                  # Código fonte
│   ├── assets/           # Imagens e recursos
│   ├── components/       # Componentes React
│   ├── contexts/         # Contextos React
│   ├── hooks/            # Custom hooks
│   ├── layouts/          # Layouts de página
│   ├── pages/            # Componentes de página
│   ├── services/         # Serviços (API, auth)
│   ├── styles/           # Estilos globais
│   ├── utils/            # Funções utilitárias
│   ├── App.jsx           # Componente raiz
│   └── index.jsx         # Ponto de entrada
└── README.md             # Este arquivo
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

## Licença

Este projeto está licenciado sob a licença ISC.

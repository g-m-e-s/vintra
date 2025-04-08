#!/bin/bash

# Imprimir mensagens coloridas
print_green() {
  echo -e "\e[32m$1\e[0m"
}

print_blue() {
  echo -e "\e[34m$1\e[0m"
}

print_yellow() {
  echo -e "\e[33m$1\e[0m"
}

print_green "===== Configurando projeto VINTRA ====="

# Verificar se os pré-requisitos estão instalados
print_blue "Verificando pré-requisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
  print_yellow "Node.js não encontrado. Por favor, instale o Node.js v18 ou superior."
  exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
  print_yellow "npm não encontrado. Por favor, instale o npm."
  exit 1
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
  print_yellow "Python 3 não encontrado. Por favor, instale o Python 3.9 ou superior."
  exit 1
fi

# Verificar pip
if ! command -v pip3 &> /dev/null; then
  print_yellow "pip3 não encontrado. Por favor, instale o pip para Python 3."
  exit 1
fi

# Verificar Docker (opcional)
if ! command -v docker &> /dev/null; then
  print_yellow "Docker não encontrado. Recomendamos instalar Docker e Docker Compose para desenvolvimento fácil."
else
  # Verificar Docker Compose
  if ! command -v docker-compose &> /dev/null; then
    print_yellow "Docker Compose não encontrado. Recomendamos instalar Docker Compose."
  fi
fi

# Configurar variáveis de ambiente
if [ ! -f .env ]; then
  print_blue "Configurando arquivo .env..."
  cp .env.example .env
  print_green "Arquivo .env criado. Por favor, edite-o com suas configurações."
fi

# Instalar dependências do frontend
print_blue "Instalando dependências do frontend..."
npm install

# Instalar dependências do backend Node.js
print_blue "Instalando dependências do backend Node.js..."
cd backend-node && npm install && cd ..

# Instalar dependências do backend Python
print_blue "Instalando dependências do backend Python..."
cd backend-python
python3 -m pip install -r requirements.txt
cd ..

print_green "===== Configuração concluída! ====="
print_blue "Para iniciar o projeto com Docker:"
echo "  docker-compose up"
print_blue "Para iniciar os serviços separadamente:"
echo "  Frontend: npm run dev"
echo "  Backend Node.js: npm run dev:node"
echo "  Backend Python: npm run dev:python"

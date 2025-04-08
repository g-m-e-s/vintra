@echo off
echo ===== Configurando projeto VINTRA =====

echo Verificando pre-requisitos...

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js nao encontrado. Por favor, instale o Node.js v18 ou superior.
    exit /b 1
)

REM Verificar npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo npm nao encontrado. Por favor, instale o npm.
    exit /b 1
)

REM Verificar Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python nao encontrado. Por favor, instale o Python 3.9 ou superior.
    exit /b 1
)

REM Verificar pip
python -m pip --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo pip nao encontrado. Por favor, instale o pip para Python 3.
    exit /b 1
)

REM Verificar Docker (opcional)
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Docker nao encontrado. Recomendamos instalar Docker e Docker Compose para desenvolvimento facil.
) else (
    REM Verificar Docker Compose
    where docker-compose >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo Docker Compose nao encontrado. Recomendamos instalar Docker Compose.
    )
)

REM Configurar variáveis de ambiente
if not exist .env (
    echo Configurando arquivo .env...
    copy .env.example .env
    echo Arquivo .env criado. Por favor, edite-o com suas configuracoes.
)

REM Instalar dependências do frontend
echo Instalando dependencias do frontend...
call npm install

REM Instalar dependências do backend Node.js
echo Instalando dependencias do backend Node.js...
cd backend-node && call npm install && cd ..

REM Instalar dependências do backend Python
echo Instalando dependencias do backend Python...
cd backend-python
python -m pip install -r requirements.txt
cd ..

echo ===== Configuracao concluida! =====
echo Para iniciar o projeto com Docker:
echo   docker-compose up
echo Para iniciar os servicos separadamente:
echo   Frontend: npm run dev
echo   Backend Node.js: npm run dev:node
echo   Backend Python: npm run dev:python

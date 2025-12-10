@echo off
set PATH=%PATH%;C:\Program Files\nodejs\
title Servidor de Estoque
echo Iniciando servidor...

rem vai para a pasta do backend
cd %~dp0

rem abre o navegador no localhost:3000
start "" http://localhost:3000

rem inicia o servidor
node server.js

pause

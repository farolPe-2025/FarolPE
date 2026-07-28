@echo off
setlocal
cd /d "%~dp0"
set "FAROL_NODE=%CD%\.tools\node-v24.18.0-win-x64"
set "PATH=%FAROL_NODE%;%PATH%"

echo.
echo  FarolPE - ambiente local
echo  Quando o endereco aparecer, abra http://localhost:3000 no navegador.
echo  Para encerrar, pressione Ctrl+C.
echo.

call "%FAROL_NODE%\npm.cmd" run dev
endlocal

@echo off
echo === Nettoyage npm pour Windows ===
echo.

echo 1. Fermeture des processus Node...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo 2. Nettoyage du cache npm...
npm cache clean --force

echo 3. Suppression du dossier node_modules...
if exist node_modules (
    rmdir /s /q node_modules 2>nul
    if exist node_modules (
        echo ATTENTION: Impossible de supprimer node_modules completement
        echo Fermez tous les editeurs, terminaux et antivirus, puis reessayez
        pause
        exit /b 1
    )
)

echo 4. Suppression du package-lock.json...
if exist package-lock.json del /f package-lock.json

echo 5. Reinstallation des dependances...
npm install

echo.
echo === Termine ===
pause

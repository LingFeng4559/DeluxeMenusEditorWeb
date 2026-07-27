@echo off
title DeluxeMenus GUI Editor

echo Starting DeluxeMenus GUI Editor...
echo Updating Mojang Assets in Background...
start "" /b node download_mc_lang.js

start http://localhost:5173
cmd /c npm run dev

pause

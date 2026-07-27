@echo off
chcp 65001 > nul
title 官方最新語言與貼圖同步工具

echo 正在連接 Minecraft 官方資產庫下載最新多國語言與貼圖...
node download_mc_lang.js

echo.
echo [成功] 2,300+ 官方語言與貼圖字典更新完成！
pause

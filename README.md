# 🎮 DeluxeMenusEditorWeb

> 專為 Minecraft 伺服器管理員與選單設計師打造的 **1:1 原生 3D DeluxeMenus GUI 雙向視覺化編輯器**！

![License](https://img.shields.io/badge/License-MIT-emerald.svg)
![Minecraft](https://img.shields.io/badge/Minecraft-1.12--1.26%2B-amber.svg)
![React](https://img.shields.io/badge/React-19.0-cyan.svg)
![Vite](https://img.shields.io/badge/Vite-8.0-purple.svg)

---

## ✨ 核心特色與功能亮點

- 💎 **100% 原汁原味 1:1 Minecraft 大箱子 GUI 介面**：支援經典灰色 `#c6c6c6` 箱子與現代暗黑玻璃模組切換。
- 🖐️ **原生 HTML5 槽位拖曳與交換 (Drag & Drop Move/Swap)**：按住物品即可在 9x6 網格中拖曳移動或對調位置，並支援拖曳至下方 **🗑️ 垃圾桶** 快速刪除！
- 🖱️ **槽位專屬右鍵選單 (Context Menu)**：右鍵一鍵彈出 **複製 (Copy)**、**剪下 (Cut)**、**貼上 (Paste)** 與 **刪除 (Delete)** 功能。
- 🎨 **3D 擬真與動態光效貼圖 (3D Renders & Animated Invicons)**：
  - 床系列（白床、紅床等 16 色）展示為 **100% 遊戲內 3D 傾斜床頭**。
  - 指令方塊（`COMMAND_BLOCK` 系列）展示為 **3D 脈衝動態閃爍光效 (`.gif`)**。
  - 地獄之星 (`NETHER_STAR`) 與終界水晶 (`END_CRYSTAL`) 展示為 **3D 動態浮動效果**。
  - 怪物頭顱（`ZOMBIE_HEAD` 等）與玩家頭顱展示為 **3D 等角方塊頭**。
- 🌐 **9 國官方正統語言包與 2,300+ 道具字典**：內建繁中、簡中、日文、英文、韓文、俄文、德文、法文、西文官方翻譯字典。
- 🔄 **雙向 YAML 即時編輯器 (Bi-directional Code Sync)**：UI 操作與下方的 YAML 原始碼 100% 毫秒級雙向同步。
- 🛡️ **永續自動同步系統 (Future-Proof Auto-Sync)**：啟動時背景自動同步連線 Mojang / GitHub 官方最新資產庫。

---

## 🚀 快速啟動

### 方法一：Windows 一鍵雙擊啟動
直接雙擊專案根目錄下的命令檔：
- 🟢 **`run_editor.cmd`** 或 **`啟動編輯器.cmd`**：一鍵開啟瀏覽器並啟動編輯器。
- 🔄 **`Update_Minecraft_Assets.cmd`**：一鍵同步官方最新語言字典。

### 方法二：命令列手動啟動
```bash
# 1. 安裝依賴
npm install

# 2. 啟動開發伺服器
npm run dev

# 3. 瀏覽器訪問
http://localhost:5173
```

---

## 📄 授權條款 (License)

本專案採用 [MIT License](LICENSE) 條款開源發布。

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal, Search, Settings, Download, Upload, Plus, Volume2, Sparkles, Folder, Layers, RefreshCw, X, Command
} from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  onExecuteCommand,
  menu,
  slotItemsMap
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Command palette entries list
  const COMMAND_ITEMS = [
    { id: 'open_settings', title: '開啟全域選單設定 (Menu Settings)', icon: Settings, category: 'General', action: () => onExecuteCommand('OPEN_SETTINGS') },
    { id: 'add_item', title: '創建全新 Slot 物品 (Create Slot Item)', icon: Plus, category: 'Item', action: () => onExecuteCommand('CREATE_ITEM') },
    { id: 'open_sound_picker', title: '開啟 Minecraft 繁體中文音效庫 (Sound Picker)', icon: Volume2, category: 'Tools', action: () => onExecuteCommand('OPEN_SOUND_PICKER') },
    { id: 'export_yaml', title: '匯出格式化 .yml 檔案 (Export YAML)', icon: Download, category: 'File', action: () => onExecuteCommand('EXPORT_YAML') },
    { id: 'import_yaml', title: '導入 .yml 設定檔 (Import YAML)', icon: Upload, category: 'File', action: () => onExecuteCommand('IMPORT_YAML') },
    { id: 'clear_selection', title: '清除目前選中的槽位 (Clear Selection)', icon: RefreshCw, category: 'Selection', action: () => onExecuteCommand('CLEAR_SELECTION') }
  ];

  // Dynamic Slot item search entries
  const slotEntries = [];
  if (menu && menu.items) {
    for (const [key, item] of Object.entries(menu.items)) {
      if (!item) continue;
      const slots = Array.isArray(item.slots) ? item.slots : (item.slot !== undefined ? [item.slot] : []);
      slotEntries.push({
        id: `slot_${key}`,
        title: `跳轉至 Slot #${slots.join(', ')}: ${key} (${item.material || 'STONE'})`,
        icon: Layers,
        category: 'Slots',
        action: () => onExecuteCommand('JUMP_TO_SLOT', { slot: slots[0], key })
      });
    }
  }

  const allEntries = [...COMMAND_ITEMS, ...slotEntries];

  const filteredEntries = allEntries.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredEntries.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredEntries.length) % Math.max(1, filteredEntries.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredEntries[selectedIndex]) {
        filteredEntries[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-start justify-center pt-20 bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-100">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Command Search Input Bar */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-2 bg-slate-950/80">
          <Command className="w-4 h-4 text-emerald-400 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="輸入指令名稱或 Slot 關鍵字 (如: settings, export, 0)..."
            className="w-full text-xs font-mono bg-transparent text-slate-100 focus:outline-none placeholder-slate-500"
          />
          <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            ESC 關閉
          </span>
        </div>

        {/* Command Entries List */}
        <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5 font-mono">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry, idx) => {
              const Icon = entry.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    entry.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="font-bold">{entry.title}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {entry.category}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-slate-500">
              未找到匹配的指令或 Slot 項目
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

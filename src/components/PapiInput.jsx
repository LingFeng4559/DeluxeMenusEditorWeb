import React, { useState, useRef } from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

const COMMON_PAPI_PLACEHOLDERS = [
  { placeholder: '%player_name%', category: 'Player', desc: '玩家遊戲暱稱' },
  { placeholder: '%player_displayname%', category: 'Player', desc: '玩家顯示名稱 (帶稱號/顏色)' },
  { placeholder: '%player_uuid%', category: 'Player', desc: '玩家 UUID' },
  { placeholder: '%player_level%', category: 'Player', desc: '玩家經驗等級 (Level)' },
  { placeholder: '%player_exp%', category: 'Player', desc: '玩家當前經驗值' },
  { placeholder: '%player_has_permission_<node>%', category: 'Permission', desc: '檢查玩家是否持有特定權限' },
  { placeholder: '%vault_eco_balance%', category: 'Economy', desc: 'Vault 金錢餘額 (格式化)' },
  { placeholder: '%vault_eco_balance_fixed%', category: 'Economy', desc: 'Vault 金錢餘額 (無小數)' },
  { placeholder: '%vault_group%', category: 'Permission', desc: 'Vault 主權限組名稱' },
  { placeholder: '%luckperms_primary_group_name%', category: 'LuckPerms', desc: 'LuckPerms 主要權限組名稱' },
  { placeholder: '%luckperms_expiry_time_<permission>%', category: 'LuckPerms', desc: '權限剩餘有效時間' },
  { placeholder: '%server_online%', category: 'Server', desc: '伺服器目前線上人數' },
  { placeholder: '%server_max_players%', category: 'Server', desc: '伺服器最大可容納人數' },
  { placeholder: '%server_tps_1%', category: 'Server', desc: '伺服器 1 分鐘平均 TPS' }
];

export default function PapiInput({
  value,
  onChange,
  placeholder,
  className = '',
  multiline = false,
  rows = 3
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [filterText, setFilterText] = useState('');
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    onChange(newVal);

    // Trigger popup if user types '%'
    const cursor = e.target.selectionStart;
    const textBeforeCursor = newVal.slice(0, cursor);
    const lastPercentIndex = textBeforeCursor.lastIndexOf('%');

    if (lastPercentIndex !== -1 && !textBeforeCursor.slice(lastPercentIndex + 1).includes(' ')) {
      const search = textBeforeCursor.slice(lastPercentIndex + 1).toLowerCase();
      setFilterText(search);
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  const handleSelectPlaceholder = (papi) => {
    if (!inputRef.current) return;
    const cursor = inputRef.current.selectionStart || value.length;
    const textBefore = value.slice(0, cursor);
    const textAfter = value.slice(cursor);
    const lastPercentIndex = textBefore.lastIndexOf('%');

    const nextVal = textBefore.slice(0, lastPercentIndex) + papi + textAfter;
    onChange(nextVal);
    setShowPopup(false);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newCursorPos = lastPercentIndex + papi.length;
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 50);
  };

  const filteredPapiList = COMMON_PAPI_PLACEHOLDERS.filter((item) =>
    item.placeholder.toLowerCase().includes(filterText) ||
    item.desc.toLowerCase().includes(filterText) ||
    item.category.toLowerCase().includes(filterText)
  );

  return (
    <div className="relative w-full">
      {multiline ? (
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          rows={rows}
          className={className}
        />
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={className}
        />
      )}

      {/* IntelliSense PAPI Popup Menu */}
      {showPopup && (
        <div className="absolute left-0 z-[999999] mt-1 w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-teal-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> PAPI 變數 IntelliSense 自動補全
            </span>
            <span className="text-[10px] text-slate-500 font-normal">點擊選擇插入</span>
          </div>

          <div className="max-h-48 overflow-y-auto p-1 space-y-0.5">
            {filteredPapiList.length > 0 ? (
              filteredPapiList.map((item) => (
                <button
                  key={item.placeholder}
                  type="button"
                  onClick={() => handleSelectPlaceholder(item.placeholder)}
                  className="w-full px-3 py-1.5 text-left rounded-lg hover:bg-teal-500/20 hover:border-teal-500/40 border border-transparent flex items-center justify-between transition group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold text-amber-300 group-hover:text-amber-200">
                      {item.placeholder}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                    {item.category}
                  </span>
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-slate-500">
                未找到匹配的 PlaceholderAPI 變數
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

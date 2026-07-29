import React, { useState } from 'react';
import { User, DollarSign, Shield, Zap, ChevronDown, ChevronUp } from 'lucide-react';

export default function MockPlayerProfile({ mockProfile, onUpdateProfile }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800/80 p-3 shadow-xl backdrop-blur-md space-y-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-cyan-400 transition"
        >
          <User className="w-4 h-4 text-cyan-400" />
          <span>虛擬玩家資料測試器 (Mock Player Profile)</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          即時替換 Display Name 與 Lore 變數
        </span>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 font-mono text-xs">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">玩家名稱 (%player_name%)</label>
            <input
              type="text"
              value={mockProfile.name || 'Steve'}
              onChange={(e) => onUpdateProfile({ ...mockProfile, name: e.target.value })}
              className="w-full px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Vault 金錢 (%vault_eco_balance%)</label>
            <input
              type="number"
              value={mockProfile.balance || 12500}
              onChange={(e) => onUpdateProfile({ ...mockProfile, balance: Number(e.target.value) })}
              className="w-full px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded-lg text-amber-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">主權限組 (%luckperms_primary_group_name%)</label>
            <input
              type="text"
              value={mockProfile.group || 'VIP'}
              onChange={(e) => onUpdateProfile({ ...mockProfile, group: e.target.value })}
              className="w-full px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded-lg text-purple-300 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

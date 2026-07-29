import React, { useState } from 'react';
import { Bookmark, Copy, Check, Sparkles, Plus, Trash2 } from 'lucide-react';

const DEFAULT_SNIPPETS = [
  {
    id: 'money_purchase',
    title: '💰 金錢購買鏈 (扣款 + 訊息 + 音效)',
    category: 'Commands',
    content: [
      '[takemoney] 500',
      '[message] &a成功購買物品！已扣除 $500',
      '[sound] ENTITY_PLAYER_LEVELUP',
      '[refresh]'
    ]
  },
  {
    id: 'deny_warning',
    title: '⚠️ 條件失敗拒絕處罰 (音效 + 訊息)',
    category: 'DenyCommands',
    content: [
      '[message] &c餘額不足或權限不足！',
      '[sound] BLOCK_NOTE_BLOCK_BASS'
    ]
  },
  {
    id: 'vip_lore',
    title: '👑 VIP 專屬商品 Lore 排版範例',
    category: 'Lore',
    content: [
      '&7------------------------',
      '&e價格: &a$1,000',
      '&e需要等級: &c30',
      '&7------------------------',
      '&a點擊立即購買！'
    ]
  }
];

export default function SnippetLibrary({ onInsertSnippet }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleApply = (snippet) => {
    onInsertSnippet(snippet);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800/80 p-3 shadow-xl backdrop-blur-md space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Bookmark className="w-4 h-4 text-amber-400" />
          <span>常用範本與代碼片段庫 (Snippet Library)</span>
        </span>
        <span className="text-[10px] text-slate-500 font-mono">一鍵快速複製插入</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
        {DEFAULT_SNIPPETS.map((snippet) => (
          <div
            key={snippet.id}
            className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-amber-500/50 transition flex flex-col justify-between gap-2 shadow"
          >
            <div>
              <h4 className="text-[11px] font-bold text-amber-300 truncate">{snippet.title}</h4>
              <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{snippet.category}</span>
            </div>

            <button
              onClick={() => handleApply(snippet)}
              className="w-full py-1 text-[10px] font-bold bg-slate-800 hover:bg-amber-500/20 text-amber-300 border border-slate-700 hover:border-amber-500/40 rounded-lg transition flex items-center justify-center gap-1"
            >
              {copiedId === snippet.id ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>已套用範本！</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>套用片段</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  Folder, FolderOpen, Package, Layers, ShieldAlert, ChevronDown, ChevronRight, Key, Sparkles, Filter
} from 'lucide-react';
import ItemIcon from './ItemIcon';

export default function TreeHierarchyExplorer({
  menu,
  selectedSlot,
  onSelectSlot,
  onSelectPriorityItem,
  activePriorityMap
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filterText, setFilterText] = useState('');

  if (!menu || !menu.items) return null;

  // Group items by slot
  const slotGroups = {};
  for (const [key, item] of Object.entries(menu.items)) {
    if (!item) continue;
    const slots = Array.isArray(item.slots) ? item.slots
      : (item.slot !== undefined ? [item.slot] : []);

    for (const s of slots) {
      if (!slotGroups[s]) slotGroups[s] = [];
      slotGroups[s].push({ key, ...item });
    }
  }

  // Sort each slot's items by priority ascending
  Object.values(slotGroups).forEach((arr) => arr.sort((a, b) => (a.priority || 999) - (b.priority || 999)));

  const sortedSlotIndices = Object.keys(slotGroups).map(Number).sort((a, b) => a - b);

  const filteredSlotIndices = sortedSlotIndices.filter((sIdx) => {
    if (!filterText.trim()) return true;
    const items = slotGroups[sIdx] || [];
    return items.some((item) =>
      item.key.toLowerCase().includes(filterText.toLowerCase()) ||
      (item.material || '').toLowerCase().includes(filterText.toLowerCase()) ||
      (item.display_name || '').toLowerCase().includes(filterText.toLowerCase())
    );
  });

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800/80 p-3 shadow-xl backdrop-blur-md space-y-2 flex flex-col max-h-[380px] overflow-hidden">
      {/* Tree Explorer Header */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-emerald-400 transition"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          {isExpanded ? <FolderOpen className="w-4 h-4 text-amber-400" /> : <Folder className="w-4 h-4 text-amber-400" />}
          <span>項目結構樹 (Tree Hierarchy Explorer)</span>
          <span className="text-[10px] font-mono font-bold bg-slate-800 text-amber-300 px-1.5 py-0.2 rounded border border-slate-700">
            {sortedSlotIndices.length} Slots
          </span>
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Quick Tree Search Input */}
          <div className="relative">
            <Filter className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="過濾 Key / 材質 / 標題..."
              className="w-full pl-8 pr-3 py-1 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Tree Structure List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
            {filteredSlotIndices.length > 0 ? (
              filteredSlotIndices.map((sIdx) => {
                const variants = slotGroups[sIdx] || [];
                const activeIdx = activePriorityMap[sIdx] || 0;
                const isSelectedSlot = selectedSlot === sIdx;

                return (
                  <div key={sIdx} className="space-y-0.5">
                    {/* Slot Container Node */}
                    <div
                      onClick={() => onSelectSlot(sIdx)}
                      className={`px-2.5 py-1 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                        isSelectedSlot
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-slate-800 text-amber-300 px-1.5 rounded border border-slate-700">
                          Slot #{sIdx}
                        </span>
                        <span className="font-bold">{variants[0]?.material || 'STONE'}</span>
                      </div>

                      {variants.length > 1 && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30 flex items-center gap-1">
                          <Layers className="w-3 h-3" /> {variants.length} 個優先級變體
                        </span>
                      )}
                    </div>

                    {/* Priority Variants Sub-tree */}
                    {variants.map((varItem, varIdx) => {
                      const isActiveVariant = activeIdx === varIdx;

                      return (
                        <div
                          key={varItem.key}
                          onClick={() => {
                            onSelectSlot(sIdx);
                            onSelectPriorityItem(sIdx, varIdx);
                          }}
                          className={`ml-5 px-2 py-1 rounded-md border text-[11px] flex items-center justify-between cursor-pointer transition ${
                            isSelectedSlot && isActiveVariant
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                              : 'bg-slate-950/30 border-transparent hover:bg-slate-800/60 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-[9px] font-bold text-slate-500">└ P{varItem.priority || (varIdx + 1)}:</span>
                            <ItemIcon material={varItem.material} className="w-3.5 h-3.5 inline-block" />
                            <span className="font-mono text-slate-300 truncate">{varItem.key}</span>
                          </div>

                          {varItem.view_requirement && (
                            <span className="text-[9px] text-amber-400 flex items-center gap-0.5" title="包含顯示條件">
                              <ShieldAlert className="w-3 h-3" /> Req
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            ) : (
              <div className="py-4 text-center text-slate-500 text-xs">
                無匹配的選單項目
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

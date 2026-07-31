import React, { useState } from 'react';
import { useI18n } from '../i18n';
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
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
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
          <span>{t('tree_explorer.title')}</span>
          <span className="text-[10px] font-mono font-bold bg-slate-800 text-amber-300 px-1.5 py-0.2 rounded border border-slate-700">
            {t('tree_explorer.slots_count', { count: sortedSlotIndices.length })}
          </span>
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Quick Search / Filter Input */}
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder={t('tree_explorer.search_placeholder')}
              className="w-full pl-8 pr-3 py-1 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
            />
          </div>

          {/* Tree Structure Content Container */}
          <div className="overflow-y-auto pr-1 space-y-1.5 flex-1 min-h-[140px]">
            {filteredSlotIndices.length > 0 ? (
              filteredSlotIndices.map((sIdx) => {
                const items = slotGroups[sIdx] || [];
                const isSelected = selectedSlot === sIdx;
                const activeItemKey = activePriorityMap[sIdx] || (items[0] && items[0].key);

                return (
                  <div
                    key={sIdx}
                    className={`rounded-xl border transition overflow-hidden ${
                      isSelected
                        ? 'border-emerald-500/80 bg-emerald-950/20'
                        : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    {/* Slot Parent Node */}
                    <div
                      onClick={() => onSelectSlot(sIdx)}
                      className="px-2.5 py-1.5 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded border border-slate-700">
                          Slot #{sIdx}
                        </span>
                        <span className="text-xs font-bold text-slate-300 font-mono">
                          {items[0] ? items[0].material : 'EMPTY'}
                        </span>
                      </div>

                      {items.length > 1 && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {t('tree_explorer.priority_variants', { count: items.length })}
                        </span>
                      )}
                    </div>

                    {/* Priority Variant Children Nodes */}
                    <div className="pl-4 pr-1.5 pb-1.5 space-y-1 border-t border-slate-800/50 pt-1">
                      {items.map((varItem, pIdx) => {
                        const isActive = activeItemKey === varItem.key;
                        return (
                          <div
                            key={varItem.key}
                            onClick={() => {
                              onSelectSlot(sIdx);
                              if (onSelectPriorityItem) onSelectPriorityItem(sIdx, varItem.key);
                            }}
                            className={`p-1.5 rounded-lg border text-xs font-mono flex items-center justify-between cursor-pointer transition ${
                              isActive
                                ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 font-bold'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-[10px] text-slate-400 opacity-80">
                                └ P{pIdx + 1}:
                              </span>
                              <ItemIcon material={varItem.material} customModelData={varItem.custom_model_data} className="w-4 h-4 shrink-0" />
                              <span className="truncate">{varItem.key}</span>
                            </div>

                            {varItem.view_requirement && (
                              <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs font-mono">
                {t('tree_explorer.no_matching')}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n';
import { parseMinecraftText } from '../utils/minecraftColors';
import ItemIcon from './ItemIcon';
import {
  Edit3, Trash2, Copy, Plus, Search, Terminal, Eye, Flag,
  ChevronRight, Sparkles, Check, Hash, Layers, ShieldAlert, GitCompare, Key
} from 'lucide-react';
import MaterialSearchModal from './MaterialSearchModal';

export default function ItemEditor({
  item,
  itemKey,
  selectedSlot,
  selectedSlots,
  slotVariants = [],
  activeVariantIndex = 0,
  onSelectVariant,
  onAddPriorityVariant,
  onUpdateItem,
  onDeleteItem,
  onDuplicateItem,
  onApplyToSelectedSlots
}) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('basic');
  const [clickType, setClickType] = useState('left_click_commands');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [editingKeyName, setEditingKeyName] = useState(itemKey || '');

  // Buffered Local Input State for Slot String (Prevents typing interrupt & vanishing panel)
  const [localSlotsInput, setLocalSlotsInput] = useState('');

  // Keep local key name in sync when itemKey changes
  useEffect(() => {
    setEditingKeyName(itemKey || '');
  }, [itemKey]);

  // Keep buffered slot input in sync when selected item changes
  useEffect(() => {
    if (item) {
      const val = Array.isArray(item.slots) ? item.slots.join(', ') : (item.slot !== undefined ? String(item.slot) : String(selectedSlot));
      setLocalSlotsInput(val);
    } else {
      setLocalSlotsInput(String(selectedSlot));
    }
  }, [item, selectedSlot]);

  if (!item && selectedSlots.length === 0) {
    return (
      <div className="w-96 bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 flex flex-col items-center justify-center text-center backdrop-blur-md">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mb-4 border border-slate-700">
          <Edit3 className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-300 mb-1">{t('item_editor.title')}</h3>
        <p className="text-xs text-slate-500 max-w-[220px]">
          {t('item_editor.no_item_selected')}
        </p>
      </div>
    );
  }

  const handleChange = (field, value) => {
    onUpdateItem({
      ...item,
      [field]: value
    }, editingKeyName);
  };

  const handleKeyNameBlur = () => {
    if (editingKeyName.trim() && editingKeyName !== itemKey) {
      onUpdateItem({ ...item }, editingKeyName.trim());
    }
  };

  // Commit Slot changes ONLY on Blur or Enter key press
  const handleCommitSlotsChange = () => {
    if (!localSlotsInput || !localSlotsInput.trim()) return;

    const parsed = localSlotsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (parsed.length > 1) {
      const { slot, ...rest } = item || {};
      onUpdateItem({ ...rest, slots: parsed }, editingKeyName);
    } else if (parsed.length === 1) {
      const { slots, ...rest } = item || {};
      onUpdateItem({ ...rest, slot: parsed[0] }, editingKeyName);
    }
  };

  const handleSlotsKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommitSlotsChange();
    }
  };

  const getLoreTextareaValue = () => {
    if (!item?.lore) return '';
    if (Array.isArray(item.lore)) {
      return item.lore.join('\n');
    }
    return String(item.lore);
  };

  const handleLoreTextareaChange = (text) => {
    const lines = text.split('\n');
    handleChange('lore', lines);
  };

  const commandsList = Array.isArray(item?.[clickType]) ? item[clickType] : [];

  const handleCommandChange = (index, value) => {
    const nextCmds = [...commandsList];
    nextCmds[index] = value;
    handleChange(clickType, nextCmds);
  };

  const handleAddCommand = (prefix = '[player] ') => {
    const nextCmds = [...commandsList, `${prefix}command`];
    handleChange(clickType, nextCmds);
  };

  const handleRemoveCommand = (index) => {
    const nextCmds = [...commandsList];
    nextCmds.splice(index, 1);
    handleChange(clickType, nextCmds);
  };

  const loreLines = Array.isArray(item?.lore) ? item.lore : (item?.lore ? [item.lore] : []);

  const getReqSummary = (varItem) => {
    if (!varItem.view_requirement) return '預設 (無條件可見)';
    const reqs = varItem.view_requirement.requirements || {};
    const keys = Object.keys(reqs);
    if (keys.length === 0) return '條件 (自訂)';
    const firstReq = reqs[keys[0]];
    if (firstReq.input) {
      return `${firstReq.input} == ${firstReq.output || 'true'}`;
    }
    return `條件 (${firstReq.type || '自訂'})`;
  };

  return (
    <aside className="w-96 bg-slate-900/60 rounded-2xl border border-slate-800/80 flex flex-col shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Priority Variants Comparison Section */}
      {slotVariants.length > 0 && (
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-slate-200">
                槽位 #{selectedSlot} 變體切換 ({slotVariants.length} 個):
              </h4>
            </div>

            <button
              onClick={onAddPriorityVariant}
              title="新增此槽位的下一優先級條件變體 (如 P3)"
              className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition text-[11px] flex items-center gap-1 shadow"
            >
              <Plus className="w-3.5 h-3.5" /> 新增變體
            </button>
          </div>

          {/* Comparison Cards Carousel/Stack */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {slotVariants.map((varItem, idx) => {
              const isSelected = idx === activeVariantIndex;
              const priorityNum = varItem.priority || (idx + 1);

              return (
                <div
                  key={idx}
                  onClick={() => onSelectVariant(idx)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/60 text-slate-100 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <ItemIcon material={varItem.material} className="w-6 h-6 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          P{priorityNum}
                        </span>
                        <span className="text-xs font-bold font-mono text-slate-200 truncate">
                          {varItem.key}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono truncate mt-0.5">
                        {parseMinecraftText(varItem.display_name || varItem.material || '無標題').map((seg, sIdx) => (
                          <span key={sIdx} style={seg.style}>{seg.text}</span>
                        ))}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate font-mono mt-0.5">
                        需求: {getReqSummary(varItem)}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 flex-shrink-0 ml-2">
                      單獨編輯中
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Editor Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="p-1 bg-slate-950 rounded-xl border border-slate-800">
            <ItemIcon material={item?.material} className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              {itemKey || `Slot #${selectedSlot}`}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                {item?.material || 'AIR'}
              </span>
              {item?.priority && (
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                  Priority: {item.priority}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {item && (
            <>
              <button
                onClick={onDuplicateItem}
                title={t('item_editor.duplicate_item')}
                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={onDeleteItem}
                title={t('item_editor.delete_item')}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold bg-slate-950/40">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex-1 py-2.5 text-center transition ${
            activeTab === 'basic' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          基礎
        </button>
        <button
          onClick={() => setActiveTab('lore')}
          className={`flex-1 py-2.5 text-center transition ${
            activeTab === 'lore' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Lore
        </button>
        <button
          onClick={() => setActiveTab('commands')}
          className={`flex-1 py-2.5 text-center transition ${
            activeTab === 'commands' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          指令
        </button>
        <button
          onClick={() => setActiveTab('requirements')}
          className={`flex-1 py-2.5 text-center transition ${
            activeTab === 'requirements' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          條件需求
        </button>
        <button
          onClick={() => setActiveTab('flags')}
          className={`flex-1 py-2.5 text-center transition ${
            activeTab === 'flags' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          旗標
        </button>
      </div>

      {/* Panel Body */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 max-h-[calc(100vh-280px)]">
        {selectedSlots.length > 1 && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-between text-xs">
            <span className="text-cyan-300 font-medium">已多選 {selectedSlots.length} 個槽位</span>
            <button
              onClick={onApplyToSelectedSlots}
              className="px-2.5 py-1 font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded transition shadow"
            >
              {t('gui_grid.apply_to_selected')}
            </button>
          </div>
        )}

        {/* TAB 1: BASIC PROPERTIES */}
        {activeTab === 'basic' && (
          <div className="space-y-3">
            {/* YAML Item Key Name Editor */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-amber-400" /> 變體 YAML 識別 Key 名稱:
              </label>
              <input
                type="text"
                value={editingKeyName}
                onChange={(e) => setEditingKeyName(e.target.value)}
                onBlur={handleKeyNameBlur}
                placeholder="例如: hide_sponsor_diamond"
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">{t('item_editor.material')}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item?.material || 'STONE'}
                  onChange={(e) => handleChange('material', e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                />
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Search className="w-3.5 h-3.5" /> 搜尋
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">{t('item_editor.display_name')}</label>
              <input
                type="text"
                value={item?.display_name || ''}
                onChange={(e) => handleChange('display_name', e.target.value)}
                placeholder="例如: &a&l超級鐵劍"
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
              <div className="mt-1.5 p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 font-mono text-xs">
                {parseMinecraftText(item?.display_name || '&7未命名物品').map((seg, idx) => (
                  <span key={idx} style={seg.style}>{seg.text}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-400 font-medium">
                  槽位 (slot / slots):
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  (Enter 鍵或失焦確定)
                </span>
              </div>
              <input
                type="text"
                value={localSlotsInput}
                onChange={(e) => setLocalSlotsInput(e.target.value)}
                onBlur={handleCommitSlotsChange}
                onKeyDown={handleSlotsKeyDown}
                placeholder="例如: 9 或多槽位 9, 10, 11"
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-cyan-400 font-bold focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">{t('item_editor.priority')} (優先級)</label>
                <input
                  type="number"
                  value={item?.priority !== undefined ? item.priority : ''}
                  placeholder="數字越小越優先 (如 1)"
                  onChange={(e) => handleChange('priority', e.target.value === '' ? undefined : parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-amber-300 font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">{t('item_editor.amount')}</label>
                <input
                  type="number"
                  min="1"
                  max="64"
                  value={item?.amount || 1}
                  onChange={(e) => handleChange('amount', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">{t('item_editor.damage')}</label>
                <input
                  type="number"
                  value={item?.damage || 0}
                  onChange={(e) => handleChange('damage', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">{t('item_editor.custom_model_data')}</label>
                <input
                  type="number"
                  value={item?.custom_model_data || ''}
                  placeholder="可選"
                  onChange={(e) => handleChange('custom_model_data', e.target.value === '' ? undefined : parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MULTI-LINE LORE TEXTAREA EDITOR */}
        {activeTab === 'lore' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-300 font-bold block">
                描述 Lore (多行輸入框 - 按 Enter 換行):
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {loreLines.length} 行
              </span>
            </div>

            <textarea
              rows={8}
              value={getLoreTextareaValue()}
              onChange={(e) => handleLoreTextareaChange(e.target.value)}
              placeholder="&7直接在此輸入多行 Lore，按 Enter 自動換行&#10;&e可直接貼上多行文字！"
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500 focus:outline-none leading-relaxed resize-y"
            ></textarea>

            {loreLines.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  即時彩字 Lore 預覽:
                </span>
                <div className="p-3 bg-[#11011e]/95 border border-[#2b0859] rounded-xl font-mono text-xs space-y-1 shadow-inner">
                  {loreLines.map((line, idx) => (
                    <div key={idx} className="leading-snug min-h-[16px]">
                      {parseMinecraftText(line || ' ').map((seg, sIdx) => (
                        <span key={sIdx} style={seg.style}>{seg.text}</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CLICK COMMANDS */}
        {activeTab === 'commands' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">{t('item_editor.click_type')}</label>
              <select
                value={clickType}
                onChange={(e) => setClickType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
              >
                <option value="left_click_commands">{t('item_editor.left_click')}</option>
                <option value="right_click_commands">{t('item_editor.right_click')}</option>
                <option value="shift_left_click_commands">{t('item_editor.shift_left_click')}</option>
                <option value="shift_right_click_commands">{t('item_editor.shift_right_click')}</option>
                <option value="middle_click_commands">{t('item_editor.middle_click')}</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {['[player]', '[console]', '[message]', '[sound]', '[close]', '[openguimenu]'].map((prefix) => (
                <button
                  key={prefix}
                  onClick={() => handleAddCommand(`${prefix} `)}
                  className="px-2 py-0.5 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded transition"
                >
                  +{prefix}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              {commandsList.map((cmd, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={cmd}
                    onChange={(e) => handleCommandChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleRemoveCommand(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VIEW REQUIREMENTS */}
        {activeTab === 'requirements' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> view_requirement (顯示條件)
              </label>
            </div>

            {item?.view_requirement ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Requirements:</span>
                  <textarea
                    rows={6}
                    value={JSON.stringify(item.view_requirement, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        handleChange('view_requirement', parsed);
                      } catch (err) {}
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-xs text-cyan-300 focus:outline-none"
                  ></textarea>
                </div>

                <button
                  onClick={() => handleChange('view_requirement', undefined)}
                  className="px-3 py-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg hover:bg-rose-500/20 transition"
                >
                  移除顯示條件
                </button>
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-slate-800 rounded-xl space-y-2">
                <p className="text-xs text-slate-500">目前沒有設定顯示條件 (所有玩家皆可看見)</p>
                <button
                  onClick={() => {
                    handleChange('view_requirement', {
                      requirements: {
                        custom_req: {
                          type: 'string equals',
                          input: '%player_has_permission_group.鑽卡%',
                          output: 'yes'
                        }
                      }
                    });
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg hover:bg-amber-500/30 transition"
                >
                  + 新增顯示條件
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FLAGS & ATTRIBUTES */}
        {activeTab === 'flags' && (
          <div className="space-y-2">
            {[
              { key: 'hide_attributes', label: t('item_editor.hide_attributes') },
              { key: 'hide_enchantments', label: t('item_editor.hide_enchantments') },
              { key: 'hide_effects', label: t('item_editor.hide_effects') },
              { key: 'hide_unbreakable', label: t('item_editor.hide_unbreakable') },
              { key: 'unbreakable', label: t('item_editor.unbreakable') },
              { key: 'glow', label: t('item_editor.glow') }
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition"
              >
                <span className="text-xs text-slate-300">{label}</span>
                <input
                  type="checkbox"
                  checked={!!item?.[key]}
                  onChange={(e) => handleChange(key, e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>
            ))}
          </div>
        )}
      </div>

      {showSearchModal && (
        <MaterialSearchModal
          onClose={() => setShowSearchModal(false)}
          onSelect={(selectedMaterial) => handleChange('material', selectedMaterial)}
        />
      )}
    </aside>
  );
}

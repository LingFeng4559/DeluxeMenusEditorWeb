import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n';
import { parseMinecraftText } from '../utils/minecraftColors';
import ItemIcon from './ItemIcon';
import {
  Edit3, Trash2, Copy, Plus, Search, Terminal, Eye, Flag,
  ChevronRight, Sparkles, Check, Hash, Layers, ShieldAlert, GitCompare, Key, Lock, DollarSign, Award, Users, Zap
} from 'lucide-react';
import MaterialSearchModal from './MaterialSearchModal';
import RequirementPuzzleBuilder from './RequirementPuzzleBuilder';
import PapiInput from './PapiInput';
import ActionFlowBuilder from './ActionFlowBuilder';

export default function ItemEditor({
  item,
  itemKey,
  selectedSlot,
  selectedSlots,
  slotVariants = [],
  activeVariantIndex = 0,
  onCreateItem,
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

  // Quick Permission Template Input
  const [quickPermissionInput, setQuickPermissionInput] = useState('menu.vip.use');
  const [quickMoneyInput, setQuickMoneyInput] = useState(100);

  // Buffered Local Input State for Slot String
  const [localSlotsInput, setLocalSlotsInput] = useState('');

  useEffect(() => {
    setEditingKeyName(itemKey || '');
  }, [itemKey]);

  useEffect(() => {
    if (item) {
      const val = Array.isArray(item.slots) ? item.slots.join(', ') : (item.slot !== undefined ? String(item.slot) : String(selectedSlot));
      setLocalSlotsInput(val);
    } else {
      setLocalSlotsInput(String(selectedSlot));
    }
  }, [item, selectedSlot]);

  if (!item) {
    return (
      <aside className="w-96 bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
          <Plus className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-base font-bold text-slate-200 mb-1">槽位 #{selectedSlot} 目前為空</h3>
        <p className="text-xs text-slate-400 mb-6 max-w-[240px]">
          點擊下方按鈕以在此槽位建立新物品，並設定材質與屬性。
        </p>

        <div className="w-full space-y-3">
          <button
            onClick={() => onCreateItem && onCreateItem(selectedSlot, 'STONE')}
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>建立預設物品 (STONE)</span>
          </button>

          <button
            onClick={() => setShowSearchModal(true)}
            className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl transition text-xs flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>開啟材質庫選擇材質創建</span>
          </button>
        </div>

        {showSearchModal && (
          <MaterialSearchModal
            onClose={() => setShowSearchModal(false)}
            onSelect={(mat) => {
              setShowSearchModal(false);
              if (onCreateItem) onCreateItem(selectedSlot, mat);
            }}
          />
        )}
      </aside>
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
    if (!varItem.view_requirement) return t('item_editor.req_default');
    const reqs = varItem.view_requirement.requirements || {};
    const keys = Object.keys(reqs);
    if (keys.length === 0) return t('item_editor.req_custom');
    const firstReq = reqs[keys[0]];
    if (firstReq.type === 'has permission' || firstReq.permission) {
      return `🔑 Perm: ${firstReq.permission || 'custom'}`;
    }
    if (firstReq.input) {
      return `${firstReq.input} == ${firstReq.output || 'true'}`;
    }
    return `${t('item_editor.req_custom')} (${firstReq.type || 'custom'})`;
  };

  // Quick Preset Handlers
  const handleApplyPermissionTemplate = (permStr) => {
    const nodeName = permStr.trim() || 'your.custom.permission';
    handleChange('view_requirement', {
      requirements: {
        permission_check: {
          type: 'has permission',
          permission: nodeName
        }
      }
    });
  };

  const handleApplyMoneyTemplate = (amountVal) => {
    const amt = parseInt(amountVal) || 100;
    handleChange('view_requirement', {
      requirements: {
        money_check: {
          type: 'has money',
          amount: amt
        }
      }
    });
  };

  const handleApplyGroupTemplate = (groupName) => {
    handleChange('view_requirement', {
      requirements: {
        group_check: {
          type: 'string equals',
          input: '%vault_group%',
          output: groupName || 'admin'
        }
      }
    });
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
                {t('item_editor.variant_switch_title', { slot: selectedSlot, count: slotVariants.length })}
              </h4>
            </div>

            <button
              onClick={onAddPriorityVariant}
              title="Add Priority Variant"
              className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition text-[11px] flex items-center gap-1 shadow"
            >
              <Plus className="w-3.5 h-3.5" /> {t('item_editor.add_variant')}
            </button>
          </div>

          {/* Comparison Cards Stack */}
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
                        {parseMinecraftText(varItem.display_name || varItem.material || 'Unnamed').map((seg, sIdx) => (
                          <span key={sIdx} style={seg.style}>{seg.text}</span>
                        ))}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate font-mono mt-0.5">
                        {getReqSummary(varItem)}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 flex-shrink-0 ml-2">
                      {t('item_editor.editing_variant')}
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
          {t('item_editor.tab_basic')}
        </button>
        <button
          onClick={() => setActiveTab('lore')}
          className={`flex-1 py-2.5 text-center transition ${
            activeTab === 'lore' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('item_editor.tab_lore')}
        </button>
        <button
          onClick={() => setActiveTab('commands')}
          className={`flex-1 py-2.5 text-center transition ${
            activeTab === 'commands' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('item_editor.tab_commands')}
        </button>
        <button
          onClick={() => setActiveTab('requirements')}
          className={`flex-1 py-2.5 text-center transition ${
            activeTab === 'requirements' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('item_editor.tab_requirements')}
        </button>
        <button
          onClick={() => setActiveTab('flags')}
          className={`flex-1 py-2.5 text-center transition ${
            activeTab === 'flags' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('item_editor.tab_flags')}
        </button>
      </div>

      {/* Panel Body */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 max-h-[calc(100vh-280px)]">
        {selectedSlots.length > 1 && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-between text-xs">
            <span className="text-cyan-300 font-medium">Selected {selectedSlots.length} slots</span>
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
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-amber-400" /> {t('item_editor.variant_yaml_key')}
              </label>
              <input
                type="text"
                value={editingKeyName}
                onChange={(e) => setEditingKeyName(e.target.value)}
                onBlur={handleKeyNameBlur}
                placeholder={t('item_editor.key_placeholder')}
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
                  <Search className="w-3.5 h-3.5" /> Search
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">{t('item_editor.display_name')}</label>
              <PapiInput
                value={item?.display_name || ''}
                onChange={(val) => handleChange('display_name', val)}
                placeholder="例如: &a&l超級神劍 (%player_name%)"
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
              <div className="mt-1.5 p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 font-mono text-xs">
                {parseMinecraftText(item?.display_name || '&7Unnamed Item').map((seg, idx) => (
                  <span key={idx} style={seg.style}>{seg.text}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-400 font-medium">
                  {t('item_editor.slots_label')}
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {t('item_editor.slots_hint')}
                </span>
              </div>
              <input
                type="text"
                value={localSlotsInput}
                onChange={(e) => setLocalSlotsInput(e.target.value)}
                onBlur={handleCommitSlotsChange}
                onKeyDown={handleSlotsKeyDown}
                placeholder="e.g. 9 or multi-slots 9, 10, 11"
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-cyan-400 font-bold focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">{t('item_editor.priority')}</label>
                <input
                  type="number"
                  value={item?.priority !== undefined ? item.priority : ''}
                  placeholder={t('item_editor.priority_hint')}
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
                  placeholder="Optional"
                  onChange={(e) => handleChange('custom_model_data', e.target.value === '' ? undefined : parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LORE TEXTAREA */}
        {activeTab === 'lore' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-300 font-bold block">
                {t('item_editor.lore_label')}
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {loreLines.length} lines
              </span>
            </div>

            <textarea
              rows={8}
              value={getLoreTextareaValue()}
              onChange={(e) => handleLoreTextareaChange(e.target.value)}
              placeholder="&7Enter multi-line lore here&#10;&eSupports color codes!"
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500 focus:outline-none leading-relaxed resize-y"
            ></textarea>

            {loreLines.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  {t('item_editor.lore_preview')}
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

            {/* Action Flow Visual Designer Component */}
            <ActionFlowBuilder
              commands={commandsList}
              onChange={(nextCmds) => handleChange(clickType, nextCmds)}
            />
          </div>
        )}

        {/* TAB 4: VIEW & CLICK REQUIREMENTS WITH PUZZLE BLOCK BUILDER */}
        {activeTab === 'requirements' && (
          <div className="space-y-4">
            {/* View / Click Requirement Sub-tab Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => handleChange('_req_type', 'view_requirement')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  (item?._req_type || 'view_requirement') === 'view_requirement'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>顯示條件 (view_requirement)</span>
              </button>

              <button
                onClick={() => handleChange('_req_type', 'click_requirement')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  item?._req_type === 'click_requirement'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>點擊條件 (click_requirement)</span>
              </button>
            </div>

            {/* Puzzle Requirement Builder Component */}
            <RequirementPuzzleBuilder
              value={item?._req_type === 'click_requirement' ? item?.click_requirement : item?.view_requirement}
              onChange={(nextReqVal) => {
                const targetKey = item?._req_type === 'click_requirement' ? 'click_requirement' : 'view_requirement';
                handleChange(targetKey, nextReqVal);
              }}
            />

            {/* Clear Requirement Button */}
            {(item?.view_requirement || item?.click_requirement) && (
              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => {
                    const targetKey = item?._req_type === 'click_requirement' ? 'click_requirement' : 'view_requirement';
                    handleChange(targetKey, undefined);
                  }}
                  className="px-3 py-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg hover:bg-rose-500/20 transition flex items-center gap-1 font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>清除當前條件</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FLAGS & ADVANCED ATTRIBUTES */}
        {activeTab === 'flags' && (
          <div className="space-y-4">
            {/* Custom Model Data & Color (RGB) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">{t('item_editor.custom_model_data')}</label>
                <input
                  type="number"
                  value={item?.custom_model_data || ''}
                  placeholder={t('item_editor.cmd_placeholder')}
                  onChange={(e) => handleChange('custom_model_data', e.target.value === '' ? undefined : parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">{t('item_editor.leather_color')}</label>
                <input
                  type="text"
                  value={item?.color || ''}
                  placeholder={t('item_editor.leather_color_placeholder')}
                  onChange={(e) => handleChange('color', e.target.value || undefined)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-cyan-400 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Custom NBT String */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">{t('item_editor.nbt_string')}</label>
              <input
                type="text"
                value={item?.nbt_string || ''}
                placeholder={t('item_editor.nbt_placeholder')}
                onChange={(e) => handleChange('nbt_string', e.target.value || undefined)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-amber-400 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Hide Flags Checklist */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-bold block">{t('item_editor.hide_flags_section')}</span>
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

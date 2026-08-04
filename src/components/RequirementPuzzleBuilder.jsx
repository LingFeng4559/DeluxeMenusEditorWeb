import React, { useState } from 'react';
import { useI18n } from '../i18n';
import {
  Puzzle, Plus, Trash2, Key, DollarSign, Scale, AlertCircle, GripVertical, ArrowDown, Volume2, Sparkles, ChevronDown, ChevronRight
} from 'lucide-react';
import { getSoundChineseName } from '../utils/minecraftSounds';
import SoundSearchModal from './SoundSearchModal';
import PapiInput from './PapiInput';

export default function RequirementPuzzleBuilder({ value, onChange }) {
  const { t } = useI18n();
  const [draggedType, setDraggedType] = useState(null);
  const [soundTargetIdx, setSoundTargetIdx] = useState(null);
  const [expandedBlocks, setExpandedBlocks] = useState({});

  const toggleBlock = (reqKey) => {
    setExpandedBlocks(prev => ({ ...prev, [reqKey]: prev[reqKey] === false ? true : false }));
  };

  // Safety fallback for current view_requirement structure
  const viewReq = value || {};
  const requirements = viewReq.requirements || {};
  const denyCommands = viewReq.deny_commands || [];

  const updateReq = (nextVal) => {
    onChange(nextVal);
  };

  // Add block by type
  const handleAddBlock = (type) => {
    const nextReqs = { ...requirements };
    const randomId = Math.random().toString(36).substring(2, 7);

    if (type === 'has_permission') {
      nextReqs[`has_perm_${randomId}`] = {
        type: 'has permission',
        permission: 'deluxemenus.vip.use'
      };
    } else if (type === 'has_money') {
      nextReqs[`has_money_${randomId}`] = {
        type: 'has money',
        amount: 100
      };
    } else if (type === 'compare_check' || type === 'level_check' || type === 'string_equals') {
      nextReqs[`compare_${randomId}`] = {
        type: '>=',
        input: '%player_level%',
        output: '10'
      };
    }

    updateReq({
      ...viewReq,
      requirements: nextReqs
    });
    setExpandedBlocks(prev => ({ 
      ...prev, 
      [`compare_${randomId}`]: true, 
      [`has_perm_${randomId}`]: true, 
      [`has_money_${randomId}`]: true 
    }));
  };

  const handleUpdateBlockField = (reqKey, field, val) => {
    const nextReqs = {
      ...requirements,
      [reqKey]: {
        ...requirements[reqKey],
        [field]: val
      }
    };
    updateReq({
      ...viewReq,
      requirements: nextReqs
    });
  };

  const handleDeleteBlock = (reqKey) => {
    const nextReqs = { ...requirements };
    delete nextReqs[reqKey];
    updateReq({
      ...viewReq,
      requirements: nextReqs
    });
  };

  const handleAddDenyCommand = (cmdStr) => {
    updateReq({
      ...viewReq,
      deny_commands: [...denyCommands, cmdStr]
    });
  };

  const handleUpdateDenyCommand = (idx, val) => {
    const nextCmds = [...denyCommands];
    nextCmds[idx] = val;
    updateReq({
      ...viewReq,
      deny_commands: nextCmds
    });
  };

  const handleDeleteDenyCommand = (idx) => {
    const nextCmds = [...denyCommands];
    nextCmds.splice(idx, 1);
    updateReq({
      ...viewReq,
      deny_commands: nextCmds
    });
  };

  const reqEntries = Object.entries(requirements);

  return (
    <div className="space-y-3 font-sans">
      {/* Scratch Blocks Palette with Container Queries (Option B) */}
      <div className="@container p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5">
        <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
          <Puzzle className="w-3.5 h-3.5 shrink-0" /> {t('puzzle_builder.drag_hint')}
        </span>

        {/* Responsive Container Query Grid:
            < 280px container width  -> 1 column
            280px - 420px container width -> 2 columns
            > 420px container width -> 3 columns */}
        <div className="grid grid-cols-1 @[280px]:grid-cols-2 @[420px]:grid-cols-3 gap-2">
          <div
            draggable
            onDragStart={() => setDraggedType('has_permission')}
            onClick={() => handleAddBlock('has_permission')}
            title={t('puzzle_builder.btn_perm_desc') || t('puzzle_builder.btn_perm')}
            className="cursor-grab active:cursor-grabbing py-2 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md border-b-2 border-emerald-800 hover:scale-[1.02] select-none"
          >
            <div className="w-2 h-3 bg-emerald-950/40 rounded-sm shrink-0" />
            <Key className="w-3.5 h-3.5 shrink-0" />
            <span>{t('puzzle_builder.btn_perm')}</span>
          </div>

          <div
            draggable
            onDragStart={() => setDraggedType('has_money')}
            onClick={() => handleAddBlock('has_money')}
            title={t('puzzle_builder.btn_money_desc') || t('puzzle_builder.btn_money')}
            className="cursor-grab active:cursor-grabbing py-2 px-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md border-b-2 border-cyan-800 hover:scale-[1.02] select-none"
          >
            <div className="w-2 h-3 bg-cyan-950/40 rounded-sm shrink-0" />
            <DollarSign className="w-3.5 h-3.5 shrink-0" />
            <span>{t('puzzle_builder.btn_money')}</span>
          </div>

          <div
            draggable
            onDragStart={() => setDraggedType('compare_check')}
            onClick={() => handleAddBlock('compare_check')}
            title={t('puzzle_builder.btn_compare_desc') || t('puzzle_builder.btn_compare')}
            className="cursor-grab active:cursor-grabbing py-2 px-2.5 bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md border-b-2 border-purple-800 hover:scale-[1.02] select-none"
          >
            <div className="w-2 h-3 bg-purple-950/40 rounded-sm shrink-0" />
            <Scale className="w-3.5 h-3.5 shrink-0" />
            <span>{t('puzzle_builder.btn_compare')}</span>
          </div>
        </div>
      </div>

      {/* SCRATCH CANVAS (INTERLOCKING PUZZLE STACK) */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          if (draggedType) {
            handleAddBlock(draggedType);
            setDraggedType(null);
          }
        }}
        className="p-3 bg-slate-950/70 border-2 border-dashed border-slate-800 rounded-xl min-h-[200px] max-h-[420px] overflow-y-auto space-y-0"
      >
        {/* Top Scratch Stack Header Notch */}
        <div className="flex items-center justify-between bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-t-xl shadow relative">
          <div className="flex items-center gap-1.5">
            <Puzzle className="w-4 h-4" />
            <span>{t('puzzle_builder.canvas_title')}</span>
          </div>
          {/* Bottom interlocking Tab / Notch */}
          <div className="absolute -bottom-2 left-6 w-5 h-2 bg-amber-500 rounded-b-md shadow-sm z-10" />
        </div>

        {/* Stacked Puzzle Blocks */}
        <div className="pt-2 space-y-2">
          {reqEntries.length > 0 ? (
            reqEntries.map(([reqKey, rule], idx) => {
              const isPermission = rule.type === 'has permission' || rule.permission;
              const isMoney = rule.type === 'has money' || rule.amount !== undefined;

              const bgClass = isPermission ? 'bg-emerald-600 border-emerald-800 text-slate-950'
                            : isMoney ? 'bg-cyan-600 border-cyan-800 text-slate-950'
                            : 'bg-purple-600 border-purple-800 text-slate-950';

              return (
                <div key={reqKey} className="relative group/block pt-1">
                  {/* Top Matching Inward Notch */}
                  <div className="absolute -top-1 left-6 w-5 h-2 bg-slate-950 rounded-b-md z-20" />

                  {/* Interlocking Puzzle Block Body */}
                  <div className={`p-2.5 rounded-xl border-b-4 shadow-lg space-y-2 relative transition hover:scale-[1.005] ${bgClass}`}>
                    {/* Header: Draggable Grip, Key, Toggle and Delete */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-1 cursor-pointer" onClick={() => toggleBlock(reqKey)}>
                        <GripVertical className="w-3.5 h-3.5 opacity-70 cursor-grab hover:text-white" />
                        <button type="button" className="p-0.5 hover:bg-black/20 rounded transition text-inherit">
                          {expandedBlocks[reqKey] !== false ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        <span className="font-mono text-[11px] opacity-90 font-bold">#{idx + 1} {reqKey}</span>
                        {expandedBlocks[reqKey] === false && (
                          <span className="text-xs font-medium opacity-80 ml-2 truncate max-w-[150px] sm:max-w-[200px]">
                            {isPermission ? `🔑 ${rule.permission || ''}` 
                             : isMoney ? `💲 >= ${rule.amount || 0}`
                             : `🔍 ${rule.input || ''} ${rule.type || '=='} ${rule.output || ''}`}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteBlock(reqKey)}
                        className="p-1 hover:bg-black/20 rounded transition text-slate-950 hover:text-rose-950"
                        title="刪除積木"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Editable Fields inside Scratch Block (Hidden when collapsed) */}
                    {expandedBlocks[reqKey] !== false && (
                      <div className="font-bold">
                        {isPermission ? (
                          <div className="flex items-center gap-1.5 bg-slate-950/40 p-2 rounded-lg border border-emerald-800/50 mt-1">
                            <Key className="w-4 h-4 text-emerald-950 shrink-0" />
                            <span className="text-xs text-emerald-950 shrink-0">{t('puzzle_builder.perm_label')}</span>
                            <input
                              type="text"
                              value={rule.permission || ''}
                              onChange={(e) => handleUpdateBlockField(reqKey, 'permission', e.target.value)}
                              placeholder="deluxemenus.vip.use"
                              className="flex-1 min-w-0 px-2 py-1 text-xs font-mono bg-slate-950 text-emerald-300 border border-emerald-800/60 rounded focus:outline-none focus:border-emerald-400 font-normal"
                            />
                          </div>
                        ) : isMoney ? (
                          <div className="flex items-center gap-1.5 bg-slate-950/40 p-2 rounded-lg border border-cyan-800/50 mt-1">
                            <DollarSign className="w-4 h-4 text-cyan-950 shrink-0" />
                            <span className="text-xs text-cyan-950 shrink-0">{t('puzzle_builder.money_label')}</span>
                            <input
                              type="number"
                              value={rule.amount || 0}
                              onChange={(e) => handleUpdateBlockField(reqKey, 'amount', Number(e.target.value))}
                              placeholder="100"
                              className="w-32 px-2 py-1 text-xs font-mono bg-slate-950 text-cyan-300 border border-cyan-800/60 rounded focus:outline-none focus:border-cyan-400 font-normal"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1.5 bg-slate-950/40 p-2 rounded-lg border border-purple-800/50 font-sans mt-1">
                            {/* Line 1: Input Variable with PapiInput + Quick Preset Buttons (Compact) */}
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-between text-[11px] text-purple-950">
                                <span className="flex items-center gap-1 opacity-80">
                                  <Sparkles className="w-3 h-3" />
                                  變數 (Input)
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateBlockField(reqKey, 'input', '%player_level%')}
                                    className="px-1.5 py-0.5 text-[10px] font-mono bg-purple-950 text-purple-200 hover:bg-purple-900 rounded transition font-normal"
                                    title="帶入等級變數 %player_level%"
                                  >
                                    %等級%
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateBlockField(reqKey, 'input', '%luckperms_primary_group_name%')}
                                    className="px-1.5 py-0.5 text-[10px] font-mono bg-purple-950 text-purple-200 hover:bg-purple-900 rounded transition font-normal"
                                    title="帶入權限組變數 %luckperms_primary_group_name%"
                                  >
                                    %權限組%
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateBlockField(reqKey, 'input', '%vault_eco_balance%')}
                                    className="px-1.5 py-0.5 text-[10px] font-mono bg-purple-950 text-purple-200 hover:bg-purple-900 rounded transition font-normal"
                                    title="帶入金幣變數 %vault_eco_balance%"
                                  >
                                    %金幣%
                                  </button>
                                </div>
                              </div>
                              <PapiInput
                                value={rule.input || ''}
                                onChange={(val) => handleUpdateBlockField(reqKey, 'input', val)}
                                placeholder="%player_level% 或 %luckperms_primary_group_name%"
                                className="w-full px-2 py-1 text-xs font-mono bg-slate-950 text-amber-300 border border-purple-800/60 rounded focus:outline-none focus:border-purple-400 font-normal"
                              />
                            </div>

                            {/* Line 2: Operator & Target Output Value (Horizontal Compact) */}
                            <div className="flex gap-2">
                              <select
                                value={rule.type || '=='}
                                onChange={(e) => handleUpdateBlockField(reqKey, 'type', e.target.value)}
                                className="w-[100px] sm:w-[120px] px-1 py-1 text-xs font-mono bg-slate-950 text-purple-200 border border-purple-800/60 rounded focus:outline-none focus:border-purple-400 cursor-pointer font-normal truncate"
                              >
                                <option value="==">== (等於)</option>
                                <option value=">=">&gt;= (大於等於)</option>
                                <option value="<=">&lt;= (小於等於)</option>
                                <option value=">">&gt; (大於)</option>
                                <option value="<">&lt; (小於)</option>
                                <option value="!=">!= (不等於)</option>
                                <option value="string equals">equals (字串完全相等)</option>
                                <option value="string contains">contains (字串包含)</option>
                                <option value="regex matches">regex (正則表達式)</option>
                              </select>

                              <input
                                type="text"
                                value={rule.output || ''}
                                onChange={(e) => handleUpdateBlockField(reqKey, 'output', e.target.value)}
                                placeholder="目標值 (例如: 10 或 vip)"
                                className="flex-1 min-w-0 px-2 py-1 text-xs font-mono bg-slate-950 text-amber-300 border border-purple-800/60 rounded focus:outline-none focus:border-purple-400 font-normal"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Outward Interlocking Tab / Notch */}
                    <div className="absolute -bottom-2 left-6 w-5 h-2 bg-inherit rounded-b-md shadow-md z-10" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
              <ArrowDown className="w-5 h-5 animate-bounce text-slate-600" />
              <span>{t('puzzle_builder.canvas_empty_hint')}</span>
            </div>
          )}
        </div>

        {/* DENY COMMANDS SECTION */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 pt-3 border-t border-slate-800 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {t('puzzle_builder.deny_commands_title')}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => handleAddDenyCommand('[message] &cDeny command!')}
                className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 rounded transition"
              >
                {t('puzzle_builder.add_msg_btn')}
              </button>
              <button
                onClick={() => handleAddDenyCommand('[sound] BLOCK.NOTE_BLOCK.BASS')}
                className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded transition"
              >
                {t('puzzle_builder.add_sound_btn')}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            {denyCommands.map((cmd, idx) => {
              const isSound = cmd.trim().startsWith('[sound]');
              const soundId = isSound ? cmd.trim().slice(7).trim() : '';
              const zhName = isSound ? getSoundChineseName(soundId) : '';

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="text"
                      value={cmd}
                      onChange={(e) => handleUpdateDenyCommand(idx, e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg text-rose-300 focus:outline-none"
                    />

                    {isSound && (
                      <button
                        type="button"
                        onClick={() => setSoundTargetIdx(idx)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded text-xs font-bold transition flex items-center gap-1 shrink-0"
                      >
                        <Volume2 className="w-3 h-3" /> {t('action_flow.sound_picker_btn')}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteDenyCommand(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {isSound && soundId && (
                    <div className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 w-fit">
                      {t('puzzle_builder.sound_annotation')} {zhName || t('action_flow.custom_sound')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {soundTargetIdx !== null && (
        <SoundSearchModal
          onClose={() => setSoundTargetIdx(null)}
          onSelect={(soundId) => {
            handleUpdateDenyCommand(soundTargetIdx, `[sound] ${soundId}`);
            setSoundTargetIdx(null);
          }}
        />
      )}
    </div>
  );
}

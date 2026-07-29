import React, { useState } from 'react';
import { useI18n } from '../i18n';
import {
  Puzzle, Plus, Trash2, Key, DollarSign, Scale, AlertCircle, Layers, GripVertical, ArrowDown, Volume2
} from 'lucide-react';
import { getSoundChineseName } from '../utils/minecraftSounds';
import SoundSearchModal from './SoundSearchModal';

export default function RequirementPuzzleBuilder({ value, onChange }) {
  const { t } = useI18n();
  const [draggedType, setDraggedType] = useState(null);
  const [soundTargetIdx, setSoundTargetIdx] = useState(null);

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
    } else if (type === 'level_check') {
      nextReqs[`level_${randomId}`] = {
        type: '>=',
        input: '%player_level%',
        output: '10'
      };
    } else if (type === 'string_equals') {
      nextReqs[`group_${randomId}`] = {
        type: 'string equals',
        input: '%luckperms_primary_group_name%',
        output: 'vip'
      };
    }

    updateReq({
      ...viewReq,
      requirements: nextReqs
    });
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
      {/* Scratch Blocks Palette */}
      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
        <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
          <Puzzle className="w-3.5 h-3.5" /> {t('puzzle_builder.drag_hint')}
        </span>

        <div className="grid grid-cols-2 gap-1.5">
          <div
            draggable
            onDragStart={() => setDraggedType('has_permission')}
            onClick={() => handleAddBlock('has_permission')}
            className="cursor-grab active:cursor-grabbing p-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] rounded-lg transition flex items-center gap-1.5 shadow border-b-2 border-emerald-800"
          >
            <div className="w-2 h-3 bg-emerald-800 rounded-sm" />
            <Key className="w-3.5 h-3.5" />
            <span>{t('puzzle_builder.btn_perm')}</span>
          </div>

          <div
            draggable
            onDragStart={() => setDraggedType('has_money')}
            onClick={() => handleAddBlock('has_money')}
            className="cursor-grab active:cursor-grabbing p-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[11px] rounded-lg transition flex items-center gap-1.5 shadow border-b-2 border-cyan-800"
          >
            <div className="w-2 h-3 bg-cyan-800 rounded-sm" />
            <DollarSign className="w-3.5 h-3.5" />
            <span>{t('puzzle_builder.btn_money')}</span>
          </div>

          <div
            draggable
            onDragStart={() => setDraggedType('level_check')}
            onClick={() => handleAddBlock('level_check')}
            className="cursor-grab active:cursor-grabbing p-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[11px] rounded-lg transition flex items-center gap-1.5 shadow border-b-2 border-amber-800"
          >
            <div className="w-2 h-3 bg-amber-800 rounded-sm" />
            <Scale className="w-3.5 h-3.5" />
            <span>{t('puzzle_builder.btn_level')}</span>
          </div>

          <div
            draggable
            onDragStart={() => setDraggedType('string_equals')}
            onClick={() => handleAddBlock('string_equals')}
            className="cursor-grab active:cursor-grabbing p-2 bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-[11px] rounded-lg transition flex items-center gap-1.5 shadow border-b-2 border-purple-800"
          >
            <div className="w-2 h-3 bg-purple-800 rounded-sm" />
            <Layers className="w-3.5 h-3.5" />
            <span>{t('puzzle_builder.btn_group')}</span>
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
        className="p-3 bg-slate-950/70 border-2 border-dashed border-slate-800 rounded-xl min-h-[200px] max-h-[340px] overflow-y-auto space-y-0"
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
        <div className="pt-2 space-y-1">
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
                  <div className={`p-2.5 rounded-xl border-b-4 font-bold shadow-lg space-y-2 relative transition hover:scale-[1.01] ${bgClass}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <GripVertical className="w-3.5 h-3.5 opacity-70 cursor-grab" />
                        <span className="font-mono text-[11px] opacity-80">#{idx + 1} {reqKey}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteBlock(reqKey)}
                        className="p-1 hover:bg-black/20 rounded transition text-slate-950 hover:text-rose-950"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Editable Fields inside Scratch Block */}
                    {isPermission ? (
                      <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-lg">
                        <Key className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{t('puzzle_builder.perm_label')}</span>
                        <input
                          type="text"
                          value={rule.permission || ''}
                          onChange={(e) => handleUpdateBlockField(reqKey, 'permission', e.target.value)}
                          placeholder="deluxemenus.vip.use"
                          className="flex-1 px-2 py-0.5 text-xs font-mono bg-slate-950 text-emerald-300 rounded focus:outline-none"
                        />
                      </div>
                    ) : isMoney ? (
                      <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-lg">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{t('puzzle_builder.money_label')}</span>
                        <input
                          type="number"
                          value={rule.amount || 0}
                          onChange={(e) => handleUpdateBlockField(reqKey, 'amount', Number(e.target.value))}
                          placeholder="100"
                          className="w-28 px-2 py-0.5 text-xs font-mono bg-slate-950 text-cyan-300 rounded focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-black/20 p-1.5 rounded-lg">
                        <input
                          type="text"
                          value={rule.input || ''}
                          onChange={(e) => handleUpdateBlockField(reqKey, 'input', e.target.value)}
                          className="w-32 px-1.5 py-0.5 text-xs font-mono bg-slate-950 text-amber-300 rounded"
                        />
                        <select
                          value={rule.type || '==='}
                          onChange={(e) => handleUpdateBlockField(reqKey, 'type', e.target.value)}
                          className="px-1 py-0.5 text-xs font-mono bg-slate-900 text-slate-100 rounded border border-slate-700"
                        >
                          <option value="string equals">=== (string equals)</option>
                          <option value=">=">&gt;= (greater than or equal)</option>
                          <option value="<=">&lt;= (less than or equal)</option>
                          <option value="!=">!= (not equals)</option>
                        </select>
                        <input
                          type="text"
                          value={rule.output || ''}
                          onChange={(e) => handleUpdateBlockField(reqKey, 'output', e.target.value)}
                          className="flex-1 px-1.5 py-0.5 text-xs font-mono bg-slate-950 text-amber-300 rounded"
                        />
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
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {t('puzzle_builder.deny_commands_title')}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => handleAddDenyCommand('[message] &cDeny command!')}
                className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 rounded"
              >
                {t('puzzle_builder.add_msg_btn')}
              </button>
              <button
                onClick={() => handleAddDenyCommand('[sound] BLOCK.NOTE_BLOCK.BASS')}
                className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded"
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
                      className="p-1 text-slate-500 hover:text-rose-400"
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

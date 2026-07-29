import React, { useState } from 'react';
import { useI18n } from '../i18n';
import {
  Zap, Plus, Trash2, ArrowUp, ArrowDown, Terminal, DollarSign, Award, Volume2, MessageSquare, Globe, ArrowRightLeft, RefreshCw, Layers, LogOut, Check
} from 'lucide-react';
import { getSoundChineseName } from '../utils/minecraftSounds';
import SoundSearchModal from './SoundSearchModal';

const RAW_ACTION_TYPES = [
  { prefix: '[player]', key: 'player', icon: Terminal, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { prefix: '[console]', key: 'console', icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { prefix: '[message]', key: 'message', icon: MessageSquare, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  { prefix: '[broadcast]', key: 'broadcast', icon: Globe, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { prefix: '[sound]', key: 'sound', icon: Volume2, color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
  { prefix: '[takemoney]', key: 'takemoney', icon: DollarSign, color: 'text-green-400 bg-green-500/10 border-green-500/30' },
  { prefix: '[takeexp]', key: 'takeexp', icon: Award, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  { prefix: '[connect]', key: 'connect', icon: ArrowRightLeft, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  { prefix: '[refresh]', key: 'refresh', icon: RefreshCw, color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
  { prefix: '[close]', key: 'close', icon: LogOut, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' }
];

export default function ActionFlowBuilder({ commands = [], onChange }) {
  const { t } = useI18n();
  const [soundTargetIdx, setSoundTargetIdx] = useState(null);

  const getActionMeta = (cmdStr) => {
    const matched = RAW_ACTION_TYPES.find((a) => cmdStr.trim().startsWith(a.prefix));
    if (matched) {
      const content = cmdStr.trim().slice(matched.prefix.length).trim();
      return {
        ...matched,
        label: t(`action_flow.${matched.key}`),
        desc: t(`action_flow.${matched.key}_desc`),
        content
      };
    }
    return {
      prefix: '',
      label: 'Command',
      desc: 'Custom',
      icon: Terminal,
      color: 'text-slate-300 bg-slate-800 border-slate-700',
      content: cmdStr
    };
  };

  const handleAddAction = (prefix) => {
    const defaultContent = prefix === '[takemoney]' ? '100'
                         : prefix === '[message]' ? '&aSuccess!'
                         : prefix === '[sound]' ? 'ENTITY_PLAYER_LEVELUP'
                         : prefix === '[close]' ? ''
                         : 'spawn';

    const newCmd = prefix === '[close]' ? '[close]' : `${prefix} ${defaultContent}`;
    onChange([...commands, newCmd]);
  };

  const handleUpdateActionContent = (index, newContent, prefix) => {
    const nextCmds = [...commands];
    nextCmds[index] = prefix ? `${prefix} ${newContent}`.trim() : newContent;
    onChange(nextCmds);
  };

  const handleMoveAction = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= commands.length) return;
    const nextCmds = [...commands];
    const temp = nextCmds[index];
    nextCmds[index] = nextCmds[targetIdx];
    nextCmds[targetIdx] = temp;
    onChange(nextCmds);
  };

  const handleRemoveAction = (index) => {
    const nextCmds = [...commands];
    nextCmds.splice(index, 1);
    onChange(nextCmds);
  };

  return (
    <div className="space-y-3">
      {/* Quick Add Action Palette */}
      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
        <span className="text-[11px] text-teal-400 font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> {t('action_flow.add_step_hint')}
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {RAW_ACTION_TYPES.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.prefix}
                type="button"
                onClick={() => handleAddAction(action.prefix)}
                className={`p-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-95 ${action.color}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t(`action_flow.${action.key}`)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Sequence Card Chain */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {commands.length > 0 ? (
          commands.map((cmdStr, idx) => {
            const meta = getActionMeta(cmdStr);
            const Icon = meta.icon;

            return (
              <div
                key={idx}
                className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl shadow-md space-y-1.5 transition hover:border-slate-700 group"
              >
                {/* Step Header Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-950 px-2 py-0.5 rounded-md text-slate-400 border border-slate-800">
                      {t('action_flow.step_prefix')}{idx + 1}
                    </span>
                    <span className={`text-xs font-bold flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${meta.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {meta.label} ({meta.prefix || 'custom'})
                    </span>
                  </div>

                  {/* Move Up / Down & Delete Control Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveAction(idx, -1)}
                      className={`p-1 rounded transition ${
                        idx === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === commands.length - 1}
                      onClick={() => handleMoveAction(idx, 1)}
                      className={`p-1 rounded transition ${
                        idx === commands.length - 1 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveAction(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Input Field */}
                {meta.prefix !== '[close]' && meta.prefix !== '[refresh]' && (
                  <div className="space-y-1 pt-0.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={meta.content}
                        onChange={(e) => handleUpdateActionContent(idx, e.target.value, meta.prefix)}
                        placeholder={t('action_flow.input_placeholder', { label: meta.label })}
                        className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 focus:border-emerald-500 focus:outline-none"
                      />

                      {meta.prefix === '[sound]' && (
                        <button
                          type="button"
                          onClick={() => setSoundTargetIdx(idx)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-pink-300 border border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{t('action_flow.sound_picker_btn')}</span>
                        </button>
                      )}
                    </div>

                    {/* Chinese Sound Name Badge for [sound] */}
                    {meta.prefix === '[sound]' && meta.content && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20 w-fit">
                        <span>{t('action_flow.official_annotation')}</span>
                        <span>{getSoundChineseName(meta.content) || t('action_flow.custom_sound')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
            {t('action_flow.empty_hint')}
          </div>
        )}
      </div>

      {soundTargetIdx !== null && (
        <SoundSearchModal
          onClose={() => setSoundTargetIdx(null)}
          onSelect={(soundId) => {
            handleUpdateActionContent(soundTargetIdx, soundId, '[sound]');
            setSoundTargetIdx(null);
          }}
        />
      )}
    </div>
  );
}

import React from 'react';
import { useI18n } from '../i18n';
import { Code, CheckCircle, AlertTriangle } from 'lucide-react';

export default function YamlCodeEditor({ yamlText, onChangeYaml, error }) {
  const { t } = useI18n();

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col h-64">
      {/* Code Header */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">{t('code_editor.title')}</span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs">
          {error ? (
            <span className="flex items-center gap-1 text-rose-400 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" /> {t('code_editor.sync_error')}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> {t('code_editor.sync_success')}
            </span>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 relative">
        <textarea
          value={yamlText}
          onChange={(e) => onChangeYaml(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-4 font-mono text-xs text-emerald-300 bg-slate-950/90 focus:outline-none resize-none leading-relaxed selection:bg-emerald-500/30"
        ></textarea>
      </div>
    </div>
  );
}

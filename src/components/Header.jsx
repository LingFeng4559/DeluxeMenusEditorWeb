import React, { useState } from 'react';
import { useI18n } from '../i18n';
import { Globe, Download, Upload, Copy, Check, FileCode, PlusCircle, Sparkles, RotateCcw, RotateCw } from 'lucide-react';
import CustomLangModal from './CustomLangModal';
import { SAMPLE_MENU, SAMPLE_SHOP, SAMPLE_VIP } from '../samples/samples';

export default function Header({
  onImportYaml,
  onExportYaml,
  onLoadTemplate,
  currentYaml,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) {
  const { t, currentLang, setCurrentLang, availableLocales } = useI18n();
  const [copied, setCopied] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onImportYaml(event.target.result);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="navbar glass-header border-b border-slate-700/50 px-6 py-3.5 flex items-center justify-between shadow-xl sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-5.5 h-5.5 text-emerald-400" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            {t('app.title')}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {t('app.subtitle')}
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Undo / Redo Toolbar Buttons */}
        <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-lg p-0.5 shadow-inner">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title={t('header.undo')}
            className={`p-1.5 rounded transition flex items-center justify-center ${
              canUndo ? 'text-slate-200 hover:bg-slate-700 hover:text-emerald-400 cursor-pointer' : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            title={t('header.redo')}
            className={`p-1.5 rounded transition flex items-center justify-center ${
              canRedo ? 'text-slate-200 hover:bg-slate-700 hover:text-emerald-400 cursor-pointer' : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
        {/* Templates Selector */}
        <div className="relative group">
          <select
            onChange={(e) => {
              if (e.target.value === 'menu') onLoadTemplate(SAMPLE_MENU);
              if (e.target.value === 'shop') onLoadTemplate(SAMPLE_SHOP);
              if (e.target.value === 'vip') onLoadTemplate(SAMPLE_VIP);
              e.target.value = '';
            }}
            defaultValue=""
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-lg hover:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition cursor-pointer"
          >
            <option value="" disabled>{t('app.templates')}</option>
            <option value="menu">{t('header.sample_menu')}</option>
            <option value="shop">{t('header.sample_shop')}</option>
            <option value="vip">{t('header.sample_vip')}</option>
          </select>
        </div>

        {/* Import YAML */}
        <label className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg cursor-pointer transition shadow-sm">
          <Upload className="w-4 h-4 text-teal-400" />
          <span>{t('app.import_yaml')}</span>
          <input type="file" accept=".yml,.yaml" onChange={handleFileUpload} className="hidden" />
        </label>

        {/* Copy YAML */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition shadow-sm"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
          <span>{copied ? t('app.copied') : t('app.copy_yaml')}</span>
        </button>

        {/* Export YAML */}
        <button
          onClick={onExportYaml}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-lg shadow-lg shadow-emerald-500/20 transition transform active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{t('app.export_yaml')}</span>
        </button>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg p-1">
          <Globe className="w-4 h-4 text-emerald-400 ml-1.5" />
          <select
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value)}
            className="bg-transparent text-xs text-slate-200 font-medium px-2 py-1 focus:outline-none cursor-pointer"
          >
            {Object.entries(availableLocales).map(([code, item]) => (
              <option key={code} value={code} className="bg-slate-800 text-slate-200">
                {item.name} ({code})
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowLangModal(true)}
            title={t('app.add_language')}
            className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-emerald-400 transition"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showLangModal && <CustomLangModal onClose={() => setShowLangModal(false)} />}
    </header>
  );
}

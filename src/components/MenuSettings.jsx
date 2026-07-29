import React, { useState } from 'react';
import { useI18n } from '../i18n';
import { Settings, X, ShieldAlert, Sliders } from 'lucide-react';
import { parseMinecraftText } from '../utils/minecraftColors';
import RequirementPuzzleBuilder from './RequirementPuzzleBuilder';

export default function MenuSettings({ menu, onUpdateMenu, onClose }) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'open_requirement'

  const handleChange = (field, value) => {
    onUpdateMenu({
      ...menu,
      [field]: value
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">{t('menu_settings.title')}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-950 px-6 pt-3 border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab('basic')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'basic'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{t('menu_settings.tab_basic')}</span>
          </button>

          <button
            onClick={() => setActiveTab('open_requirement')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'open_requirement'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t('menu_settings.tab_open_req')}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[65vh]">
          {activeTab === 'basic' && (
            <>
              {/* Menu Title */}
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">{t('menu_settings.menu_title')}</label>
                <input
                  type="text"
                  value={menu.menu_title || ''}
                  onChange={(e) => handleChange('menu_title', e.target.value)}
                  placeholder="e.g. &6&lMain Menu"
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">{t('menu_settings.menu_title_hint')}</p>

                {/* Live Title Preview */}
                <div className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-sm shadow-inner">
                  {parseMinecraftText(menu.menu_title || '&7Menu').map((seg, idx) => (
                    <span key={idx} style={seg.style}>{seg.text}</span>
                  ))}
                </div>
              </div>

              {/* Open Command & Register Command */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 block mb-1 font-medium">{t('menu_settings.open_command')}</label>
                  <input
                    type="text"
                    value={menu.open_command || ''}
                    onChange={(e) => handleChange('open_command', e.target.value)}
                    placeholder="e.g. menu"
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
                    <span className="text-xs text-slate-300">{t('menu_settings.register_command')}</span>
                    <input
                      type="checkbox"
                      checked={menu.register_command !== false}
                      onChange={(e) => handleChange('register_command', e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Size & Inventory Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">{t('menu_settings.size')}</label>
                  <select
                    value={menu.size || 54}
                    onChange={(e) => handleChange('size', parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
                  >
                    <option value={9}>{t('menu_settings.size_1_row')}</option>
                    <option value={18}>{t('menu_settings.size_2_rows')}</option>
                    <option value={27}>{t('menu_settings.size_3_rows')}</option>
                    <option value={36}>{t('menu_settings.size_4_rows')}</option>
                    <option value={45}>{t('menu_settings.size_5_rows')}</option>
                    <option value={54}>{t('menu_settings.size_6_rows')}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">{t('menu_settings.inventory_type')}</label>
                  <select
                    value={menu.inventory_type || 'CHEST'}
                    onChange={(e) => handleChange('inventory_type', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
                  >
                    <option value="CHEST">{t('menu_settings.type_chest')}</option>
                    <option value="WORKBENCH">{t('menu_settings.type_workbench')}</option>
                    <option value="HOPPER">{t('menu_settings.type_hopper')}</option>
                    <option value="DISPENSER">{t('menu_settings.type_dropper')}</option>
                    <option value="ANVIL">{t('menu_settings.type_anvil')}</option>
                    <option value="FURNACE">{t('menu_settings.type_furnace')}</option>
                  </select>
                </div>
              </div>

              {/* Update Interval */}
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">{t('menu_settings.update_interval')}</label>
                <input
                  type="number"
                  value={menu.update_interval || 1}
                  onChange={(e) => handleChange('update_interval', parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {activeTab === 'open_requirement' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs leading-relaxed">
                {t('menu_settings.open_req_tip')}
              </div>

              <RequirementPuzzleBuilder
                value={menu.open_requirement}
                onChange={(nextOpenReqVal) => handleChange('open_requirement', nextOpenReqVal)}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition shadow"
          >
            {t('menu_settings.done_btn')}
          </button>
        </div>
      </div>
    </div>
  );
}

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
            <span>基本全域參數</span>
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
            <span>開啟條件 (open_requirement)</span>
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
                  placeholder="例如: &6&l菜單 或 <shift:-37><glyph:brgui1>&6菜單"
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
                    placeholder="例如: menu 或 cd"
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
                    <span className="text-xs text-slate-300">註冊主指令</span>
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
                    <option value={9}>9 (1 行)</option>
                    <option value={18}>18 (2 行)</option>
                    <option value={27}>27 (3 行)</option>
                    <option value={36}>36 (4 行)</option>
                    <option value={45}>45 (5 行)</option>
                    <option value={54}>54 (6 行 - 標準全頁)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">{t('menu_settings.inventory_type')}</label>
                  <select
                    value={menu.inventory_type || 'CHEST'}
                    onChange={(e) => handleChange('inventory_type', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
                  >
                    <option value="CHEST">CHEST (箱子)</option>
                    <option value="WORKBENCH">WORKBENCH (工作台)</option>
                    <option value="HOPPER">HOPPER (漏斗)</option>
                    <option value="DISPENSER">DISPENSER (發射器)</option>
                    <option value="ANVIL">ANVIL (鐵砧)</option>
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
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs">
                💡 <b>開啟條件 (open_requirement)</b>：當玩家嘗試輸入開啟指令 (如 <code>/{menu.open_command || 'menu'}</code>) 時，只有當滿足此處的 Scratch 積木條件時才允許打開 GUI 選單；否則將執行處罰/拒絕指令 (deny_commands)。
              </div>

              <RequirementPuzzleBuilder
                value={menu.open_requirement}
                onChange={(nextReq) => handleChange('open_requirement', nextReq)}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition shadow"
          >
            完成設定
          </button>
        </div>
      </div>
    </div>
  );
}

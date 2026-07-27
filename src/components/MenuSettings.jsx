import React from 'react';
import { useI18n } from '../i18n';
import { Settings, X } from 'lucide-react';
import { parseMinecraftText } from '../utils/minecraftColors';

export default function MenuSettings({ menu, onUpdateMenu, onClose }) {
  const { t } = useI18n();

  const handleChange = (field, value) => {
    onUpdateMenu({
      ...menu,
      [field]: value
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">{t('menu_settings.title')}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
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

          {/* Open Command */}
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">{t('menu_settings.open_command')}</label>
            <input
              type="text"
              value={menu.open_command || ''}
              onChange={(e) => handleChange('open_command', e.target.value)}
              placeholder="例如: menu 或 cd"
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
            />
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
        </div>

        <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition"
          >
            完成設定
          </button>
        </div>
      </div>
    </div>
  );
}

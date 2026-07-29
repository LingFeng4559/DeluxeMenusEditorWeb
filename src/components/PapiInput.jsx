import React, { useState, useRef } from 'react';
import { useI18n } from '../i18n';
import { Sparkles, HelpCircle } from 'lucide-react';

const RAW_PAPI_PLACEHOLDERS = [
  { placeholder: '%player_name%', category: 'Player', key: 'desc_player_name' },
  { placeholder: '%player_displayname%', category: 'Player', key: 'desc_player_displayname' },
  { placeholder: '%player_uuid%', category: 'Player', key: 'desc_player_uuid' },
  { placeholder: '%player_level%', category: 'Player', key: 'desc_player_level' },
  { placeholder: '%player_exp%', category: 'Player', key: 'desc_player_exp' },
  { placeholder: '%player_has_permission_<node>%', category: 'Permission', key: 'desc_perm_check' },
  { placeholder: '%vault_eco_balance%', category: 'Economy', key: 'desc_vault_eco' },
  { placeholder: '%vault_eco_balance_fixed%', category: 'Economy', key: 'desc_vault_eco_fixed' },
  { placeholder: '%vault_group%', category: 'Permission', key: 'desc_vault_group' },
  { placeholder: '%luckperms_primary_group_name%', category: 'LuckPerms', key: 'desc_luckperms_group' },
  { placeholder: '%luckperms_expiry_time_<permission>%', category: 'LuckPerms', key: 'desc_luckperms_expiry' },
  { placeholder: '%server_online%', category: 'Server', key: 'desc_server_online' },
  { placeholder: '%server_max_players%', category: 'Server', key: 'desc_server_max' },
  { placeholder: '%server_tps_1%', category: 'Server', key: 'desc_server_tps' }
];

export default function PapiInput({
  value,
  onChange,
  placeholder,
  className = '',
  multiline = false,
  rows = 3
}) {
  const { t } = useI18n();
  const [showPopup, setShowPopup] = useState(false);
  const [filterText, setFilterText] = useState('');
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    onChange(newVal);

    // Trigger popup if user types '%'
    const cursor = e.target.selectionStart;
    const textBeforeCursor = newVal.slice(0, cursor);
    const lastPercentIndex = textBeforeCursor.lastIndexOf('%');

    if (lastPercentIndex !== -1 && !textBeforeCursor.slice(lastPercentIndex + 1).includes(' ')) {
      setFilterText(textBeforeCursor.slice(lastPercentIndex + 1).toLowerCase());
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  const handleSelectPlaceholder = (ph) => {
    const inputEl = inputRef.current;
    if (!inputEl) return;

    const val = value || '';
    const cursor = inputEl.selectionStart;
    const textBeforeCursor = val.slice(0, cursor);
    const textAfterCursor = val.slice(cursor);
    const lastPercentIndex = textBeforeCursor.lastIndexOf('%');

    let updatedVal = '';
    if (lastPercentIndex !== -1) {
      updatedVal = val.slice(0, lastPercentIndex) + ph + textAfterCursor;
    } else {
      updatedVal = val + ph;
    }

    onChange(updatedVal);
    setShowPopup(false);

    setTimeout(() => {
      inputEl.focus();
    }, 50);
  };

  const filtered = RAW_PAPI_PLACEHOLDERS.filter((item) =>
    item.placeholder.toLowerCase().includes(filterText) ||
    t(`papi_input.${item.key}`).toLowerCase().includes(filterText)
  );

  return (
    <div className="relative w-full">
      {multiline ? (
        <textarea
          ref={inputRef}
          rows={rows}
          value={value || ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={className}
        />
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={value || ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={className}
        />
      )}

      {/* IntelliSense Autocomplete Dropdown Popup */}
      {showPopup && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-100 max-h-60 flex flex-col">
          <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {t('papi_input.title')}
            </span>
            <span className="text-[10px] text-slate-500 font-normal">{t('papi_input.click_hint')}</span>
          </div>

          <div className="overflow-y-auto p-1 space-y-0.5 flex-1">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item.placeholder}
                  onClick={() => handleSelectPlaceholder(item.placeholder)}
                  className="px-2.5 py-1.5 hover:bg-slate-800 rounded-lg cursor-pointer transition flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-300 group-hover:text-amber-200">
                      {item.placeholder}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {t(`papi_input.${item.key}`)}
                    </span>
                  </div>

                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {item.category}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-slate-500 text-xs">
                {t('papi_input.no_results')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

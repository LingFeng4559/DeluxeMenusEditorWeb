import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useI18n } from '../i18n';
import { getAllMinecraftItems } from '../utils/itemDatabase';
import ItemIcon from './ItemIcon';
import { X, Search, Box, Sparkles, Globe2, PlusCircle } from 'lucide-react';

// PERF-3: Custom debounce hook to avoid laggy search on every keystroke
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timerRef.current);
  }, [value, delay]);
  return debouncedValue;
}

export default function MaterialSearchModal({ onClose, onSelect }) {
  const { t, currentLang, availableLocales } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [customMaterial, setCustomMaterial] = useState('');

  // PERF-3: Debounce search input — only filter after 200ms of inactivity
  const debouncedSearch = useDebounce(searchTerm, 200);

  const activeLocaleData = availableLocales[currentLang]?.data || {};
  const customItemNames = activeLocaleData.item_names || {};

  // PERF-3: Build the full item list only once when lang/custom names change (not on every keystroke!)
  const allItems = useMemo(
    () => getAllMinecraftItems(currentLang, customItemNames),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLang, JSON.stringify(Object.keys(customItemNames))]
  );

  const rawQuery = debouncedSearch.trim().toUpperCase().replace(/\s+/g, '_');

  // PERF-3: Memoize filtered results — recalculate only when allItems or debouncedSearch changes
  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return allItems;
    return allItems.filter((item) => item.searchableText.includes(query));
  }, [allItems, debouncedSearch]);

  // Dynamic Item Fallback if search term doesn't exactly match any ID in database
  const hasExactMatch = filtered.some(i => i.id === rawQuery);

  const displayedItems = useMemo(() => {
    const list = [...filtered];
    if (rawQuery && !hasExactMatch && rawQuery.length >= 2) {
      list.unshift({
        id: rawQuery,
        name: rawQuery.replace(/_/g, ' '),
        zhName: `自訂/最新 Material (${rawQuery})`,
        localName: rawQuery,
        isDynamic: true
      });
    }
    return list.slice(0, 84);
  }, [filtered, rawQuery, hasExactMatch]);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customMaterial.trim()) {
      onSelect(customMaterial.trim().toUpperCase());
      onClose();
    }
  };

  const isZh = currentLang === 'zh_TW';

  const quickSearchTags = [
    { label: '小滴翠葉', keyword: 'SMALL_DRIPLEAF' },
    { label: '落葉堆', keyword: 'LEAF_LITTER' },
    { label: '仙人掌花', keyword: 'CACTUS_FLOWER' },
    { label: t('search_modal.tag_redstone_torch'), keyword: isZh ? '紅石火把' : 'REDSTONE_TORCH' },
    { label: t('search_modal.tag_diamond_sword'), keyword: isZh ? '鑽石劍' : 'DIAMOND_SWORD' },
    { label: t('search_modal.tag_clock'), keyword: isZh ? '時鐘' : 'CLOCK' },
    { label: t('search_modal.tag_chest'), keyword: isZh ? '箱子' : 'CHEST' },
    { label: t('search_modal.tag_oak_sign'), keyword: isZh ? '告示牌' : 'SIGN' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Box className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              {t('search_modal.title')}
              <span className="text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-normal px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-cyan-400" /> {t('search_modal.builtin_dict_tip')}
              </span>
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Custom Input Bar */}
        <div className="p-6 border-b border-slate-800/80 space-y-3 bg-slate-900/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t('search_modal.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Quick Search Tag Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium mr-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> {t('search_modal.popular_tags')}
            </span>
            {quickSearchTags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setSearchTerm(tag.keyword)}
                className="px-2.5 py-0.5 text-[11px] bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700/80 rounded-lg transition"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Custom Head / Custom Material Input */}
          <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder={t('search_modal.custom_placeholder')}
              value={customMaterial}
              onChange={(e) => setCustomMaterial(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition"
            >
              {t('search_modal.use_custom')}
            </button>
          </form>
        </div>

        {/* Materials Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[45vh]">
          {displayedItems.length > 0 ? (
            displayedItems.map((mat) => (
              <button
                key={mat.id}
                onClick={() => {
                  onSelect(mat.id);
                  onClose();
                }}
                className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1.5 transition text-center group ${
                  mat.isDynamic
                    ? 'bg-emerald-500/10 border-emerald-500/50 hover:bg-emerald-500/20'
                    : 'bg-slate-800/60 hover:bg-slate-700/80 border-slate-700/60 hover:border-emerald-500/50'
                }`}
              >
                <ItemIcon material={mat.id} className="w-8 h-8" />
                <span className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 truncate w-full flex items-center justify-center gap-1">
                  {mat.isDynamic && <PlusCircle className="w-3 h-3 text-emerald-400" />}
                  {mat.localName || mat.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 truncate w-full">{mat.id}</span>
              </button>
            ))
          ) : (
            <div className="col-span-4 text-center py-8 text-slate-500 text-xs">
              {t('search_modal.no_results', { term: searchTerm })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

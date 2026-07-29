import React, { useState, useMemo } from 'react';
import { MINECRAFT_SOUNDS, playSynthesizedSound } from '../utils/minecraftSounds';
import { Volume2, Search, X, Check, Play, Sparkles } from 'lucide-react';

export default function SoundSearchModal({ onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = useMemo(() => {
    const set = new Set(MINECRAFT_SOUNDS.map((s) => s.category));
    return ['ALL', ...Array.from(set)];
  }, []);

  const filteredSounds = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MINECRAFT_SOUNDS.filter((sound) => {
      const matchCat = selectedCategory === 'ALL' || sound.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;

      return (
        sound.id.toLowerCase().includes(q) ||
        sound.name.toLowerCase().includes(q) ||
        sound.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Minecraft 繁體中文音效庫 (Sound Picker)
              </h3>
              <p className="text-xs text-slate-400">支援中文搜尋 (如: 村民、生氣、升級) 與線上試聽</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋中文說明、標籤 (如: 村民生氣, 升級) 或英文 ID..."
              className="w-full pl-10 pr-4 py-2 text-xs font-mono bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-pink-500 shadow-inner"
              autoFocus
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
                  selectedCategory === cat
                    ? 'bg-pink-500 text-slate-950 border-pink-400 shadow'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {cat === 'ALL' ? '全部類別' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sound List Container */}
        <div className="p-4 flex-1 overflow-y-auto max-h-[50vh] grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredSounds.length > 0 ? (
            filteredSounds.map((sound) => (
              <div
                key={sound.id}
                className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl hover:border-pink-500/50 transition flex flex-col justify-between gap-2 shadow group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-pink-300 group-hover:text-pink-200 flex items-center gap-1.5">
                      <span>{sound.name}</span>
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-slate-400 block mt-0.5">
                      {sound.id}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {sound.category}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <button
                    type="button"
                    onClick={() => playSynthesizedSound(sound.id)}
                    className="px-2.5 py-1 text-[11px] font-bold bg-slate-800 hover:bg-pink-500/20 text-pink-300 border border-slate-700 hover:border-pink-500/40 rounded-lg transition flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-pink-400 text-pink-400" />
                    <span>試聽音效</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelect(sound.id)}
                    className="px-3 py-1 text-[11px] font-bold bg-pink-500 hover:bg-pink-400 text-slate-950 rounded-lg transition flex items-center gap-1 shadow"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>選用</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-10 text-center text-slate-500 text-xs">
              無匹配的音效，請嘗試搜尋別的關鍵字或切換類別
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

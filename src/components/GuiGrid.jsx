import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useI18n } from '../i18n';
import { parseMinecraftText } from '../utils/minecraftColors';
import ItemIcon from './ItemIcon';
import { Layers, Info, Sparkles, Copy, Scissors, Clipboard, Trash2, Move, Edit3, Check } from 'lucide-react';
import LorePreview from './LorePreview';

export default function GuiGrid({
  menu,
  selectedSlot,
  selectedSlots,
  activePriorityMap,
  clipboardItem,
  onSelectSlot,
  onMultiSelectSlot,
  onClearSelection,
  onSelectPriorityItem,
  onMoveOrSwapSlot,
  onDeleteSlotItems,
  onCopySlotItem,
  onCutSlotItem,
  onPasteItemToSlot,
  onUpdateMenuTitle
}) {
  const { t } = useI18n();
  const [hoveredSlotData, setHoveredSlotData] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [useClassicTheme, setUseClassicTheme] = useState(true);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  // Direct Inline Editing state for menu_title
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(menu.menu_title || menu.title || 'Chest');

  // Context Menu state { x, y, slotIndex }
  const [contextMenu, setContextMenu] = useState(null);

  // Trash Zone Drag-Over state
  const [isDragOverTrash, setIsDragOverTrash] = useState(false);

  const size = Math.max(9, Math.min(54, Number(menu.size) || 54));
  const slotArray = Array.from({ length: size }, (_, i) => i);

  // Sync titleInput when menu.menu_title changes
  useEffect(() => {
    setTitleInput(menu.menu_title || menu.title || 'Chest');
  }, [menu.menu_title, menu.title]);

  const handleCommitTitle = () => {
    setIsEditingTitle(false);
    if (onUpdateMenuTitle) {
      onUpdateMenuTitle(titleInput);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommitTitle();
    }
  };

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const getItemsAtSlot = (slotIndex) => {
    if (!menu.items) return [];
    const items = [];
    for (const [key, item] of Object.entries(menu.items)) {
      if (!item) continue;
      if (item.slot === slotIndex) {
        items.push({ key, ...item });
      } else if (Array.isArray(item.slots) && item.slots.includes(slotIndex)) {
        items.push({ key, ...item });
      }
    }
    items.sort((a, b) => (a.priority || 999) - (b.priority || 999));
    return items;
  };

  const handleSlotClick = (e, slotIndex) => {
    setContextMenu(null);
    if (e.shiftKey) {
      onMultiSelectSlot(slotIndex);
    } else {
      onSelectSlot(slotIndex);
    }
  };

  const handleContextMenu = (e, slotIndex) => {
    e.preventDefault();
    e.stopPropagation();
    setHoveredSlotData(null);
    onSelectSlot(slotIndex);

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      slotIndex
    });
  };

  const handleSlotHover = (e, slotIndex) => {
    if (contextMenu) {
      setHoveredSlotData(null);
      return;
    }

    setMousePos({ x: e.clientX, y: e.clientY });
    const allItems = getItemsAtSlot(slotIndex);
    const activeIdx = activePriorityMap[slotIndex] || 0;

    if (allItems.length > 0) {
      setHoveredSlotData({
        slotIndex,
        items: allItems,
        activeIdx
      });
    } else {
      setHoveredSlotData(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredSlotData(null);
  };

  const handleDragStart = (e, slotIndex) => {
    e.dataTransfer.setData('text/plain', String(slotIndex));
    e.dataTransfer.effectAllowed = 'move';
    setContextMenu(null);
    setHoveredSlotData(null);
  };

  const handleDragOver = (e, slotIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSlot !== slotIndex) {
      setDragOverSlot(slotIndex);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverSlot(null);
  };

  const handleDropSlot = (e, targetSlotIndex) => {
    e.preventDefault();
    setDragOverSlot(null);
    const sourceSlotStr = e.dataTransfer.getData('text/plain');
    if (sourceSlotStr !== '') {
      const sourceSlotIndex = parseInt(sourceSlotStr);
      if (!isNaN(sourceSlotIndex)) {
        onMoveOrSwapSlot(sourceSlotIndex, targetSlotIndex);
      }
    }
  };

  const handleTrashDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOverTrash) setIsDragOverTrash(true);
  };

  const handleTrashDragLeave = (e) => {
    e.preventDefault();
    setIsDragOverTrash(false);
  };

  const handleTrashDrop = (e) => {
    e.preventDefault();
    setIsDragOverTrash(false);
    const sourceSlotStr = e.dataTransfer.getData('text/plain');
    if (sourceSlotStr !== '') {
      const sourceSlotIndex = parseInt(sourceSlotStr);
      if (!isNaN(sourceSlotIndex)) {
        onDeleteSlotItems(sourceSlotIndex);
      }
    }
  };

  const renderContextMenuPortal = () => {
    if (!contextMenu) return null;

    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

    const menuWidth = 160;
    const menuHeight = 170;

    let posX = contextMenu.x;
    let posY = contextMenu.y;

    if (posX + menuWidth > viewportWidth - 10) {
      posX = contextMenu.x - menuWidth;
    }

    if (posY + menuHeight > viewportHeight - 10) {
      posY = contextMenu.y - menuHeight;
    }

    posX = Math.max(10, Math.min(posX, viewportWidth - menuWidth - 10));
    posY = Math.max(10, Math.min(posY, viewportHeight - menuHeight - 10));

    return ReactDOM.createPortal(
      <div
        style={{ top: `${posY}px`, left: `${posX}px` }}
        className="fixed z-[9999999] bg-slate-900 border-2 border-slate-700/90 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] py-1.5 min-w-[160px] text-xs font-mono backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 select-none"
      >
        <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 mb-1">
          Slot #{contextMenu.slotIndex} {t('gui_grid.context_options')}
        </div>

        <button
          onClick={() => {
            onCopySlotItem(contextMenu.slotIndex);
            setContextMenu(null);
          }}
          className="w-full px-3 py-1.5 text-left text-slate-200 hover:bg-emerald-500/20 hover:text-emerald-300 flex items-center gap-2 transition"
        >
          <Copy className="w-3.5 h-3.5 text-emerald-400" /> {t('gui_grid.context_copy')}
        </button>

        <button
          onClick={() => {
            onCutSlotItem(contextMenu.slotIndex);
            setContextMenu(null);
          }}
          className="w-full px-3 py-1.5 text-left text-slate-200 hover:bg-amber-500/20 hover:text-amber-300 flex items-center gap-2 transition"
        >
          <Scissors className="w-3.5 h-3.5 text-amber-400" /> {t('gui_grid.context_cut')}
        </button>

        <button
          onClick={() => {
            onPasteItemToSlot(contextMenu.slotIndex);
            setContextMenu(null);
          }}
          disabled={!clipboardItem}
          className={`w-full px-3 py-1.5 text-left flex items-center gap-2 transition ${
            clipboardItem
              ? 'text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300'
              : 'text-slate-600 cursor-not-allowed'
          }`}
        >
          <Clipboard className="w-3.5 h-3.5 text-cyan-400" /> {t('gui_grid.context_paste')}
        </button>

        <div className="border-t border-slate-800 my-1"></div>

        <button
          onClick={() => {
            onDeleteSlotItems(contextMenu.slotIndex);
            setContextMenu(null);
          }}
          className="w-full px-3 py-1.5 text-left text-rose-400 hover:bg-rose-500/20 flex items-center gap-2 transition font-bold"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" /> {t('gui_grid.context_delete')}
        </button>
      </div>,
      document.body
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900/60 rounded-2xl border border-slate-800/80 p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Grid Top Toolbar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              {t('gui_grid.title')}
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                {size} {t('gui_grid.slot')}s
              </span>
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Move className="w-3.5 h-3.5 text-cyan-400" />
              {t('gui_grid.drag_hint')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <button
            onClick={() => setUseClassicTheme(!useClassicTheme)}
            className="px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {useClassicTheme ? t('gui_grid.switch_dark_ui') : t('gui_grid.switch_mc_gui')}
          </button>

          {selectedSlots.length > 1 && (
            <button
              onClick={onClearSelection}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
            >
              {t('gui_grid.clear_selection')} ({selectedSlots.length})
            </button>
          )}
        </div>
      </div>

      {/* Main GUI Render Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 gap-4">
        {useClassicTheme ? (
          /* 100% AUTHENTIC MINECRAFT GUI CHEST CONTAINER */
          <div className="bg-[#c6c6c6] border-4 border-t-[#ffffff] border-l-[#ffffff] border-r-[#555555] border-b-[#555555] p-3 shadow-2xl font-mono select-none max-w-full overflow-x-auto rounded-sm">
            {/* Direct Interactive Title Header */}
            <div className="mb-2 px-1 text-[#404040] font-bold text-sm leading-tight flex items-center justify-between">
              <div className="flex items-center gap-1.5 relative group">
                {isEditingTitle ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      onBlur={handleCommitTitle}
                      onKeyDown={handleTitleKeyDown}
                      autoFocus
                      placeholder="e.g. &6&l選單主介面"
                      className="px-2 py-0.5 text-xs font-mono bg-slate-900 text-amber-300 border border-amber-500/80 rounded focus:outline-none shadow-inner min-w-[200px]"
                    />
                    <button
                      onClick={handleCommitTitle}
                      title="確定修改標題"
                      className="p-1 bg-emerald-500 text-slate-950 rounded hover:bg-emerald-400 transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsEditingTitle(true)}
                    title="點擊直接原地修改選單標題 (menu_title)"
                    className="flex items-center gap-1.5 cursor-pointer px-1 py-0.5 rounded hover:bg-[#b0b0b0]/50 transition group/title border border-transparent hover:border-[#8b8b8b]"
                  >
                    <div className="flex items-center gap-1">
                      {parseMinecraftText(menu.menu_title || menu.title || 'Chest').map((seg, idx) => (
                        <span key={idx} style={seg.style} className="drop-shadow-none">
                          {seg.text}
                        </span>
                      ))}
                    </div>
                    <Edit3 className="w-3.5 h-3.5 text-[#555555] opacity-50 group-hover/title:opacity-100 transition" />
                  </div>
                )}
              </div>

              <span className="text-[10px] text-[#555555] font-normal">
                open: /{menu.open_command || 'menu'}
              </span>
            </div>

            {/* 9x6 Authentic Minecraft Slot Grid */}
            <div className="grid grid-cols-9 gap-1 bg-[#8b8b8b] p-1 border-2 border-t-[#373737] border-l-[#373737] border-r-[#ffffff] border-b-[#ffffff]">
              {slotArray.map((slotIndex) => {
                const allSlotItems = getItemsAtSlot(slotIndex);
                const activeVariantIdx = activePriorityMap[slotIndex] || 0;
                const currentActiveItem = allSlotItems[activeVariantIdx] || allSlotItems[0] || null;
                const isSelected = selectedSlots.includes(slotIndex);
                const isDragTarget = dragOverSlot === slotIndex;

                return (
                  <button
                    key={slotIndex}
                    draggable={!!currentActiveItem}
                    onDragStart={(e) => handleDragStart(e, slotIndex)}
                    onDragOver={(e) => handleDragOver(e, slotIndex)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDropSlot(e, slotIndex)}
                    onClick={(e) => handleSlotClick(e, slotIndex)}
                    onContextMenu={(e) => handleContextMenu(e, slotIndex)}
                    onMouseEnter={(e) => handleSlotHover(e, slotIndex)}
                    onMouseMove={(e) => handleSlotHover(e, slotIndex)}
                    onMouseLeave={handleMouseLeave}
                    className={`w-12 h-12 relative flex items-center justify-center bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-r-[#ffffff] border-b-[#ffffff] hover:bg-[#a0a0a0] transition-colors group cursor-grab active:cursor-grabbing ${
                      isDragTarget
                        ? 'ring-4 ring-amber-400 bg-amber-200/50 scale-110 z-30'
                        : isSelected
                        ? 'ring-2 ring-emerald-500 bg-[#a8a8a8] z-10'
                        : ''
                    }`}
                  >
                    <span className="absolute top-0.5 left-1 text-[9px] font-mono text-[#555555] opacity-70 pointer-events-none">
                      {slotIndex}
                    </span>

                    {allSlotItems.length > 1 && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextVariantIdx = (activeVariantIdx + 1) % allSlotItems.length;
                          onSelectPriorityItem(slotIndex, nextVariantIdx);
                        }}
                        title={t('gui_grid.variant_switch_tooltip', { count: allSlotItems.length })}
                        className="absolute top-0.5 right-0.5 text-[8px] font-mono font-bold bg-amber-500 text-slate-950 px-1 rounded-none shadow cursor-pointer z-20"
                      >
                        P{activeVariantIdx + 1}/{allSlotItems.length}
                      </span>
                    )}

                    {currentActiveItem && (
                      <div className="relative flex items-center justify-center w-full h-full p-1.5 pointer-events-none">
                        <ItemIcon material={currentActiveItem.material} className="w-8 h-8" />
                        {currentActiveItem.amount > 1 && (
                          <span className="absolute bottom-0.5 right-1 font-mono text-[11px] font-extrabold text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                            {currentActiveItem.amount}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* MODERN DARK GLASS GUI THEME */
          <div className="grid grid-cols-9 gap-2 max-w-full overflow-x-auto p-4 bg-[#c6c6c6]/10 border-4 border-[#373737]/60 rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md">
            {slotArray.map((slotIndex) => {
              const allSlotItems = getItemsAtSlot(slotIndex);
              const activeVariantIdx = activePriorityMap[slotIndex] || 0;
              const currentActiveItem = allSlotItems[activeVariantIdx] || allSlotItems[0] || null;
              const isSelected = selectedSlots.includes(slotIndex);
              const isDragTarget = dragOverSlot === slotIndex;

              return (
                <button
                  key={slotIndex}
                  draggable={!!currentActiveItem}
                  onDragStart={(e) => handleDragStart(e, slotIndex)}
                  onDragOver={(e) => handleDragOver(e, slotIndex)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDropSlot(e, slotIndex)}
                  onClick={(e) => handleSlotClick(e, slotIndex)}
                  onContextMenu={(e) => handleContextMenu(e, slotIndex)}
                  onMouseEnter={(e) => handleSlotHover(e, slotIndex)}
                  onMouseMove={(e) => handleSlotHover(e, slotIndex)}
                  onMouseLeave={handleMouseLeave}
                  className={`w-14 h-14 relative flex flex-col items-center justify-center rounded-lg transition-all duration-100 select-none group cursor-grab active:cursor-grabbing ${
                    isDragTarget
                      ? 'ring-4 ring-amber-400 bg-amber-500/30 scale-110 z-30'
                      : isSelected
                      ? 'bg-[#8b8b8b]/60 border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)] ring-2 ring-emerald-500/40 z-10 scale-105'
                      : 'bg-[#8b8b8b]/20 hover:bg-[#8b8b8b]/50 border-2 border-t-[#373737] border-l-[#373737] border-r-[#ffffff]/40 border-b-[#ffffff]/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.7)] hover:border-white/80'
                  }`}
                >
                  <span className="absolute top-1 left-1 text-[10px] font-mono text-slate-400 font-bold opacity-80 pointer-events-none drop-shadow">
                    {slotIndex}
                  </span>

                  {allSlotItems.length > 1 && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextVariantIdx = (activeVariantIdx + 1) % allSlotItems.length;
                        onSelectPriorityItem(slotIndex, nextVariantIdx);
                      }}
                      title={t('gui_grid.variant_switch_tooltip', { count: allSlotItems.length })}
                      className="absolute top-1 right-1 text-[9px] font-mono font-extrabold bg-amber-500 text-slate-950 px-1 rounded-sm shadow-md cursor-pointer hover:bg-amber-400 hover:scale-110 transition z-20 flex items-center gap-0.5"
                    >
                      P{activeVariantIdx + 1}/{allSlotItems.length}
                    </span>
                  )}

                  {currentActiveItem ? (
                    <div className="relative flex items-center justify-center w-full h-full p-2 pointer-events-none">
                      <ItemIcon material={currentActiveItem.material} className="w-8 h-8" />
                      {currentActiveItem.amount > 1 && (
                        <span className="absolute bottom-1 right-1 font-mono text-xs font-extrabold text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
                          {currentActiveItem.amount}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-20 transition">
                      <div className="w-4 h-4 rounded border border-dashed border-slate-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 🗑️ Trash Can Drop Zone */}
        <div
          onDragOver={handleTrashDragOver}
          onDragLeave={handleTrashDragLeave}
          onDrop={handleTrashDrop}
          className={`w-full max-w-md py-2.5 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all duration-200 ${
            isDragOverTrash
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 scale-105 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
              : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:border-slate-700'
          }`}
        >
          <Trash2 className={`w-4 h-4 ${isDragOverTrash ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
          <span className="text-xs font-bold tracking-wide">
            {isDragOverTrash ? t('gui_grid.trash_release') : t('gui_grid.trash_hint')}
          </span>
        </div>
      </div>

      {/* Render Context Menu Portal to document.body */}
      {renderContextMenuPortal()}

      {/* Real-time Hover Lore Preview Overlay */}
      {!contextMenu && hoveredSlotData && (
        <LorePreview
          slotData={hoveredSlotData}
          position={mousePos}
        />
      )}
    </div>
  );
}

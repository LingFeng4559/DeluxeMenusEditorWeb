import React, { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './i18n';
import Header from './components/Header';
import GuiGrid from './components/GuiGrid';
import ItemEditor from './components/ItemEditor';
import MenuSettings from './components/MenuSettings';
import YamlCodeEditor from './components/YamlCodeEditor';
import { parseYamlToMenu, dumpMenuToYaml, DEFAULT_MENU } from './utils/yamlParser';
import { clearTextureCache } from './utils/textureCache';
import { Settings, UploadCloud, AlertTriangle } from 'lucide-react';

function AppContent() {
  const { t, addCustomLanguage } = useI18n();

  // Core State
  const [menu, setMenu] = useState(DEFAULT_MENU);
  const [yamlText, setYamlText] = useState(() => dumpMenuToYaml(DEFAULT_MENU));
  const [yamlError, setYamlError] = useState(null);

  // Track if user has modified the data
  const [isDirty, setIsDirty] = useState(false);

  // Drag and Drop Fullscreen Overlay state
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Slot selections
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState([0]);

  // Priority Variant Index Map for each slot
  const [activePriorityMap, setActivePriorityMap] = useState({});

  // Internal Clipboard for Copy, Cut & Paste Items
  const [clipboardItem, setClipboardItem] = useState(null);

  // Modals
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Background Automatic Silent Asset & i18n Sync on App Launch
  useEffect(() => {
    const silentAutoSync = async () => {
      try {
        const LOCALES = [
          { code: 'zh_tw', name: '繁體中文' },
          { code: 'zh_cn', name: '簡體中文' },
          { code: 'ja_jp', name: '日本語' },
          { code: 'en_us', name: 'English' }
        ];

        for (const { code, name } of LOCALES) {
          const url = `https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.4/assets/minecraft/lang/${code}.json`;
          const res = await fetch(url);
          if (res.ok) {
            const txt = await res.text();
            const clean = txt.replace(/^\uFEFF/, '').trim();
            const data = JSON.parse(clean);

            const itemDict = {};
            for (const [k, v] of Object.entries(data)) {
              if (k.startsWith('item.minecraft.') || k.startsWith('block.minecraft.')) {
                const matKey = k.replace('item.minecraft.', '').replace('block.minecraft.', '').toUpperCase();
                itemDict[matKey] = v;
              }
            }

            addCustomLanguage(code, name, { item_names: itemDict });
          }
        }
      } catch (e) {}
    };

    silentAutoSync();
  }, []);

  // Sync menu state to YAML text
  const updateMenuState = (newMenu, markAsDirty = true) => {
    setMenu(newMenu);
    const newYaml = dumpMenuToYaml(newMenu);
    setYamlText(newYaml);
    setYamlError(null);
    if (markAsDirty) setIsDirty(true);
  };

  // Direct Inline Update for menu_title
  const handleUpdateMenuTitle = (newTitle) => {
    updateMenuState({
      ...menu,
      menu_title: newTitle
    });
  };

  // Sync YAML text to menu state
  const handleYamlChange = (newYamlText, markAsDirty = true) => {
    setYamlText(newYamlText);
    const { menu: parsedMenu, error } = parseYamlToMenu(newYamlText);
    if (error) {
      setYamlError(error);
    } else if (parsedMenu) {
      setMenu(parsedMenu);
      setYamlError(null);
    }
    if (markAsDirty) setIsDirty(true);
  };

  // Global Drag & Drop Handlers for YAML files
  useEffect(() => {
    const handleDragOver = (e) => {
      if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
        e.preventDefault();
        e.stopPropagation();
        if (!isDraggingFile) setIsDraggingFile(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.clientX === 0 && e.clientY === 0) {
        setIsDraggingFile(false);
      }
    };

    const handleDrop = (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingFile(false);

        const file = e.dataTransfer.files[0];
        if (file.name.endsWith('.yml') || file.name.endsWith('.yaml')) {
          if (isDirty) {
            alert('⚠️ 當前選單資料已有未儲存的修改！為了防止資料被意外覆蓋，無法直接拖放載入。請先匯出或重新整理。');
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            handleYamlChange(event.target.result, false);
            setIsDirty(false);
          };
          reader.readAsText(file);
        } else {
          alert('請拖放有效的 .yml 或 .yaml 檔案！');
        }
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [isDirty, isDraggingFile]);

  // Handle Slot Move or Swap Item
  const handleMoveOrSwapSlot = (sourceSlot, targetSlot) => {
    if (sourceSlot === targetSlot || !menu.items) return;

    const nextItems = { ...menu.items };

    Object.entries(nextItems).forEach(([key, item]) => {
      if (!item) return;

      if (item.slot === sourceSlot) {
        nextItems[key] = { ...item, slot: targetSlot };
      } else if (item.slot === targetSlot) {
        nextItems[key] = { ...item, slot: sourceSlot };
      }

      if (Array.isArray(item.slots)) {
        const newSlots = item.slots.map((s) => {
          if (s === sourceSlot) return targetSlot;
          if (s === targetSlot) return sourceSlot;
          return s;
        });
        nextItems[key] = { ...item, slots: newSlots };
      }
    });

    updateMenuState({
      ...menu,
      items: nextItems
    });

    setSelectedSlot(targetSlot);
    setSelectedSlots([targetSlot]);
  };

  // Delete all items at a specific slot
  const handleDeleteSlotItems = (slotIdx) => {
    if (!menu.items) return;
    const nextItems = { ...menu.items };
    let deletedCount = 0;

    Object.entries(nextItems).forEach(([key, item]) => {
      if (!item) return;
      if (item.slot === slotIdx) {
        delete nextItems[key];
        deletedCount++;
      } else if (Array.isArray(item.slots) && item.slots.includes(slotIdx)) {
        if (item.slots.length === 1) {
          delete nextItems[key];
          deletedCount++;
        } else {
          nextItems[key] = {
            ...item,
            slots: item.slots.filter((s) => s !== slotIdx)
          };
          deletedCount++;
        }
      }
    });

    if (deletedCount > 0) {
      updateMenuState({
        ...menu,
        items: nextItems
      });
    }
  };

  // Copy Item from slot
  const handleCopySlotItem = (slotIdx) => {
    const variants = getSlotVariants(slotIdx);
    const activeIdx = activePriorityMap[slotIdx] || 0;
    const currentItem = variants[activeIdx] || variants[0];
    if (currentItem) {
      setClipboardItem({ ...currentItem });
    }
  };

  // Cut Item from slot
  const handleCutSlotItem = (slotIdx) => {
    handleCopySlotItem(slotIdx);
    handleDeleteSlotItems(slotIdx);
  };

  // Paste Item into slot
  const handlePasteItemToSlot = (targetSlotIdx) => {
    if (!clipboardItem) return;
    const newKey = `item_slot_${targetSlotIdx}_${Date.now().toString().slice(-4)}`;
    const { slot, slots, ...rest } = clipboardItem;
    const pastedItem = {
      ...rest,
      slot: targetSlotIdx
    };

    updateMenuState({
      ...menu,
      items: {
        ...(menu.items || {}),
        [newKey]: pastedItem
      }
    });

    setSelectedSlot(targetSlotIdx);
    setSelectedSlots([targetSlotIdx]);
  };

  const handleSelectSlot = (slotIndex) => {
    setSelectedSlot(slotIndex);
    setSelectedSlots([slotIndex]);
  };

  const handleMultiSelectSlot = (slotIndex) => {
    setSelectedSlots((prev) => {
      if (prev.includes(slotIndex)) {
        const next = prev.filter((s) => s !== slotIndex);
        return next.length > 0 ? next : [slotIndex];
      } else {
        return [...prev, slotIndex];
      }
    });
    setSelectedSlot(slotIndex);
  };

  const handleClearSelection = () => {
    setSelectedSlots([selectedSlot]);
  };

  const getSlotVariants = (slotIdx) => {
    if (!menu.items) return [];
    const list = [];
    for (const [key, item] of Object.entries(menu.items)) {
      if (!item) continue;
      if (item.slot === slotIdx || (Array.isArray(item.slots) && item.slots.includes(slotIdx))) {
        list.push({ key, ...item });
      }
    }
    list.sort((a, b) => (a.priority || 999) - (b.priority || 999));
    return list;
  };

  const slotVariants = getSlotVariants(selectedSlot);
  const activeVariantIndex = activePriorityMap[selectedSlot] || 0;

  const currentVariant = slotVariants[activeVariantIndex] || slotVariants[0] || null;
  const currentItemKey = currentVariant ? currentVariant.key : null;
  const currentItem = currentVariant;

  const handleSelectPriorityItem = (slotIdx, variantIdx) => {
    setActivePriorityMap((prev) => ({
      ...prev,
      [slotIdx]: variantIdx
    }));
  };

  const handleAddPriorityVariant = () => {
    const nextPriority = (slotVariants.length > 0 ? (slotVariants[slotVariants.length - 1].priority || 1) + 1 : 1);
    const newKey = `item_slot_${selectedSlot}_p${nextPriority}`;

    const newItem = {
      material: 'LIME_STAINED_GLASS_PANE',
      slot: selectedSlot,
      priority: nextPriority,
      display_name: `&aNew P${nextPriority} Item`,
      view_requirement: {
        requirements: {
          custom_permission: {
            type: 'string equals',
            input: `%player_has_permission_group.level${nextPriority}%`,
            output: 'yes'
          }
        }
      }
    };

    updateMenuState({
      ...menu,
      items: {
        ...(menu.items || {}),
        [newKey]: newItem
      }
    });

    handleSelectPriorityItem(selectedSlot, slotVariants.length);
  };

  const handleUpdateVariantItem = (targetKey, updatedItem, newKeyName = null) => {
    if (!targetKey || !menu.items) return;
    const nextItems = { ...menu.items };

    if (newKeyName && newKeyName !== targetKey) {
      delete nextItems[targetKey];
      nextItems[newKeyName] = updatedItem;
    } else {
      nextItems[targetKey] = updatedItem;
    }

    updateMenuState({
      ...menu,
      items: nextItems
    });

    if (updatedItem.slot !== undefined && updatedItem.slot !== selectedSlot) {
      setSelectedSlot(updatedItem.slot);
      setSelectedSlots([updatedItem.slot]);
    } else if (Array.isArray(updatedItem.slots) && updatedItem.slots.length > 0 && !updatedItem.slots.includes(selectedSlot)) {
      setSelectedSlot(updatedItem.slots[0]);
      setSelectedSlots([updatedItem.slots[0]]);
    }
  };

  const handleDeleteItem = () => {
    if (!currentItemKey || !menu.items) return;
    const nextItems = { ...menu.items };
    delete nextItems[currentItemKey];
    updateMenuState({
      ...menu,
      items: nextItems
    });
  };

  const handleDuplicateItem = () => {
    if (!currentItem) return;
    const newKey = `${currentItemKey}_copy`;
    const occupiedSlots = new Set();
    Object.values(menu.items || {}).forEach((it) => {
      if (it.slot !== undefined) occupiedSlots.add(it.slot);
      if (Array.isArray(it.slots)) it.slots.forEach((s) => occupiedSlots.add(s));
    });

    let nextSlot = selectedSlot + 1;
    while (occupiedSlots.has(nextSlot) && nextSlot < menu.size) {
      nextSlot++;
    }
    if (nextSlot >= menu.size) nextSlot = 0;

    const duplicated = {
      ...currentItem,
      slot: nextSlot,
      display_name: `${currentItem.display_name || 'Item'} (Copy)`
    };

    updateMenuState({
      ...menu,
      items: {
        ...(menu.items || {}),
        [newKey]: duplicated
      }
    });
    setSelectedSlot(nextSlot);
    setSelectedSlots([nextSlot]);
  };

  const handleApplyToSelectedSlots = () => {
    if (!currentItem || selectedSlots.length <= 1) return;
    const key = currentItemKey || `item_multi_${selectedSlot}`;
    const { slot, ...rest } = currentItem;
    const updated = {
      ...rest,
      slots: [...selectedSlots]
    };
    updateMenuState({
      ...menu,
      items: {
        ...(menu.items || {}),
        [key]: updated
      }
    });
  };

  // File Handlers
  const handleImportYaml = (importedYamlText) => {
    handleYamlChange(importedYamlText, false);
    setIsDirty(false);
  };

  const handleExportYaml = () => {
    const blob = new Blob([yamlText], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${menu.open_command || 'menu'}.yml`;
    a.click();
    URL.revokeObjectURL(url);
    setIsDirty(false);
  };

  const handleLoadTemplate = (templateYamlText) => {
    handleYamlChange(templateYamlText, false);
    setIsDirty(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 relative">
      {/* Header */}
      <Header
        onImportYaml={handleImportYaml}
        onExportYaml={handleExportYaml}
        onLoadTemplate={handleLoadTemplate}
        currentYaml={yamlText}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 p-6 flex flex-col gap-6 max-w-[1600px] w-full mx-auto">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('top_bar.open_command')}</span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-800 border border-slate-700 text-emerald-400 rounded-lg">
              /{menu.open_command || 'menu'}
            </span>
            {isDirty ? (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                {t('top_bar.modified')}
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {t('top_bar.unmodified')}
              </span>
            )}
          </div>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition flex items-center gap-2 shadow-sm"
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>{t('top_bar.global_settings')} (size: {menu.size})</span>
          </button>
        </div>

        {/* Center Grid + Right Property Editor Split View */}
        <div className="flex-1 flex gap-6 min-h-[500px]">
          {/* Left / Center GUI Grid */}
          <GuiGrid
            menu={menu}
            selectedSlot={selectedSlot}
            selectedSlots={selectedSlots}
            activePriorityMap={activePriorityMap}
            clipboardItem={clipboardItem}
            onSelectSlot={handleSelectSlot}
            onMultiSelectSlot={handleMultiSelectSlot}
            onClearSelection={handleClearSelection}
            onSelectPriorityItem={handleSelectPriorityItem}
            onMoveOrSwapSlot={handleMoveOrSwapSlot}
            onDeleteSlotItems={handleDeleteSlotItems}
            onCopySlotItem={handleCopySlotItem}
            onCutSlotItem={handleCutSlotItem}
            onPasteItemToSlot={handlePasteItemToSlot}
            onUpdateMenuTitle={handleUpdateMenuTitle}
          />

          {/* Right Item Property Editor */}
          <ItemEditor
            item={currentItem}
            itemKey={currentItemKey}
            selectedSlot={selectedSlot}
            selectedSlots={selectedSlots}
            slotVariants={slotVariants}
            activeVariantIndex={activeVariantIndex}
            onSelectVariant={(idx) => handleSelectPriorityItem(selectedSlot, idx)}
            onAddPriorityVariant={handleAddPriorityVariant}
            onUpdateItem={(updatedItem, newKeyName) => handleUpdateVariantItem(currentItemKey, updatedItem, newKeyName)}
            onDeleteItem={handleDeleteItem}
            onDuplicateItem={handleDuplicateItem}
            onApplyToSelectedSlots={handleApplyToSelectedSlots}
          />
        </div>

        {/* Bottom Bi-directional Real-time YAML Code Editor */}
        <YamlCodeEditor
          yamlText={yamlText}
          onChangeYaml={handleYamlChange}
          error={yamlError}
        />
      </main>

      {/* Full-Page Drag & Drop Overlay */}
      {isDraggingFile && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-8 border-4 border-dashed border-emerald-500 transition duration-300">
          <div className="text-center space-y-4 pointer-events-none">
            {!isDirty ? (
              <>
                <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-2xl animate-bounce">
                  <UploadCloud className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">Release mouse to load .yml file</h2>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Unmodified menu detected. Safe to import.
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-2xl">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-rose-300">Cannot import: Menu has unsaved changes!</h2>
                <p className="text-sm text-rose-200/80 max-w-md mx-auto">
                  Export or refresh page before importing new file.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Global Settings Modal */}
      {showSettingsModal && (
        <MenuSettings
          menu={menu}
          onUpdateMenu={updateMenuState}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useI18n } from '../i18n';
import { parseMinecraftText } from '../utils/minecraftColors';
import ItemIcon from './ItemIcon';
import { Sparkles } from 'lucide-react';

export default function LorePreview({ slotData, item, position }) {
  const { t } = useI18n();
  const scrollContainerRef = useRef(null);

  // The tooltip intentionally ignores pointer events so moving from a slot
  // toward it does not close the preview. Capture the wheel globally while
  // the preview is mounted and redirect it to the lore container instead.
  useEffect(() => {
    const handleWheel = (event) => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer || scrollContainer.scrollHeight <= scrollContainer.clientHeight) return;

      event.preventDefault();
      event.stopPropagation();
      scrollContainer.scrollTop += event.deltaY;
    };

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', handleWheel, { capture: true });
  }, []);

  if (!position || position.x === undefined || position.y === undefined) return null;

  const items = slotData?.items || (item ? [item] : []);
  const activeIdx = slotData?.activeIdx || 0;

  if (items.length === 0) return null;

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  const isMulti = items.length > 1;
  const tooltipWidth = isMulti ? 360 : 310;
  const tooltipHeight = isMulti ? Math.min(420, 160 + items.length * 110) : 220;
  const offset = 12;

  // Strict ClientX / ClientY Cursor Offset
  let posX = position.x + offset;
  let posY = position.y + offset;

  if (position.x + tooltipWidth + offset > viewportWidth - 16) {
    posX = position.x - tooltipWidth - offset;
  }

  if (position.y + tooltipHeight + offset > viewportHeight - 16) {
    posY = position.y - tooltipHeight - offset;
  }

  posX = Math.max(10, Math.min(posX, viewportWidth - tooltipWidth - 10));
  posY = Math.max(10, Math.min(posY, viewportHeight - tooltipHeight - 10));

  const portalContent = (
    <div
      style={{
        top: `${posY}px`,
        left: `${posX}px`,
      }}
      className={`fixed z-[999999] pointer-events-none bg-[#11011e]/98 border-2 border-[#4c0ca6] rounded-xl p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all duration-75 ${
        isMulti ? 'w-[360px]' : 'w-[310px]'
      }`}
    >
      {/* Multi-variant Stack Title Bar */}
      {isMulti && (
        <div className="mb-2 pb-1.5 border-b border-purple-900/60 flex items-center justify-between">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t('lore_preview.variant_stack_title', { slot: slotData.slotIndex, count: items.length })}
          </span>
          <span className="text-[10px] text-purple-400 font-mono">
            {t('lore_preview.all_compare')}
          </span>
        </div>
      )}

      {/* Item Variant Cards Stack */}
      <div
        ref={scrollContainerRef}
        className="space-y-2.5 max-h-[min(380px,calc(100vh-90px))] overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]"
      >
        {items.map((varItem, idx) => {
          // Replace PAPI variables with Mock Player profile for real-time rendering
          const applyMockPapi = (str) => {
            if (!str) return '';
            return String(str)
              .replace(/%player_name%/g, 'Steve')
              .replace(/%vault_eco_balance%/g, '$12,500')
              .replace(/%luckperms_primary_group_name%/g, 'VIP');
          };

          const displayName = applyMockPapi(varItem.display_name || varItem.material || 'Item');
          const loreList = (Array.isArray(varItem.lore) ? varItem.lore : (varItem.lore ? [varItem.lore] : [])).map(applyMockPapi);
          const isCurrentActive = isMulti && idx === activeIdx;
          const priorityNum = varItem.priority || (idx + 1);

          return (
            <div
              key={idx}
              className={`p-2.5 rounded-lg border transition ${
                isMulti
                  ? isCurrentActive
                    ? 'bg-purple-950/80 border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-purple-950/30 border-purple-900/40 opacity-85'
                  : 'bg-transparent border-0 p-0'
              }`}
            >
              {/* Card Sub-Header */}
              <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-purple-900/40">
                <div className="flex items-center gap-2">
                  <ItemIcon material={varItem.material} className="w-6 h-6 flex-shrink-0" />
                  <div className="font-mono text-xs leading-tight">
                    {parseMinecraftText(displayName).map((seg, sIdx) => (
                      <span key={sIdx} style={seg.style}>
                        {seg.text}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    P{priorityNum}
                  </span>
                  {isCurrentActive && (
                    <span className="text-[8px] font-bold text-amber-400 bg-amber-500/30 px-1 py-0.2 rounded">
                      {t('lore_preview.current_active')}
                    </span>
                  )}
                </div>
              </div>

              {/* Lore Lines */}
              {loreList.length > 0 && (
                <div className="space-y-0.5 pl-1">
                  {loreList.map((line, lIdx) => (
                    <div key={lIdx} className="font-mono text-[11px] leading-snug">
                      {parseMinecraftText(line).map((seg, sIdx) => (
                        <span key={sIdx} style={seg.style}>
                          {seg.text}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Material Footer */}
              <div className="mt-1.5 pt-1 flex items-center justify-between text-[9px] text-purple-400/80 font-mono border-t border-purple-900/30">
                <span>Material: {varItem.material || 'STONE'}</span>
                {varItem.view_requirement && (
                  <span className="text-cyan-300 font-medium">
                    {t('lore_preview.has_requirement')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return ReactDOM.createPortal(portalContent, document.body);
}

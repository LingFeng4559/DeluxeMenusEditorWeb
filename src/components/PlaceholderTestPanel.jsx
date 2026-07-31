import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, FlaskConical, RotateCcw, Search } from 'lucide-react';
import { useI18n } from '../i18n';
import { findPlaceholders } from '../utils/placeholders';

const TEXT = {
  zh_TW: {
    title: 'Placeholder 顯示測試',
    summary: (count) => `已從目前 YAML 找到 ${count} 個 Placeholder`,
    empty: '目前 YAML 沒有可測試的 %placeholder%',
    hint: '輸入值會立即套用到預覽，不會修改或匯出至 YAML。',
    input: '輸入測試值',
    knownValues: '已知條件值',
    chooseKnown: '選擇已知值',
    usedAt: '出現位置',
    reset: '清除測試值',
    filter: '搜尋 Placeholder'
  },
  zh_CN: {
    title: 'Placeholder 显示测试',
    summary: (count) => `已从当前 YAML 找到 ${count} 个 Placeholder`,
    empty: '当前 YAML 没有可测试的 %placeholder%',
    hint: '输入值会立即应用到预览，不会修改或导出至 YAML。',
    input: '输入测试值',
    knownValues: '已知条件值',
    chooseKnown: '选择已知值',
    usedAt: '出现位置',
    reset: '清除测试值',
    filter: '搜索 Placeholder'
  },
  en: {
    title: 'Placeholder Display Test',
    summary: (count) => `${count} placeholder${count === 1 ? '' : 's'} found in the current YAML`,
    empty: 'The current YAML contains no testable %placeholders%.',
    hint: 'Values update the preview only and are never written to exported YAML.',
    input: 'Enter a test value',
    knownValues: 'Known condition values',
    chooseKnown: 'Choose a known value',
    usedAt: 'Used at',
    reset: 'Clear test values',
    filter: 'Search placeholders'
  },
  ja_JP: {
    title: 'Placeholder 表示テスト',
    summary: (count) => `現在の YAML から ${count} 個の Placeholder を検出`,
    empty: '現在の YAML にテスト可能な %placeholder% はありません。',
    hint: '入力値はプレビューだけに反映され、YAML には保存・出力されません。',
    input: 'テスト値を入力',
    knownValues: '既知の条件値',
    chooseKnown: '既知の値を選択',
    usedAt: '使用箇所',
    reset: 'テスト値をクリア',
    filter: 'Placeholder を検索'
  }
};

export default function PlaceholderTestPanel({ menu, values, onChangeValues }) {
  const { currentLang } = useI18n();
  const text = TEXT[currentLang] || TEXT.en;
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState('');
  const placeholders = useMemo(() => findPlaceholders(menu), [menu]);
  const filtered = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return placeholders;
    return placeholders.filter(({ placeholder, locations }) => (
      placeholder.toLowerCase().includes(query)
      || locations.some((location) => location.toLowerCase().includes(query))
    ));
  }, [filter, placeholders]);

  const activeValueCount = placeholders.filter(({ placeholder }) => (
    Object.prototype.hasOwnProperty.call(values, placeholder)
  )).length;

  return (
    <section className="bg-slate-900/70 border border-cyan-500/20 rounded-2xl shadow-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded((expanded) => !expanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-800/60 transition"
      >
        <span className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-slate-100">{text.title}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
            {placeholders.length}
          </span>
          {activeValueCount > 0 && (
            <span className="text-[10px] text-emerald-300">
              {activeValueCount}/{placeholders.length}
            </span>
          )}
        </span>
        {isExpanded
          ? <ChevronUp className="w-4 h-4 text-slate-400" />
          : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {isExpanded && (
        <div className="border-t border-slate-800 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-slate-300">{text.summary(placeholders.length)}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{text.hint}</p>
            </div>
            {activeValueCount > 0 && (
              <button
                type="button"
                onClick={() => onChangeValues({})}
                className="self-start flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <RotateCcw className="w-3 h-3" />
                {text.reset}
              </button>
            )}
          </div>

          {placeholders.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-500">{text.empty}</div>
          ) : (
            <>
              <label className="relative block">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  placeholder={text.filter}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </label>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-80 overflow-y-auto overscroll-contain pr-1">
                {filtered.map(({ placeholder, locations, options }) => (
                  <div key={placeholder} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <label className="block font-mono text-xs font-bold text-amber-300 mb-2">
                      {placeholder}
                    </label>
                    {options.length > 0 && (
                      <label className="block mb-2">
                        <span className="block text-[10px] text-cyan-300 mb-1">
                          {text.knownValues}
                        </span>
                        <select
                          value={options.includes(values[placeholder]) ? values[placeholder] : ''}
                          onChange={(event) => {
                            if (!event.target.value) return;
                            onChangeValues({
                              ...values,
                              [placeholder]: event.target.value
                            });
                          }}
                          className="w-full px-3 py-2 text-xs bg-cyan-950/30 border border-cyan-800/60 rounded-lg text-cyan-200 focus:outline-none focus:border-cyan-500"
                        >
                          <option value="">{text.chooseKnown}</option>
                          {options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </label>
                    )}
                    <input
                      value={values[placeholder] ?? ''}
                      onChange={(event) => onChangeValues({
                        ...values,
                        [placeholder]: event.target.value
                      })}
                      placeholder={text.input}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-emerald-300 focus:outline-none focus:border-emerald-500"
                    />
                    <details className="mt-2 text-[10px] text-slate-500">
                      <summary className="cursor-pointer hover:text-slate-300">
                        {text.usedAt} ({locations.length})
                      </summary>
                      <ul className="mt-1 space-y-0.5 font-mono break-all">
                        {locations.map((location) => <li key={location}>{location}</li>)}
                      </ul>
                    </details>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

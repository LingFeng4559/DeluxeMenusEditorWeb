import React, { useState } from 'react';
import {
  Puzzle, Plus, Trash2, Key, DollarSign, Scale, Play, AlertCircle, Layers, GripVertical, CheckCircle2, XCircle, ArrowDown, ChevronRight
} from 'lucide-react';

export default function RequirementPuzzleBuilder({ value, onChange }) {
  const [activeTab, setActiveTab] = useState('puzzle'); // 'puzzle' | 'test'
  const [draggedType, setDraggedType] = useState(null);

  // Safety fallback for current view_requirement structure
  const viewReq = value || {};
  const requirements = viewReq.requirements || {};
  const denyCommands = viewReq.deny_commands || [];

  // Simulator State for Live Testing
  const [simPermission, setSimPermission] = useState('menu.vip.use');
  const [simMoney, setSimMoney] = useState(500);
  const [simLevel, setSimLevel] = useState(10);
  const [simGroup, setSimGroup] = useState('default');
  const [simResult, setSimResult] = useState(null);

  const updateReq = (nextVal) => {
    onChange(nextVal);
  };

  // Add block by type
  const handleAddBlock = (type) => {
    const nextReqs = { ...requirements };
    const idSeed = Math.floor(Math.random() * 1000);

    if (type === 'has_permission') {
      nextReqs[`perm_${idSeed}`] = {
        type: 'has permission',
        permission: 'deluxemenus.vip.use'
      };
    } else if (type === 'has_money') {
      nextReqs[`money_${idSeed}`] = {
        type: 'has money',
        amount: 100
      };
    } else if (type === 'level_check') {
      nextReqs[`level_${idSeed}`] = {
        type: '>=',
        input: '%player_level%',
        output: '10'
      };
    } else if (type === 'string_equals') {
      nextReqs[`group_${idSeed}`] = {
        type: 'string equals',
        input: '%vault_group%',
        output: 'vip'
      };
    }

    updateReq({
      ...viewReq,
      requirements: nextReqs
    });
  };

  const handleUpdateBlockField = (reqKey, field, val) => {
    const nextReqs = { ...requirements };
    nextReqs[reqKey] = {
      ...nextReqs[reqKey],
      [field]: val
    };
    updateReq({
      ...viewReq,
      requirements: nextReqs
    });
  };

  const handleDeleteBlock = (reqKey) => {
    const nextReqs = { ...requirements };
    delete nextReqs[reqKey];
    updateReq({
      ...viewReq,
      requirements: nextReqs
    });
  };

  const handleAddDenyCommand = (cmdText) => {
    const nextDeny = [...denyCommands, cmdText];
    updateReq({
      ...viewReq,
      deny_commands: nextDeny
    });
  };

  const handleUpdateDenyCommand = (idx, val) => {
    const nextDeny = [...denyCommands];
    nextDeny[idx] = val;
    updateReq({
      ...viewReq,
      deny_commands: nextDeny
    });
  };

  const handleDeleteDenyCommand = (idx) => {
    const nextDeny = [...denyCommands];
    nextDeny.splice(idx, 1);
    updateReq({
      ...viewReq,
      deny_commands: nextDeny
    });
  };

  // Execute Live Simulation Test
  const handleRunSimulation = () => {
    const logs = [];
    let allPassed = true;
    const reqEntries = Object.entries(requirements);

    if (reqEntries.length === 0) {
      setSimResult({
        passed: true,
        message: '無任何條件限制，此物品將無條件顯示。',
        logs: ['✅ 無限制條件 (Pass)']
      });
      return;
    }

    for (const [key, rule] of reqEntries) {
      const type = (rule.type || '').toLowerCase();

      if (type === 'has permission' || rule.permission) {
        const targetPerm = rule.permission || '';
        const hasIt = simPermission.split(',').map(s => s.trim()).includes(targetPerm);
        if (hasIt) {
          logs.push(`✅ [${key}] 權限判斷 ${targetPerm}: 通過`);
        } else {
          allPassed = false;
          logs.push(`❌ [${key}] 權限判斷 ${targetPerm}: 失敗 (未持權限)`);
        }
      } else if (type === 'has money') {
        const needMoney = Number(rule.amount || 0);
        if (simMoney >= needMoney) {
          logs.push(`✅ [${key}] 金錢判斷 $${needMoney}: 通過 ($${simMoney})`);
        } else {
          allPassed = false;
          logs.push(`❌ [${key}] 金錢判斷 $${needMoney}: 失敗 ($${simMoney} 不足)`);
        }
      } else if (rule.input === '%player_level%' || type === '>=' || type === '>') {
        const needLvl = Number(rule.output || 0);
        if (simLevel >= needLvl) {
          logs.push(`✅ [${key}] 等級判斷 >= ${needLvl}: 通過 (Lv.${simLevel})`);
        } else {
          allPassed = false;
          logs.push(`❌ [${key}] 等級判斷 >= ${needLvl}: 失敗 (Lv.${simLevel} 不足)`);
        }
      } else if (rule.input === '%vault_group%' || type === 'string equals') {
        const targetGroup = rule.output || '';
        if (simGroup.toLowerCase() === targetGroup.toLowerCase()) {
          logs.push(`✅ [${key}] 權限組 ${targetGroup}: 通過`);
        } else {
          allPassed = false;
          logs.push(`❌ [${key}] 權限組 ${targetGroup}: 失敗 (當前 ${simGroup})`);
        }
      } else {
        logs.push(`⚠️ [${key}] 自訂條件 (${type}): 預設通過`);
      }
    }

    setSimResult({
      passed: allPassed,
      message: allPassed
        ? '🎉 檢測通過！物品可在選單中顯示。'
        : `⛔ 檢測未通過！物品將隱藏，並觸發 ${denyCommands.length} 條拒絕指令。`,
      logs
    });
  };

  const reqList = Object.entries(requirements);

  return (
    <div className="space-y-3">
      {/* Top Header Mode Switcher */}
      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('puzzle')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'puzzle' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Puzzle className="w-3.5 h-3.5" />
          <span>Scratch 拼接積木</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('test');
            handleRunSimulation();
          }}
          className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'test' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>▶ 邏輯檢測模擬器</span>
        </button>
      </div>

      {/* TAB 1: SCRATCH-STYLE PUZZLE BLOCK CANVAS */}
      {activeTab === 'puzzle' && (
        <div className="space-y-3">
          {/* Scratch Palette ToolBox */}
          <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
              <GripVertical className="w-3.5 h-3.5" /> 拖曳/點擊積木拼接到下方 Canvas 凸凹槽:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <div
                draggable
                onDragStart={() => setDraggedType('has_permission')}
                onClick={() => handleAddBlock('has_permission')}
                className="cursor-grab active:cursor-grabbing p-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] rounded-lg transition flex items-center gap-1.5 shadow border-b-2 border-emerald-800"
              >
                <div className="w-2 h-3 bg-emerald-800 rounded-sm" />
                <Key className="w-3.5 h-3.5" />
                <span>【權限積木】</span>
              </div>

              <div
                draggable
                onDragStart={() => setDraggedType('has_money')}
                onClick={() => handleAddBlock('has_money')}
                className="cursor-grab active:cursor-grabbing p-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[11px] rounded-lg transition flex items-center gap-1.5 shadow border-b-2 border-cyan-800"
              >
                <div className="w-2 h-3 bg-cyan-800 rounded-sm" />
                <DollarSign className="w-3.5 h-3.5" />
                <span>【金錢積木】</span>
              </div>

              <div
                draggable
                onDragStart={() => setDraggedType('level_check')}
                onClick={() => handleAddBlock('level_check')}
                className="cursor-grab active:cursor-grabbing p-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[11px] rounded-lg transition flex items-center gap-1.5 shadow border-b-2 border-amber-800"
              >
                <div className="w-2 h-3 bg-amber-800 rounded-sm" />
                <Scale className="w-3.5 h-3.5" />
                <span>【等級比較積木】</span>
              </div>

              <div
                draggable
                onDragStart={() => setDraggedType('string_equals')}
                onClick={() => handleAddBlock('string_equals')}
                className="cursor-grab active:cursor-grabbing p-2 bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-[11px] rounded-lg transition flex items-center gap-1.5 shadow border-b-2 border-purple-800"
              >
                <div className="w-2 h-3 bg-purple-800 rounded-sm" />
                <Layers className="w-3.5 h-3.5" />
                <span>【權限組積木】</span>
              </div>
            </div>
          </div>

          {/* SCRATCH CANVAS (INTERLOCKING PUZZLE STACK) */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (draggedType) {
                handleAddBlock(draggedType);
                setDraggedType(null);
              }
            }}
            className="p-3 bg-slate-950/70 border-2 border-dashed border-slate-800 rounded-xl min-h-[200px] max-h-[340px] overflow-y-auto space-y-0"
          >
            {/* Top Scratch Stack Header Notch */}
            <div className="flex items-center justify-between bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-t-xl shadow relative">
              <div className="flex items-center gap-1.5">
                <Puzzle className="w-4 h-4" />
                <span>當條件滿足時 (requirements) 顯示此物品:</span>
              </div>
              {/* Bottom interlocking Tab / Notch */}
              <div className="absolute -bottom-2 left-6 w-5 h-2 bg-amber-500 rounded-b-md shadow-sm z-10" />
            </div>

            {reqList.length > 0 ? (
              reqList.map(([reqKey, rule], idx) => {
                const isPermission = rule.type === 'has permission' || rule.permission !== undefined;
                const isMoney = rule.type === 'has money' || rule.amount !== undefined;
                const blockBg = isPermission ? 'bg-emerald-600 text-slate-950 border-emerald-700'
                              : isMoney ? 'bg-cyan-600 text-slate-950 border-cyan-700'
                              : 'bg-amber-600 text-slate-950 border-amber-700';

                return (
                  <div key={reqKey} className="relative group pt-1">
                    {/* Interlocking Puzzle Block Body */}
                    <div className={`p-2.5 ${blockBg} border-b-2 font-bold text-xs shadow-lg relative flex flex-col gap-1.5 rounded-b-md`}>
                      {/* Top Inward Notch Hole */}
                      <div className="absolute -top-1.5 left-6 w-5 h-2 bg-slate-950 rounded-b-sm border-t border-slate-800" />

                      {/* Header bar of the Puzzle Block */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <GripVertical className="w-3.5 h-3.5 opacity-70 cursor-grab" />
                          <span className="font-mono text-[11px] opacity-80">#{idx + 1} {reqKey}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteBlock(reqKey)}
                          className="p-1 hover:bg-black/20 rounded transition text-slate-950 hover:text-rose-950"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Editable Fields inside Scratch Block */}
                      {isPermission ? (
                        <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-lg">
                          <Key className="w-3.5 h-3.5" />
                          <span className="text-[11px]">擁有權限:</span>
                          <input
                            type="text"
                            value={rule.permission || ''}
                            onChange={(e) => handleUpdateBlockField(reqKey, 'permission', e.target.value)}
                            placeholder="deluxemenus.vip.use"
                            className="flex-1 px-2 py-0.5 text-xs font-mono bg-slate-950 text-emerald-300 rounded focus:outline-none"
                          />
                        </div>
                      ) : isMoney ? (
                        <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-lg">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span className="text-[11px]">金錢大於:</span>
                          <input
                            type="number"
                            value={rule.amount || 0}
                            onChange={(e) => handleUpdateBlockField(reqKey, 'amount', Number(e.target.value))}
                            placeholder="100"
                            className="w-28 px-2 py-0.5 text-xs font-mono bg-slate-950 text-cyan-300 rounded focus:outline-none"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-black/20 p-1.5 rounded-lg">
                          <input
                            type="text"
                            value={rule.input || ''}
                            onChange={(e) => handleUpdateBlockField(reqKey, 'input', e.target.value)}
                            placeholder="%player_level%"
                            className="flex-1 px-1.5 py-0.5 text-xs font-mono bg-slate-950 text-slate-200 rounded"
                          />
                          <select
                            value={rule.type || '=='}
                            onChange={(e) => handleUpdateBlockField(reqKey, 'type', e.target.value)}
                            className="px-1.5 py-0.5 text-xs bg-slate-900 text-amber-300 rounded font-bold border border-amber-500/30"
                          >
                            <option value="==">== (數值/文字完全相同)</option>
                            <option value=">=">&gt;= (大於等於)</option>
                            <option value="<=">&lt;= (小於等於)</option>
                            <option value="!=">!= (不等於)</option>
                            <option value="string equals">🔤 文字相同 (string equals)</option>
                            <option value="string contains">🔍 文字包含 (string contains)</option>
                            <option value="regex matches">⚙️ 正則符合 (regex matches)</option>
                          </select>
                          <input
                            type="text"
                            value={rule.output || ''}
                            onChange={(e) => handleUpdateBlockField(reqKey, 'output', e.target.value)}
                            placeholder="10"
                            className="flex-1 px-1.5 py-0.5 text-xs font-mono bg-slate-950 text-amber-300 rounded"
                          />
                        </div>
                      )}

                      {/* Bottom Outward Interlocking Tab / Notch */}
                      <div className="absolute -bottom-2 left-6 w-5 h-2 bg-inherit rounded-b-md shadow-md z-10" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                <ArrowDown className="w-5 h-5 animate-bounce text-slate-600" />
                <span>拖拽或點擊上方積木，向 Scratch 堆疊鏈中拼接條件</span>
              </div>
            )}
          </div>

          {/* DENY COMMANDS SECTION */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> 拒絕觸發指令 (deny_commands)
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleAddDenyCommand('[message] &c你未符合顯示條件！')}
                  className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 rounded"
                >
                  +訊息
                </button>
                <button
                  onClick={() => handleAddDenyCommand('[sound] BLOCK.NOTE_BLOCK.BASS')}
                  className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded"
                >
                  +音效
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              {denyCommands.map((cmd, idx) => (
                <div key={idx} className="flex gap-1.5 items-center">
                  <input
                    type="text"
                    value={cmd}
                    onChange={(e) => handleUpdateDenyCommand(idx, e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg text-rose-300 focus:outline-none"
                  />
                  <button
                    onClick={() => handleDeleteDenyCommand(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE SIMULATOR TESTER */}
      {activeTab === 'test' && (
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" /> 模擬玩家資料輸入
            </span>
            <button
              onClick={handleRunSimulation}
              className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition"
            >
              重新檢測
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-0.5">測試權限:</label>
              <input
                type="text"
                value={simPermission}
                onChange={(e) => setSimPermission(e.target.value)}
                className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-emerald-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-0.5">測試金錢 ($):</label>
              <input
                type="number"
                value={simMoney}
                onChange={(e) => setSimMoney(Number(e.target.value))}
                className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-cyan-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-0.5">測試等級:</label>
              <input
                type="number"
                value={simLevel}
                onChange={(e) => setSimLevel(Number(e.target.value))}
                className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-0.5">測試權限組:</label>
              <input
                type="text"
                value={simGroup}
                onChange={(e) => setSimGroup(e.target.value)}
                className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-purple-400"
              />
            </div>
          </div>

          {simResult && (
            <div className={`p-3 rounded-xl border space-y-2 text-xs ${
              simResult.passed
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                {simResult.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>{simResult.message}</span>
              </div>

              <div className="space-y-1 pt-1 border-t border-slate-800/60 font-mono text-[11px]">
                {simResult.logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

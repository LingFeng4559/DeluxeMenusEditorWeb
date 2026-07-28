import React, { useState } from 'react';
import {
  Puzzle, Plus, Trash2, ShieldCheck, Key, DollarSign, Package, Scale, MessageSquare, Volume2, LogOut, CheckCircle2, XCircle, Play, AlertCircle, Layers
} from 'lucide-react';

export default function RequirementPuzzleBuilder({ value, onChange }) {
  const [activeTab, setActiveTab] = useState('puzzle'); // 'puzzle' | 'test' | 'json'

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

  // Helper to trigger parent onChange
  const updateReq = (nextVal) => {
    onChange(nextVal);
  };

  // Add a new Puzzle Block
  const handleAddBlock = (type) => {
    const nextReqs = { ...requirements };
    const idSeed = Date.now().toString().slice(-4);

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
    } else if (type === 'has_item') {
      nextReqs[`item_${idSeed}`] = {
        type: 'has item',
        material: 'DIAMOND',
        amount: 1
      };
    }

    updateReq({
      ...viewReq,
      requirements: nextReqs
    });
  };

  // Update a specific Block field
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

  // Delete a Block
  const handleDeleteBlock = (reqKey) => {
    const nextReqs = { ...requirements };
    delete nextReqs[reqKey];
    updateReq({
      ...viewReq,
      requirements: nextReqs
    });
  };

  // Add Deny Command
  const handleAddDenyCommand = (cmdText) => {
    const nextDeny = [...denyCommands, cmdText];
    updateReq({
      ...viewReq,
      deny_commands: nextDeny
    });
  };

  // Update Deny Command line
  const handleUpdateDenyCommand = (idx, val) => {
    const nextDeny = [...denyCommands];
    nextDeny[idx] = val;
    updateReq({
      ...viewReq,
      deny_commands: nextDeny
    });
  };

  // Delete Deny Command line
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
        message: '未設定任何條件限制，此物品將無條件顯示。',
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
          logs.push(`❌ [${key}] 權限判斷 ${targetPerm}: 失敗 (玩家未持有此權限)`);
        }
      } else if (type === 'has money') {
        const needMoney = Number(rule.amount || 0);
        if (simMoney >= needMoney) {
          logs.push(`✅ [${key}] 金錢判斷 $${needMoney}: 通過 (玩家擁有 $${simMoney})`);
        } else {
          allPassed = false;
          logs.push(`❌ [${key}] 金錢判斷 $${needMoney}: 失敗 (玩家餘額 $${simMoney} 不足)`);
        }
      } else if (rule.input === '%player_level%' || type === '>=' || type === '>') {
        const needLvl = Number(rule.output || 0);
        if (simLevel >= needLvl) {
          logs.push(`✅ [${key}] 等級判斷 >= ${needLvl}: 通過 (玩家等級 ${simLevel})`);
        } else {
          allPassed = false;
          logs.push(`❌ [${key}] 等級判斷 >= ${needLvl}: 失敗 (玩家等級 ${simLevel} 不足)`);
        }
      } else if (rule.input === '%vault_group%' || type === 'string equals') {
        const targetGroup = rule.output || '';
        if (simGroup.toLowerCase() === targetGroup.toLowerCase()) {
          logs.push(`✅ [${key}] 權限組判斷 ${targetGroup}: 通過`);
        } else {
          allPassed = false;
          logs.push(`❌ [${key}] 權限組判斷 ${targetGroup}: 失敗 (玩家為 ${simGroup})`);
        }
      } else {
        logs.push(`⚠️ [${key}] 自訂條件 (${type}): 模擬環境自動預設通過`);
      }
    }

    setSimResult({
      passed: allPassed,
      message: allPassed
        ? '🎉 測試通過！該物品將會在 GUI 中正常顯示。'
        : `⛔ 測試未通過！物品將隱藏，並執行 ${denyCommands.length} 條拒絕指令 (deny_commands)。`,
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
          <span>拼圖式積木編輯</span>
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

      {/* TAB 1: PUZZLE BLOCK BUILDER */}
      {activeTab === 'puzzle' && (
        <div className="space-y-3">
          {/* Quick Block Add Palette */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> 點擊拼圖塊插入條件畫布:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleAddBlock('has_permission')}
                className="px-2.5 py-1 text-[11px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg transition flex items-center gap-1"
              >
                <Key className="w-3 h-3" /> + 權限拼圖
              </button>
              <button
                onClick={() => handleAddBlock('has_money')}
                className="px-2.5 py-1 text-[11px] font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg transition flex items-center gap-1"
              >
                <DollarSign className="w-3 h-3" /> + 金錢拼圖
              </button>
              <button
                onClick={() => handleAddBlock('level_check')}
                className="px-2.5 py-1 text-[11px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg transition flex items-center gap-1"
              >
                <Scale className="w-3 h-3" /> + 等級比較塊
              </button>
              <button
                onClick={() => handleAddBlock('string_equals')}
                className="px-2.5 py-1 text-[11px] font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-lg transition flex items-center gap-1"
              >
                <Layers className="w-3 h-3" /> + 權限組比對
              </button>
            </div>
          </div>

          {/* Puzzle Canvas: Connected Block List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {reqList.length > 0 ? (
              reqList.map(([reqKey, rule], idx) => (
                <div
                  key={reqKey}
                  className="relative p-3 bg-slate-900 border-l-4 border-amber-500 rounded-r-xl border-y border-r border-slate-800 shadow-md space-y-2 transition hover:border-amber-400 group"
                >
                  {/* Puzzle Notch Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                        🧩 拼圖塊 #{idx + 1}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-200">{reqKey}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteBlock(reqKey)}
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                      title="刪除拼圖塊"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Block Content Inputs */}
                  {rule.type === 'has permission' || rule.permission !== undefined ? (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 min-w-[70px]">
                        <Key className="w-3.5 h-3.5" /> 擁有權限:
                      </span>
                      <input
                        type="text"
                        value={rule.permission || ''}
                        onChange={(e) => handleUpdateBlockField(reqKey, 'permission', e.target.value)}
                        placeholder="deluxemenus.vip.use"
                        className="flex-1 px-2.5 py-1 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-emerald-300 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  ) : rule.type === 'has money' || rule.amount !== undefined ? (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-cyan-400 font-bold flex items-center gap-1 min-w-[70px]">
                        <DollarSign className="w-3.5 h-3.5" /> 金錢大於:
                      </span>
                      <input
                        type="number"
                        value={rule.amount || 0}
                        onChange={(e) => handleUpdateBlockField(reqKey, 'amount', Number(e.target.value))}
                        placeholder="100"
                        className="w-32 px-2.5 py-1 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={rule.input || ''}
                          onChange={(e) => handleUpdateBlockField(reqKey, 'input', e.target.value)}
                          placeholder="PAPI (如 %player_level%)"
                          className="flex-1 px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                        />
                        <select
                          value={rule.type || '=='}
                          onChange={(e) => handleUpdateBlockField(reqKey, 'type', e.target.value)}
                          className="px-2 py-1 text-xs font-mono bg-slate-800 border border-slate-700 rounded-lg text-amber-300 font-bold"
                        >
                          <option value="==">==</option>
                          <option value=">=">&gt;=</option>
                          <option value="<=">&lt;=</option>
                          <option value="!=">!=</option>
                          <option value="string equals">string equals</option>
                        </select>
                        <input
                          type="text"
                          value={rule.output || ''}
                          onChange={(e) => handleUpdateBlockField(reqKey, 'output', e.target.value)}
                          placeholder="目標值"
                          className="flex-1 px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-amber-400"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                點擊上方拼圖按鈕，為此物品拼接顯示條件 🧩
              </div>
            )}
          </div>

          {/* DENY COMMANDS SECTION */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> 拒絕懲罰指令 (deny_commands)
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

          {/* Player Mock Data Inputs */}
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

          {/* Test Results Output */}
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

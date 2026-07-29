/**
 * Exhaustive Minecraft Sound Library with Traditional Chinese translations and category tags.
 */
export const MINECRAFT_SOUNDS = [
  // 村民與生物音效 (Villager & Mobs)
  { id: 'ENTITY_VILLAGER_NO', name: '村民生氣搖頭', category: 'Villager', tags: ['村民', '生氣', '拒絕', '失敗', '搖頭', 'no'] },
  { id: 'ENTITY_VILLAGER_YES', name: '村民點頭同意', category: 'Villager', tags: ['村民', '同意', '成功', '點頭', 'yes'] },
  { id: 'ENTITY_VILLAGER_TRADE', name: '村民交易滿意', category: 'Villager', tags: ['村民', '交易', '買賣', '滿意'] },
  { id: 'ENTITY_VILLAGER_CELEBRATE', name: '村民歡呼慶祝', category: 'Villager', tags: ['村民', '歡呼', '勝利', '慶祝'] },
  { id: 'ENTITY_VILLAGER_HURT', name: '村民受傷聲', category: 'Villager', tags: ['村民', '受傷', '哀嚎'] },
  { id: 'ENTITY_VILLAGER_DEATH', name: '村民死亡聲', category: 'Villager', tags: ['村民', '死亡'] },
  { id: 'ENTITY_COW_AMBIENT', name: '乳牛叫聲', category: 'Mobs', tags: ['牛', '乳牛', '動物'] },
  { id: 'ENTITY_PIG_AMBIENT', name: '豬隻叫聲', category: 'Mobs', tags: ['豬', '動物'] },
  { id: 'ENTITY_CHICKEN_AMBIENT', name: '咕咕雞叫聲', category: 'Mobs', tags: ['雞', '動物'] },
  { id: 'ENTITY_CAT_PURR', name: '貓咪呼嚕聲', category: 'Mobs', tags: ['貓', '呼嚕', '寵物'] },
  { id: 'ENTITY_DOG_BARK', name: '狗汪汪叫聲', category: 'Mobs', tags: ['狗', '狼', '吠叫'] },
  { id: 'ENTITY_WOLF_HOWL', name: '狼嚎聲', category: 'Mobs', tags: ['狼', '嚎叫'] },

  // 玩家與介面音效 (Player & UI)
  { id: 'ENTITY_PLAYER_LEVELUP', name: '玩家等級提升 (升級音效)', category: 'Player', tags: ['升級', '等級', '獎勵', '成功', 'levelup'] },
  { id: 'ENTITY_EXPERIENCE_ORB_PICKUP', name: '拾取經驗球 (叮叮聲)', category: 'Player', tags: ['經驗', '經驗球', '拾取', '音階', '叮'] },
  { id: 'ENTITY_PLAYER_BURP', name: '玩家進食打嗝聲', category: 'Player', tags: ['打嗝', '進食', '吃東西'] },
  { id: 'ENTITY_PLAYER_HURT', name: '玩家受到傷害', category: 'Player', tags: ['受傷', '扣血', '疼痛'] },
  { id: 'ENTITY_PLAYER_DEATH', name: '玩家死亡音效', category: 'Player', tags: ['死亡', '陣亡', '遊戲結束'] },
  { id: 'UI_BUTTON_CLICK', name: '介面按鈕點擊', category: 'UI', tags: ['點擊', '按鈕', '介面', '切換', 'click'] },
  { id: 'UI_TOAST_CHALLENGE_COMPLETE', name: '成就/挑戰完成提示音', category: 'UI', tags: ['成就', '挑戰', '達成', '告示'] },

  // 音符盒與方塊 (Note Block & Blocks)
  { id: 'BLOCK_NOTE_BLOCK_BASS', name: '音符盒 (貝斯/失敗提示聲)', category: 'NoteBlock', tags: ['音符盒', '貝斯', '警告', '錯誤', '拒絕', '失敗', 'bass'] },
  { id: 'BLOCK_NOTE_BLOCK_PLING', name: '音符盒 (叮/成功提示聲)', category: 'NoteBlock', tags: ['音符盒', '叮', '提示', '成功', 'pling'] },
  { id: 'BLOCK_NOTE_BLOCK_HARP', name: '音符盒 (豎琴聲)', category: 'NoteBlock', tags: ['音符盒', '豎琴', '音樂'] },
  { id: 'BLOCK_NOTE_BLOCK_BELL', name: '音符盒 (清脆鈴聲)', category: 'NoteBlock', tags: ['音符盒', '鈴聲', '鐘聲'] },
  { id: 'BLOCK_NOTE_BLOCK_CHIME', name: '音符盒 (風鈴聲)', category: 'NoteBlock', tags: ['音符盒', '風鈴'] },
  { id: 'BLOCK_NOTE_BLOCK_FLUTE', name: '音符盒 (長笛聲)', category: 'NoteBlock', tags: ['音符盒', '長笛'] },
  { id: 'BLOCK_NOTE_BLOCK_GUITAR', name: '音符盒 (吉他聲)', category: 'NoteBlock', tags: ['音符盒', '吉他'] },
  { id: 'BLOCK_NOTE_BLOCK_XYLOPHONE', name: '音符盒 (木琴聲)', category: 'NoteBlock', tags: ['音符盒', '木琴'] },

  // 鐵砧與容器 (Anvil & Containers)
  { id: 'BLOCK_ANVIL_USE', name: '鐵砧敲擊使用', category: 'Container', tags: ['鐵砧', '敲擊', '鐵器', '鍛造', 'anvil'] },
  { id: 'BLOCK_ANVIL_LAND', name: '鐵砧砸落/完工重響', category: 'Container', tags: ['鐵砧', '砸落', '完成'] },
  { id: 'BLOCK_ANVIL_DESTROY', name: '鐵砧毀損崩塌', category: 'Container', tags: ['鐵砧', '壞掉', '損毀'] },
  { id: 'BLOCK_CHEST_OPEN', name: '開啟木箱子', category: 'Container', tags: ['箱子', '開啟', '木箱', 'chest'] },
  { id: 'BLOCK_CHEST_CLOSE', name: '關閉木箱子', category: 'Container', tags: ['箱子', '關閉'] },
  { id: 'BLOCK_ENDER_CHEST_OPEN', name: '開啟終界箱 (魔法聲)', category: 'Container', tags: ['終界箱', '開啟', '魔法'] },
  { id: 'BLOCK_BARREL_OPEN', name: '開啟木桶', category: 'Container', tags: ['木桶', '開啟'] },
  { id: 'BLOCK_SHULKER_BOX_OPEN', name: '開啟界伏盒', category: 'Container', tags: ['界伏盒', '開啟'] },

  // 戰鬥與魔法環境 (Combat & Magic)
  { id: 'ENTITY_TNT_PRIMED', name: 'TNT 引信點燃點火聲', category: 'Combat', tags: ['TNT', '爆炸', '點燃', '引信', 'tnt'] },
  { id: 'ENTITY_GENERIC_EXPLODE', name: '巨響爆炸聲', category: 'Combat', tags: ['爆炸', '轟炸', 'kaboom'] },
  { id: 'ITEM_TOTEM_USE', name: '不死圖騰發動 (金光復活)', category: 'Magic', tags: ['圖騰', '復活', '魔法', '金光', 'totem'] },
  { id: 'ITEM_BOTTLE_FILL_DRAGONBREATH', name: '裝填龍息', category: 'Magic', tags: ['龍息', '藥水', '魔法'] },
  { id: 'BLOCK_END_PORTAL_SPAWN', name: '終界傳送門激活震撼音', category: 'Magic', tags: ['傳送門', '終界', '激活', '震撼'] },
  { id: 'ENTITY_LIGHTNING_BOLT_THUNDER', name: '打雷閃電巨響', category: 'Weather', tags: ['打雷', '閃電', '雷電', '天氣'] }
];

/**
 * Helper to lookup Chinese name by Minecraft Sound ID
 */
export function getSoundChineseName(soundId) {
  if (!soundId) return '';
  const cleanId = String(soundId).trim().toUpperCase();
  const matched = MINECRAFT_SOUNDS.find((s) => s.id === cleanId);
  return matched ? matched.name : '';
}

/**
 * Synthesizes audio simulation using Web Audio API in browser.
 */
export function playSynthesizedSound(soundId) {
  if (typeof window === 'undefined') return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const cleanId = String(soundId).trim().toUpperCase();

    // 1. Level up sound (rising arp)
    if (cleanId.includes('LEVELUP')) {
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.2);
      });
      return;
    }

    // 2. Villager No / Fail Bass sound (low frequency double thud)
    if (cleanId.includes('VILLAGER_NO') || cleanId.includes('BASS')) {
      [150, 110].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.4, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.12 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.18);
      });
      return;
    }

    // 3. UI Click / Pling sound (short high pitch ping)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const baseFreq = cleanId.includes('PLING') ? 880 : cleanId.includes('ANVIL') ? 350 : 600;
    osc.type = cleanId.includes('ANVIL') ? 'square' : 'sine';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.warn('Web Audio synthesis failed:', e);
  }
}

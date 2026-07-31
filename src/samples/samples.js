export const TEMPLATE_LIBRARY = {
  starlight_hub: {
    label: '星光航站｜伺服器導航',
    yaml: `
# 原創範本：以太空航站為主題的入口導航
menu_title: '&0✦ &b星光航站 &0✦'
open_command:
  - hubmenu
  - navigator
size: 45
update_interval: 10

items:
  'profile':
    material: PLAYER_HEAD
    slot: 4
    display_name: '&f%player_name% &7的航行證'
    lore:
      - '&8────────────────'
      - '&7目前世界：&b%player_world%'
      - '&7經濟餘額：&a%vault_eco_balance%'
      - ''
      - '&e點擊查看個人資訊'
    left_click_commands:
      - '[player] profile'
      - '[sound] UI_BUTTON_CLICK'

  'survival_gate':
    material: GRASS_BLOCK
    slot: 19
    display_name: '&a生存星域'
    lore:
      - '&7回到主要生存世界'
      - '&f適合建築、採集與冒險'
      - ''
      - '&a▶ 點擊傳送'
    left_click_commands:
      - '[player] warp survival'
      - '[close]'

  'resource_gate':
    material: DIAMOND_PICKAXE
    slot: 21
    display_name: '&b資源小行星'
    lore:
      - '&7定期重置的採集區域'
      - '&c離開前記得帶走物品'
      - ''
      - '&b▶ 點擊傳送'
    left_click_commands:
      - '[player] warp resource'
      - '[close]'

  'creative_gate':
    material: BRICKS
    slot: 23
    display_name: '&d創意工坊'
    lore:
      - '&7展示作品與測試建築'
      - '&f在這裡讓想法成形'
      - ''
      - '&d▶ 點擊傳送'
    left_click_commands:
      - '[player] warp creative'
      - '[close]'

  'event_gate':
    material: FIREWORK_ROCKET
    slot: 25
    display_name: '&6本週活動'
    lore:
      - '&7查看目前進行中的活動'
      - '&e包含時間、規則與獎勵'
    left_click_commands:
      - '[player] events'
      - '[sound] ENTITY_EXPERIENCE_ORB_PICKUP'

  'help':
    material: WRITABLE_BOOK
    slot: 40
    display_name: '&e航站服務台'
    lore:
      - '&7需要協助或不知道去哪裡？'
      - '&f點擊開啟新手指引'
    left_click_commands:
      - '[player] help'

  'frame':
    material: BLUE_STAINED_GLASS_PANE
    slots:
      - 0-3
      - 5-8
      - 9-17
      - 36-39
      - 41-44
    display_name: ' '
`
  },

  expedition_board: {
    label: '遠征看板｜任務與進度',
    yaml: `
# 原創範本：用不同狀態呈現每日任務
menu_title: '&8☰ &6遠征委託看板'
open_command: expedition
size: 27
update_interval: 5

items:
  'daily_hunt_complete':
    material: LIME_DYE
    slot: 11
    priority: 1
    display_name: '&a✔ 林地清剿'
    lore:
      - '&7今日進度：&a已完成'
      - '&7獎勵：&e300 金幣'
      - ''
      - '&a點擊領取獎勵'
    view_requirement:
      requirements:
        completed:
          type: string equals
          input: '%quest_daily_hunt_state%'
          output: 'complete'
    left_click_commands:
      - '[player] quest claim daily_hunt'
      - '[sound] ENTITY_PLAYER_LEVELUP'
      - '[refresh] <delay=1>'

  'daily_hunt_active':
    material: IRON_SWORD
    slot: 11
    priority: 2
    display_name: '&e林地清剿'
    lore:
      - '&7擊敗森林中的敵對生物'
      - ''
      - '&f進度：&e%quest_daily_hunt_progress%&7/20'
      - '&f獎勵：&6300 金幣'
    view_requirement:
      requirements:
        active:
          type: string equals
          input: '%quest_daily_hunt_state%'
          output: 'active'

  'daily_hunt_available':
    material: MAP
    slot: 11
    priority: 3
    display_name: '&f林地清剿'
    lore:
      - '&7這份委託尚未開始'
      - '&e點擊接受任務'
    left_click_commands:
      - '[player] quest start daily_hunt'
      - '[sound] ITEM_BOOK_PAGE_TURN'
      - '[refresh] <delay=1>'

  'mining_contract':
    material: RAW_COPPER
    slot: 13
    display_name: '&6礦脈調查'
    lore:
      - '&7採集不同種類的礦物'
      - '&f目標：&b32 個原礦'
      - '&f獎勵：&d遠征補給箱'
      - ''
      - '&e點擊查看詳細進度'
    left_click_commands:
      - '[player] quest info mining_contract'

  'delivery_contract':
    material: CHEST_MINECART
    slot: 15
    display_name: '&b跨域運輸'
    lore:
      - '&7將補給送往指定城鎮'
      - '&f限制時間：&e15 分鐘'
      - '&f獎勵：&a450 金幣'
    left_click_commands:
      - '[player] quest info delivery_contract'

  'weekly_progress':
    material: RECOVERY_COMPASS
    slot: 22
    display_name: '&d每週里程碑'
    lore:
      - '&7完成每日委託累積星章'
      - '&f目前：&d%quest_weekly_points%&7/7'
    left_click_commands:
      - '[player] quest weekly'

  'frame':
    material: BROWN_STAINED_GLASS_PANE
    slots:
      - 0-9
      - 17-21
      - 23-26
    display_name: ' '
`
  },

  player_console: {
    label: '旅人終端｜個人功能',
    yaml: `
# 原創範本：玩家常用功能與狀態切換
menu_title: '&0⌘ &3旅人終端'
open_command: console
size: 36

items:
  'identity':
    material: PLAYER_HEAD
    slot: 4
    display_name: '&b%player_name%'
    lore:
      - '&8────────────────'
      - '&7等級：&f%player_level%'
      - '&7群組：&e%luckperms_primary_group_name%'
      - '&7在線時間：&a%statistic_time_played%'

  'messages_enabled':
    material: LIME_DYE
    slot: 12
    priority: 1
    display_name: '&a私人訊息：接收中'
    lore:
      - '&7其他玩家可以傳送訊息給你'
      - ''
      - '&e點擊切換為勿擾'
    view_requirement:
      requirements:
        state:
          type: string equals
          input: '%player_message_toggle%'
          output: 'on'
    left_click_commands:
      - '[player] msgtoggle'
      - '[refresh] <delay=1>'

  'messages_disabled':
    material: GRAY_DYE
    slot: 12
    priority: 2
    display_name: '&7私人訊息：勿擾'
    lore:
      - '&7目前不接收其他玩家的訊息'
      - ''
      - '&e點擊重新開啟'
    left_click_commands:
      - '[player] msgtoggle'
      - '[refresh] <delay=1>'

  'home':
    material: RED_BED
    slot: 14
    display_name: '&c返回據點'
    lore:
      - '&7傳送至你設定的家'
      - '&8指令：/home'
    left_click_commands:
      - '[player] home'
      - '[close]'

  'mail':
    material: PAPER
    slot: 16
    display_name: '&e信件匣'
    lore:
      - '&7收取系統與玩家寄送的物品'
      - '&f未讀信件：&e%mail_unread%'
    left_click_commands:
      - '[player] mail'

  'appearance':
    material: LEATHER_CHESTPLATE
    slot: 20
    display_name: '&d外觀衣櫥'
    lore:
      - '&7管理稱號、粒子與造型'
    left_click_commands:
      - '[player] cosmetics'

  'privacy':
    material: SHIELD
    slot: 22
    display_name: '&3隱私設定'
    lore:
      - '&7管理傳送、交易與邀請偏好'
    left_click_commands:
      - '[player] privacy'

  'statistics':
    material: SPYGLASS
    slot: 24
    display_name: '&6旅程統計'
    lore:
      - '&7查看探索、戰鬥與收集紀錄'
    left_click_commands:
      - '[player] stats'

  'close':
    material: BARRIER
    slot: 31
    display_name: '&c關閉終端'
    left_click_commands:
      - '[close]'

  'frame':
    material: CYAN_STAINED_GLASS_PANE
    slots:
      - 0-3
      - 5-11
      - 17-19
      - 25-30
      - 32-35
    display_name: ' '
`
  },

  community_square: {
    label: '微光廣場｜社群入口',
    yaml: `
# 原創範本：社群資訊、活動與回饋入口
menu_title: '&0❖ &d微光廣場'
open_command:
  - community
  - square
size: 27

items:
  'announcement':
    material: BELL
    slot: 10
    display_name: '&e最新公告'
    lore:
      - '&7掌握更新、維護與活動資訊'
      - ''
      - '&e點擊閱讀'
    left_click_commands:
      - '[player] announcements'
      - '[sound] BLOCK_NOTE_BLOCK_BELL'

  'calendar':
    material: CLOCK
    slot: 12
    display_name: '&6活動日曆'
    lore:
      - '&7下一場活動：'
      - '&f%server_next_event%'
      - ''
      - '&6點擊查看完整時程'
    left_click_commands:
      - '[player] calendar'

  'teams':
    material: CAMPFIRE
    slot: 14
    display_name: '&a尋找夥伴'
    lore:
      - '&7建立隊伍或加入其他冒險者'
      - '&f一起完成更困難的挑戰'
    left_click_commands:
      - '[player] party'

  'feedback':
    material: WRITABLE_BOOK
    slot: 16
    display_name: '&b意見信箱'
    lore:
      - '&7回報問題或提供建議'
      - '&8請勿提交個人敏感資料'
    left_click_commands:
      - '[player] feedback'

  'rules':
    material: KNOWLEDGE_BOOK
    slot: 22
    display_name: '&c社群守則'
    lore:
      - '&7友善交流、尊重創作'
      - '&7共同維護舒適的遊戲環境'
    left_click_commands:
      - '[player] rules'

  'frame':
    material: PURPLE_STAINED_GLASS_PANE
    slots:
      - 0-9
      - 17-21
      - 23-26
    display_name: ' '
`
  }
};

const TEMPLATE_LABELS = {
  zh_TW: {
    starlight_hub: '星光航站｜伺服器導航',
    expedition_board: '遠征看板｜任務與進度',
    player_console: '旅人終端｜個人功能',
    community_square: '微光廣場｜社群入口'
  },
  zh_CN: {
    starlight_hub: '星光航站｜服务器导航',
    expedition_board: '远征看板｜任务与进度',
    player_console: '旅人终端｜个人功能',
    community_square: '微光广场｜社区入口'
  },
  en: {
    starlight_hub: 'Starlight Station | Navigation',
    expedition_board: 'Expedition Board | Quests',
    player_console: 'Traveler Console | Utilities',
    community_square: 'Glimmer Square | Community'
  },
  ja_JP: {
    starlight_hub: 'スターライト駅｜ナビゲーション',
    expedition_board: '遠征ボード｜クエスト',
    player_console: '旅人コンソール｜個人機能',
    community_square: 'きらめき広場｜コミュニティ'
  }
};

const EN_TRANSLATIONS = {
  '原創範本：以太空航站為主題的入口導航': 'Original template: space-station themed navigation',
  '星光航站': 'Starlight Station',
  '的航行證': "''s Travel Pass",
  '目前世界：': 'Current world: ',
  '經濟餘額：': 'Balance: ',
  '點擊查看個人資訊': 'Click to view your profile',
  '生存星域': 'Survival Sector',
  '回到主要生存世界': 'Return to the main survival world',
  '適合建築、採集與冒險': 'Build, gather, and explore',
  '點擊傳送': 'Click to travel',
  '資源小行星': 'Resource Asteroid',
  '定期重置的採集區域': 'A gathering area that resets regularly',
  '離開前記得帶走物品': 'Take your items before leaving',
  '創意工坊': 'Creative Workshop',
  '展示作品與測試建築': 'Showcase and test your builds',
  '在這裡讓想法成形': 'Turn your ideas into reality',
  '本週活動': 'This Week’s Events',
  '查看目前進行中的活動': 'View active server events',
  '包含時間、規則與獎勵': 'Includes schedules, rules, and rewards',
  '航站服務台': 'Station Help Desk',
  '需要協助或不知道去哪裡？': 'Need help or unsure where to go?',
  '點擊開啟新手指引': 'Click to open the beginner guide',
  '原創範本：用不同狀態呈現每日任務': 'Original template: daily quests with multiple states',
  '遠征委託看板': 'Expedition Board',
  '林地清剿': 'Woodland Sweep',
  '今日進度：': 'Today: ',
  '已完成': 'Completed',
  '獎勵：': 'Reward: ',
  '金幣': 'coins',
  '點擊領取獎勵': 'Click to claim your reward',
  '擊敗森林中的敵對生物': 'Defeat hostile creatures in the forest',
  '進度：': 'Progress: ',
  '這份委託尚未開始': 'This contract has not started',
  '點擊接受任務': 'Click to accept the quest',
  '礦脈調查': 'Vein Survey',
  '採集不同種類的礦物': 'Gather several types of ore',
  '目標：': 'Target: ',
  '個原礦': ' raw ores',
  '遠征補給箱': 'Expedition Supply Crate',
  '點擊查看詳細進度': 'Click to view detailed progress',
  '跨域運輸': 'Cross-Region Delivery',
  '將補給送往指定城鎮': 'Deliver supplies to the assigned town',
  '限制時間：': 'Time limit: ',
  '分鐘': ' minutes',
  '每週里程碑': 'Weekly Milestone',
  '完成每日委託累積星章': 'Complete daily contracts to earn stars',
  '目前：': 'Current: ',
  '原創範本：玩家常用功能與狀態切換': 'Original template: player utilities and status toggles',
  '旅人終端': 'Traveler Console',
  '等級：': 'Level: ',
  '群組：': 'Group: ',
  '在線時間：': 'Playtime: ',
  '私人訊息：接收中': 'Private Messages: Enabled',
  '其他玩家可以傳送訊息給你': 'Other players can message you',
  '點擊切換為勿擾': 'Click to enable do-not-disturb',
  '私人訊息：勿擾': 'Private Messages: Do Not Disturb',
  '目前不接收其他玩家的訊息': 'Messages from other players are blocked',
  '點擊重新開啟': 'Click to enable messages',
  '返回據點': 'Return Home',
  '傳送至你設定的家': 'Travel to your saved home',
  '指令：': 'Command: ',
  '信件匣': 'Mailbox',
  '收取系統與玩家寄送的物品': 'Collect deliveries from the server and players',
  '未讀信件：': 'Unread mail: ',
  '外觀衣櫥': 'Cosmetic Wardrobe',
  '管理稱號、粒子與造型': 'Manage titles, particles, and styles',
  '隱私設定': 'Privacy Settings',
  '管理傳送、交易與邀請偏好': 'Manage teleport, trade, and invite preferences',
  '旅程統計': 'Journey Statistics',
  '查看探索、戰鬥與收集紀錄': 'View exploration, combat, and collection records',
  '關閉終端': 'Close Console',
  '原創範本：社群資訊、活動與回饋入口': 'Original template: community news, events, and feedback',
  '微光廣場': 'Glimmer Square',
  '最新公告': 'Latest News',
  '掌握更新、維護與活動資訊': 'Read update, maintenance, and event news',
  '點擊閱讀': 'Click to read',
  '活動日曆': 'Event Calendar',
  '下一場活動：': 'Next event: ',
  '點擊查看完整時程': 'Click to view the full schedule',
  '尋找夥伴': 'Find a Party',
  '建立隊伍或加入其他冒險者': 'Create a party or join other adventurers',
  '一起完成更困難的挑戰': 'Take on harder challenges together',
  '意見信箱': 'Feedback Box',
  '回報問題或提供建議': 'Report a problem or share a suggestion',
  '請勿提交個人敏感資料': 'Do not submit sensitive personal data',
  '社群守則': 'Community Rules',
  '友善交流、尊重創作': 'Be kind and respect other people’s work',
  '共同維護舒適的遊戲環境': 'Help maintain a welcoming game environment'
};

const JA_TRANSLATIONS = {
  ...EN_TRANSLATIONS,
  '原創範本：以太空航站為主題的入口導航': 'オリジナルテンプレート：宇宙ステーション風ナビゲーション',
  '星光航站': 'スターライト駅',
  '的航行證': 'のトラベルパス',
  '目前世界：': '現在のワールド：',
  '經濟餘額：': '所持金：',
  '點擊查看個人資訊': 'クリックしてプロフィールを表示',
  '生存星域': 'サバイバルエリア',
  '回到主要生存世界': 'メインのサバイバルワールドへ戻る',
  '適合建築、採集與冒險': '建築・採集・冒険を楽しめます',
  '點擊傳送': 'クリックして移動',
  '資源小行星': '資源アステロイド',
  '定期重置的採集區域': '定期的にリセットされる採集エリア',
  '離開前記得帶走物品': '退出前にアイテムを持ち帰ってください',
  '創意工坊': 'クリエイティブ工房',
  '展示作品與測試建築': '作品の展示や建築テストができます',
  '在這裡讓想法成形': 'アイデアを形にしましょう',
  '本週活動': '今週のイベント',
  '查看目前進行中的活動': '開催中のイベントを確認',
  '包含時間、規則與獎勵': '日時・ルール・報酬を掲載',
  '航站服務台': '駅案内所',
  '需要協助或不知道去哪裡？': 'ヘルプや行き先の案内が必要ですか？',
  '點擊開啟新手指引': 'クリックして初心者ガイドを開く',
  '原創範本：用不同狀態呈現每日任務': 'オリジナルテンプレート：状態別デイリークエスト',
  '遠征委託看板': '遠征依頼ボード',
  '林地清剿': '森林討伐',
  '今日進度：': '本日の進捗：',
  '已完成': '完了',
  '獎勵：': '報酬：',
  '金幣': 'コイン',
  '點擊領取獎勵': 'クリックして報酬を受け取る',
  '擊敗森林中的敵對生物': '森の敵対Mobを倒す',
  '進度：': '進捗：',
  '這份委託尚未開始': 'この依頼はまだ開始されていません',
  '點擊接受任務': 'クリックしてクエストを受注',
  '礦脈調查': '鉱脈調査',
  '採集不同種類的礦物': '複数種類の鉱石を採集する',
  '目標：': '目標：',
  '個原礦': '個の原石',
  '遠征補給箱': '遠征補給箱',
  '點擊查看詳細進度': 'クリックして詳細を確認',
  '跨域運輸': '地域間輸送',
  '將補給送往指定城鎮': '指定された町へ物資を届ける',
  '限制時間：': '制限時間：',
  '分鐘': '分',
  '每週里程碑': '週間マイルストーン',
  '完成每日委託累積星章': 'デイリー依頼を完了してスターを獲得',
  '目前：': '現在：',
  '原創範本：玩家常用功能與狀態切換': 'オリジナルテンプレート：個人機能と状態切替',
  '旅人終端': '旅人コンソール',
  '等級：': 'レベル：',
  '群組：': 'グループ：',
  '在線時間：': 'プレイ時間：',
  '私人訊息：接收中': '個人メッセージ：受信中',
  '其他玩家可以傳送訊息給你': '他のプレイヤーからメッセージを受信します',
  '點擊切換為勿擾': 'クリックして受信を停止',
  '私人訊息：勿擾': '個人メッセージ：受信停止',
  '目前不接收其他玩家的訊息': '他のプレイヤーからのメッセージを拒否中',
  '點擊重新開啟': 'クリックして受信を再開',
  '返回據點': 'ホームへ戻る',
  '傳送至你設定的家': '設定したホームへ移動',
  '指令：': 'コマンド：',
  '信件匣': 'メールボックス',
  '收取系統與玩家寄送的物品': 'システムやプレイヤーからの配送を受け取る',
  '未讀信件：': '未読メール：',
  '外觀衣櫥': 'コスメ衣装棚',
  '管理稱號、粒子與造型': '称号・パーティクル・外観を管理',
  '隱私設定': 'プライバシー設定',
  '管理傳送、交易與邀請偏好': 'テレポート・取引・招待の設定を管理',
  '旅程統計': '冒険の統計',
  '查看探索、戰鬥與收集紀錄': '探索・戦闘・収集の記録を表示',
  '關閉終端': 'コンソールを閉じる',
  '原創範本：社群資訊、活動與回饋入口': 'オリジナルテンプレート：お知らせ・イベント・フィードバック',
  '微光廣場': 'きらめき広場',
  '最新公告': '最新のお知らせ',
  '掌握更新、維護與活動資訊': '更新・メンテナンス・イベント情報を確認',
  '點擊閱讀': 'クリックして読む',
  '活動日曆': 'イベントカレンダー',
  '下一場活動：': '次のイベント：',
  '點擊查看完整時程': 'クリックして全日程を表示',
  '尋找夥伴': '仲間を探す',
  '建立隊伍或加入其他冒險者': 'パーティーを作成、または参加',
  '一起完成更困難的挑戰': '仲間と難しい挑戦に挑もう',
  '意見信箱': 'フィードバック',
  '回報問題或提供建議': '問題の報告や提案を送信',
  '請勿提交個人敏感資料': '個人情報を入力しないでください',
  '社群守則': 'コミュニティルール',
  '友善交流、尊重創作': '親切に交流し、創作物を尊重しましょう',
  '共同維護舒適的遊戲環境': '快適なゲーム環境を一緒に守りましょう'
};

const ZH_CN_TRANSLATIONS = {
  '原創範本：以太空航站為主題的入口導航': '原创模板：以太空航站为主题的入口导航',
  '伺服器': '服务器', '導航': '导航', '的航行證': '的航行证', '目前世界：': '当前世界：',
  '經濟餘額：': '经济余额：', '點擊查看個人資訊': '点击查看个人信息', '生存星域': '生存星域',
  '回到主要生存世界': '返回主要生存世界', '適合建築、採集與冒險': '适合建筑、采集与冒险',
  '點擊傳送': '点击传送', '資源小行星': '资源小行星', '定期重置的採集區域': '定期重置的采集区域',
  '離開前記得帶走物品': '离开前记得带走物品', '創意工坊': '创意工坊',
  '展示作品與測試建築': '展示作品与测试建筑', '在這裡讓想法成形': '在这里让想法成形',
  '本週活動': '本周活动', '查看目前進行中的活動': '查看当前进行中的活动',
  '包含時間、規則與獎勵': '包含时间、规则与奖励', '航站服務台': '航站服务台',
  '需要協助或不知道去哪裡？': '需要协助或不知道去哪里？', '點擊開啟新手指引': '点击打开新手指引',
  '原創範本：用不同狀態呈現每日任務': '原创模板：用不同状态呈现每日任务',
  '遠征委託看板': '远征委托看板', '林地清剿': '林地清剿', '今日進度：': '今日进度：',
  '已完成': '已完成', '獎勵：': '奖励：', '金幣': '金币', '點擊領取獎勵': '点击领取奖励',
  '擊敗森林中的敵對生物': '击败森林中的敌对生物', '進度：': '进度：',
  '這份委託尚未開始': '这份委托尚未开始', '點擊接受任務': '点击接受任务',
  '礦脈調查': '矿脉调查', '採集不同種類的礦物': '采集不同种类的矿物',
  '目標：': '目标：', '個原礦': '个原矿', '遠征補給箱': '远征补给箱',
  '點擊查看詳細進度': '点击查看详细进度', '跨域運輸': '跨域运输',
  '將補給送往指定城鎮': '将补给送往指定城镇', '限制時間：': '限制时间：',
  '分鐘': '分钟', '每週里程碑': '每周里程碑', '完成每日委託累積星章': '完成每日委托累积星章',
  '目前：': '当前：', '原創範本：玩家常用功能與狀態切換': '原创模板：玩家常用功能与状态切换',
  '旅人終端': '旅人终端', '等級：': '等级：', '群組：': '群组：', '在線時間：': '在线时间：',
  '私人訊息：接收中': '私人消息：接收中', '其他玩家可以傳送訊息給你': '其他玩家可以发送消息给你',
  '點擊切換為勿擾': '点击切换为勿扰', '私人訊息：勿擾': '私人消息：勿扰',
  '目前不接收其他玩家的訊息': '当前不接收其他玩家的消息', '點擊重新開啟': '点击重新开启',
  '返回據點': '返回据点', '傳送至你設定的家': '传送至你设置的家', '指令：': '指令：',
  '信件匣': '信箱', '收取系統與玩家寄送的物品': '收取系统与玩家寄送的物品',
  '未讀信件：': '未读邮件：', '外觀衣櫥': '外观衣橱', '管理稱號、粒子與造型': '管理称号、粒子与造型',
  '隱私設定': '隐私设置', '管理傳送、交易與邀請偏好': '管理传送、交易与邀请偏好',
  '旅程統計': '旅程统计', '查看探索、戰鬥與收集紀錄': '查看探索、战斗与收集记录',
  '關閉終端': '关闭终端', '原創範本：社群資訊、活動與回饋入口': '原创模板：社区信息、活动与反馈入口',
  '微光廣場': '微光广场', '最新公告': '最新公告', '掌握更新、維護與活動資訊': '掌握更新、维护与活动信息',
  '點擊閱讀': '点击阅读', '活動日曆': '活动日历', '下一場活動：': '下一场活动：',
  '點擊查看完整時程': '点击查看完整日程', '尋找夥伴': '寻找伙伴',
  '建立隊伍或加入其他冒險者': '建立队伍或加入其他冒险者', '一起完成更困難的挑戰': '一起完成更困难的挑战',
  '意見信箱': '意见信箱', '回報問題或提供建議': '报告问题或提供建议',
  '請勿提交個人敏感資料': '请勿提交个人敏感信息', '社群守則': '社区守则',
  '友善交流、尊重創作': '友善交流、尊重创作', '共同維護舒適的遊戲環境': '共同维护舒适的游戏环境'
};

function normalizeTemplateLanguage(language) {
  if (language === 'zh_TW' || language === 'zh_CN' || language === 'ja_JP') return language;
  return 'en';
}

function replaceTranslations(yaml, translations) {
  return Object.entries(translations)
    .sort(([a], [b]) => b.length - a.length)
    .reduce((result, [source, translated]) => result.replaceAll(source, translated), yaml);
}

export function getLocalizedTemplateLibrary(language) {
  const normalizedLanguage = normalizeTemplateLanguage(language);
  const translations = normalizedLanguage === 'zh_CN'
    ? ZH_CN_TRANSLATIONS
    : normalizedLanguage === 'ja_JP'
      ? JA_TRANSLATIONS
      : normalizedLanguage === 'en'
        ? EN_TRANSLATIONS
        : {};

  return Object.fromEntries(
    Object.entries(TEMPLATE_LIBRARY).map(([id, template]) => [
      id,
      {
        label: TEMPLATE_LABELS[normalizedLanguage][id],
        yaml: replaceTranslations(template.yaml, translations)
      }
    ])
  );
}

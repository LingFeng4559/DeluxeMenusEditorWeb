export const SAMPLE_MENU = `
# 要求教學選單 v1.0
menu_title: '<shift:-37><glyph:brgui1><shift:-192>&6&0菜單'
open_command: menu
size: 54

items:
  'teststone':
    material: Clock
    damage: 0
    slot: 0
    display_name: "&a輸入[SHIFT+F]或/menu打開菜單"
    lore:
      - '&f可以不用把時鐘一直放在身上喔!'

  'stick':
    material: stick
    damage: 0
    slot: 1
    display_name: "&a使用木棒創建領地"
    lore:
      - "&f預設為10個領地，大小為100*100"
      - "&f也可以考慮使用/res auto自動創建"

  'white_bed':
    material: white_bed
    damage: 0
    slot: 2
    display_name: "&a個人傳送點設定"
    lore:
      - "&f輸入/sethome (名稱) 創建個人傳送點"
      - "&f輸入/home (名稱) 傳送到個人傳送點"
    left_click_commands:
      - '[player] home'
      - '[sound] BLOCK.NOTE_BLOCK.HAT'

  'serverinfo_shop':
    material: 'hdb-23223'
    slot: 5
    display_name: '&a其他資訊'
    lore:
      - '&7伺服器的相關設定與資訊'
    left_click_commands:
      - '[player] dm open serverinfo'
      - '[sound] BLOCK.NOTE_BLOCK.HAT'

  'filler_item':
    material: BLACK_STAINED_GLASS_PANE
    slots:
      - 9
      - 10
      - 11
      - 12
      - 13
      - 14
      - 15
      - 16
      - 17
    display_name: ' '
`;

export const SAMPLE_SHOP = `
menu_title: '&a&l伺服器官方商店'
open_command: shop
size: 54

items:
  'diamond_sword':
    material: DIAMOND_SWORD
    slot: 11
    display_name: '&b&l神聖鑽石劍'
    lore:
      - '&7攻擊力: +8'
      - '&e價格: 500 金幣'
    left_click_commands:
      - '[player] buy diamond_sword'

  'golden_apple':
    material: GOLDEN_APPLE
    amount: 16
    slot: 15
    display_name: '&e&l金色果實 x16'
    lore:
      - '&7強效恢復生命值'
      - '&e價格: 200 金幣'
    left_click_commands:
      - '[player] buy golden_apple 16'
`;

export const SAMPLE_VIP = `
menu_title: '&d&lVIP 特權與禮包選單'
open_command: vip
size: 27

items:
  'vip_reward':
    material: NETHER_STAR
    slot: 13
    display_name: '&6&l每日 VIP 禮包'
    lore:
      - '&f點擊領取您的每日專屬獎勵！'
    left_click_commands:
      - '[player] kit vip'
`;

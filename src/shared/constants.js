module.exports = Object.freeze({
  PLAYER_RADIUS: 40,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 400,
  PLAYER_FIRE_COOLDOWN: 0.25,
  PLAYER_MOUSE_MAX_DISTANCE: 250,

  BULLET_RADIUS: 10,
  BULLET_SPEED: 800,
  BULLET_DAMAGE: 5,

  ITEM_MAX_HEATH: 5,
  ITEM_HEATH_HP: 30,
  ITEM_HEATH_RADIUS: 20,

  ITEM_MAX_GUN: 3,
  ITEM_GUN_BONUS: 1,
  ITEM_GUN_RADIUS: 20,

  ITEM_MAX_ALIGN_X: 50,
  ITEM_MAX_ALIGN_Y: 50,

  SCORE_BULLET_HIT: 30,
  SCORE_PER_SECOND: 1,
  HP_PER_SECOND: 2,

  SPARKLING_FRAME_COUNT: 8,
  SPARKLING_RADIUS: 40,

  EXPLOSION_FRAME_COUNT: 13,
  EXPLOSION_RADIUS: 80,

  BOMB_RADIUS: 50,
  BOMB_DAMAGE_PER_FRAME: 2,
  BOMB_MAX_NUM_ON_MAP: 15,

  PLANET_FRAME_COUNT: 11,
  PLANET_WIDTH: 336,
  PLANET_HEIGHT: 189,

  MAP_SIZE: 5000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    MOUSEPOS: 'mousepos',
    GAME_OVER: 'dead',
    INPUT_MOUSE_LEFT_CLICK: 'mouseleftclick',
  },

  ID_BOTS: [
    BOT_ONE = 0,
    BOT_TWO = 1,
    BOT_THREE = 2,
    BOT_FOUR = 3,
    BOT_FINE = 4,
  ],

  NAME_BOTS: [
    BOT_ONE = 'bot_1',
    BOT_TWO = 'bot_2',
    BOT_THREE = 'bot_3',
    BOT_FOUR = 'bot_4',
    BOT_FINE = 'bot_5',
  ],

  SHIP_BOTS: [
    BOT_ONE = 'spritesheet.png',
    BOT_TWO = 'spritesheet2.png',
    BOT_THREE = 'spritesheet3.png',
    BOT_FOUR = 'spritesheet4.png',
    BOT_FINE = 'spritesheet5.png',
  ],

  AMOUNT_OF_BOTS: 5,
});

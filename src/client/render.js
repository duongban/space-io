import { debounce } from 'throttle-debounce';
import { getAsset, getJson } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

function render() {
  const { me, others, bullets, heathitems, gunitems, sparklings, explosions, planets, bombs } = getCurrentState();
  if (!me) {
    return;
  }

  // Draw background
  //renderBackgroundMainMenu(me.x, me.y);
  renderBackground(me.x, me.y);

  // Draw boundaries
  context.strokeStyle = 'white';
  context.lineWidth = 1;
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

  // Draw all  Planet
  if(planets != undefined)
    planets.forEach(renderPlanet.bind(null, me));

  // Draw all  bomb
  if(bombs != undefined)
    bombs.forEach(renderBomb.bind(null, me));

  // Draw all bullets
  bullets.forEach(renderBullet.bind(null, me));


  // Draw all  heath items
  heathitems.forEach(renderHeathItem.bind(null, me));

  // Draw all  gun items
  gunitems.forEach(renderGunItem.bind(null, me));

  // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));

  // Draw all  sparkling
  sparklings.forEach(renderSparkling.bind(null, me));

  // Draw all  explosions
  explosions.forEach(renderExplosion.bind(null, me));

}

function renderBackgroundMainMenu(x, y) {
  const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
  const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
  const backgroundGradient = context.createRadialGradient(
    backgroundX,
    backgroundY,
    MAP_SIZE / 10,
    backgroundX,
    backgroundY,
    MAP_SIZE / 2,
  );
  backgroundGradient.addColorStop(0, 'black');
  backgroundGradient.addColorStop(1, 'gray');
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function renderBackground(x, y) {

  const canvasX = canvas.width / 2 - x;
  const canvasY = canvas.height / 2 - y;
  var img = getAsset('SpaceBackground-12.jpg');
  context.save();
  context.translate(canvasX, canvasY);
  for (var x = -MAP_SIZE/3; x < MAP_SIZE * 4 / 3; x += img.width) {
    for (var y = -MAP_SIZE/3; y < MAP_SIZE * 4 / 3; y += img.height) {
      context.drawImage(img, x, y);
    }
  }
  context.restore();
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, direction } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  // Draw ship
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  let currentFR = getJson('spritesheet.json').frames[parseInt(me.current_frame)].frame;

  var shiptype = player.shiptype;
  var name = player.name;
  if (name.substring(name.length - 3, name.length) === 'NaN') {
    name = name.substring(0, name.length - 3);
  }

  if (shiptype.substring(shiptype.length - 3, shiptype.length) === 'NaN') {
    shiptype = shiptype.substring(0, shiptype.length - 3);
  }
  context.drawImage(
    getAsset(shiptype),
    currentFR.x,
    currentFR.y,
    currentFR.w,
    currentFR.h,
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );
  context.restore();
  // Draw health bar
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 15,
    PLAYER_RADIUS * 2,
    2,
  );
  context.restore();

  context.fillStyle = '#43ea43';
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 15,
    PLAYER_RADIUS * 2 * (player.hp / PLAYER_MAX_HP),
    2,
  );
  context.restore();
  
  context.fillStyle = 'yellow';
  context.font = "15px Arial";
  context.fillText(name, canvasX - context.measureText(name).width / 2, canvasY + PLAYER_RADIUS + 7);
  context.restore();

  // context.moveTo(canvasX + Math.sin(direction),
  //   canvasY - PLAYER_RADIUS/2  - Math.cos(direction));
  // context.lineTo(canvasX,
  //   canvasY);
  // context.strokeStyle = "yellow";
  // context.stroke();
  // context.restore();
}

function renderBullet(me, bullet) {
  const { x, y, direction} = bullet;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  context.drawImage(
    getAsset('bullet.png'),
    - BULLET_RADIUS,
    - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );
  context.restore();
}

function renderHeathItem(me, item) {
  const { x, y } = item;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  context.save();
  context.translate(canvasX, canvasY);
  context.drawImage(
    getAsset('HP_Bonus.png'),
    - Constants.ITEM_HEATH_RADIUS,
    - Constants.ITEM_HEATH_RADIUS,
    Constants.ITEM_HEATH_RADIUS * 2,
    Constants.ITEM_HEATH_RADIUS * 2,
  );
  context.restore();
}

function renderGunItem(me, item) {
  const { x, y } = item;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  context.save();
  context.translate(canvasX, canvasY);
  context.drawImage(
    getAsset('Damage_Bonus.png'),
    - Constants.ITEM_GUN_RADIUS,
    - Constants.ITEM_GUN_RADIUS,
    Constants.ITEM_GUN_RADIUS * 2,
    Constants.ITEM_GUN_RADIUS * 2,
  );
  context.restore();
}


function renderSparkling(me, item) {
  const { x, y } = item;
  let currentFR = getJson('spritesheetspark.json').frames[parseInt(item.current_frame)].frame;
  context.drawImage(
    getAsset('spritesheetspark.png'),
    currentFR.x,
    currentFR.y,
    currentFR.w,
    currentFR.h,
    canvas.width / 2 + x - me.x - Constants.SPARKLING_RADIUS,
    canvas.height / 2 + y - me.y - Constants.SPARKLING_RADIUS,
    Constants.SPARKLING_RADIUS * 2,
    Constants.SPARKLING_RADIUS * 2,
  );
}

function renderExplosion(me, item) {
  const { x, y } = item;
  let currentFR = getJson('spritesheetexplosion.json').frames[parseInt(item.current_frame)].frame;
  context.drawImage(
    getAsset('spritesheetexplosion.png'),
    currentFR.x,
    currentFR.y,
    currentFR.w,
    currentFR.h,
    canvas.width / 2 + x - me.x - Constants.EXPLOSION_RADIUS,
    canvas.height / 2 + y - me.y - Constants.EXPLOSION_RADIUS,
    Constants.EXPLOSION_RADIUS * 2,
    Constants.EXPLOSION_RADIUS * 2,
  );
}

function renderPlanet(me, item) {
  const { x, y } = item;
  //console.log(item);
  if (item.sprite.substring(item.sprite.length - 3, item.sprite.length) === 'NaN')
    item.sprite = item.sprite.substring(0, item.sprite.length - 3);
  if (item.size.substring(item.size.length - 3, item.size.length) === 'NaN')
    item.size = item.size.substring(0, item.size.length - 3);
  let currentFR = getJson(JSON.parse(item.sprite).Sprite_Json).frames[parseInt(item.current_frame)].frame;
  context.drawImage(
    getAsset(JSON.parse(item.sprite).Sprite_Png),
    currentFR.x,
    currentFR.y,
    currentFR.w,
    currentFR.h,
    canvas.width / 2 + x - me.x - Constants.EXPLOSION_RADIUS,
    canvas.height / 2 + y - me.y - Constants.EXPLOSION_RADIUS,
    JSON.parse(item.size).w,
    JSON.parse(item.size).h,
  );
}

function renderBomb(me, item) {
  const { x, y } = item;
  //console.log(item);
  if (item.sprite.substring(item.sprite.length - 3, item.sprite.length) === 'NaN')
    item.sprite = item.sprite.substring(0, item.sprite.length - 3);
  if (item.size.substring(item.size.length - 3, item.size.length) === 'NaN')
    item.size = item.size.substring(0, item.size.length - 3);
  let currentFR = getJson(JSON.parse(item.sprite).Sprite_Json).frames[parseInt(item.current_frame)].frame;
  context.drawImage(
    getAsset(JSON.parse(item.sprite).Sprite_Png),
    currentFR.x,
    currentFR.y,
    currentFR.w,
    currentFR.h,
    canvas.width / 2 + x - me.x - Constants.BOMB_RADIUS,
    canvas.height / 2 + y - me.y - Constants.BOMB_RADIUS,
    JSON.parse(item.size).w/2,
    JSON.parse(item.size).h/2,
  );
}


function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackgroundMainMenu(x, y);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}

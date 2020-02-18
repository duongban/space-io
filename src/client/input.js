import { updateDirection, updateSpeedUp, updateMousePos} from './networking';

const canvas = document.getElementById('game-canvas');

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
}

function onMouseClick(e) {
  if (e.which == 1) {
    //updateSpeedUp();
  }
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function distance(posA, posB){
  const dx = posA.x - posB.x;
  const dy = posA.y - posB.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function handleInput(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  const x_t = x - window.innerWidth / 2;
  const y_t = window.innerHeight / 2 - y;
  const pos = {x: x, y: y};
  const mePos = {x: canvas.width/2, y: canvas.height/2};
  const dis = distance(mePos, pos);
  updateDirection(dir);
  updateMousePos({distance: dis});
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('click', onMouseClick);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('click', onMouseClick);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);
}

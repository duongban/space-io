const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');
const Animation = require('./animation');

class Player extends ObjectClass {
  constructor(id, username, x, y, shiptype) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
    this.anim = new Animation();
    this.anim.FrameRate = 20;
    this.anim.FramesLimit = 19;
    this.ShipType = shiptype;
    this.GunQuantity = 1;
    this.isSpeedUp = false;
    this.mousePos = {distance:0}; 
    this.currentSpeed = this.speed;
    this.directionPos = {x:0, y:0};
    this.directionPos.x = this.x;
    this.directionPos.y = this.y - Constants.PLAYER_RADIUS;

    this.move = 0;
  }

  // Returns a newly created bullet, or null.
  update(dt) {

    const realSpeed = this.mousePos.distance/Constants.PLAYER_MOUSE_MAX_DISTANCE;
    this.speed = (realSpeed > 1.0) ? this.currentSpeed : realSpeed*this.currentSpeed;

    super.update(dt);
    this.directionPos.x += dt * this.speed * Math.sin(this.direction);
    this.directionPos.y -= dt * this.speed * Math.cos(this.direction);
    this.anim.OnAnimate();

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    this.hp += dt*Constants.HP_PER_SECOND;
    if (this.hp > Constants.PLAYER_MAX_HP) {
      this.hp = Constants.PLAYER_MAX_HP;
    }

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // Fire a bullet, if needed
    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0) {
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      let bullets = [];
      for (let i = 0; i < this.GunQuantity; i++) {

        if ((i + 1) % 2 == 0) {
          let deltadir = (i + 1) / 2 * 0.2;
          bullets.push(new Bullet(this.id, this.x, this.y, this.direction + deltadir));
        }
        else {
          let deltadir = i / 2 * 0.2;
          bullets.push(new Bullet(this.id, this.x, this.y, this.direction - deltadir));
        }
      }
      return bullets;
    }

    return null;
  }

  setMousePos(pos){
    //console.log(this.mousePos);
    this.mousePos = pos;
  }

  speedUp()
  {
    this.currentSpeed = this.currentSpeed + 100;
  }

  takeDamage(dame) {
    this.hp -= dame;
  }

  takeHeal() {
    this.hp += Constants.ITEM_HEATH_HP;
    if (this.hp > Constants.PLAYER_MAX_HP) {
      this.hp = Constants.PLAYER_MAX_HP;
    }
  }

  takeGun() {
    this.GunQuantity += Constants.ITEM_GUN_BONUS;
    if (this.GunQuantity > Constants.ITEM_MAX_GUN) {
      this.GunQuantity = Constants.ITEM_MAX_GUN;
    }
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
      current_frame: this.anim.CurrentFrame,
      shiptype: String(this.ShipType),
      name: this.username,
    };
  }
}

module.exports = Player;

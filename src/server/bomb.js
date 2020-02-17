const ObjectClass = require('./object');
const Constants = require('../shared/constants');
const Animation = require('./animation');
const shortid = require('shortid');

class BomB extends ObjectClass {
  constructor(x, y, dir, size, sprites, frameLimit, frameRate) {
    super(shortid(),x, y, dir);
    
    this.radius = Constants.BOMB_RADIUS;
    this.parentID = null;
    this.anims = {idle: new Animation(), explosion: new Animation()};
    this.anims.idle.FrameRate = frameRate.idle;
    this.anims.idle.FramesLimit = frameLimit.idle;
    this.anims.explosion.FrameRate = frameRate.explosion;
    this.anims.explosion.FramesLimit = frameLimit.explosion;
    this.anims.idle.Oscillate = false;
    this.anims.explosion.Oscillate = false;
    this.sprites = sprites;
    this.animPlay = "idle";
    this.size = size;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    if(this.anims[this.animPlay].CurrentFrame >= this.anims[this.animPlay].FramesLimit - 1 && this.animPlay == "explosion")
    {    
      return true;
    }

    this.anims[this.animPlay].OnAnimate();
    return false;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      //direction: this.direction,
      current_frame: this.anims[this.animPlay].CurrentFrame,
      size: this.animPlay == "idle" ? JSON.stringify(this.size.idle) : JSON.stringify(this.size.explosion) ,   
      sprite: JSON.stringify(this.sprites[this.animPlay])  
    };
  }
}

module.exports = BomB;

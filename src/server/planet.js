const ObjectClass = require('./object');
const Constants = require('../shared/constants');
const Animation = require('./animation');
const shortid = require('shortid');

class Planet extends ObjectClass {
  constructor(x, y, dir, size, sprite, frameLimit, frameRate) {
    super(shortid(),x, y, dir);
    this.radius = Constants.EXPLOSION_RADIUS;
    this.parentID = null;
    this.anim = new Animation();
    this.anim.FrameRate = frameRate;
    this.anim.FramesLimit = frameLimit;
    this.anim.Oscillate = false;
    this.size = size;
    this.sprite = sprite;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    this.anim.OnAnimate();
    return false;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      //direction: this.direction,
      current_frame: this.anim.CurrentFrame,   
      size: JSON.stringify(this.size),
      sprite: JSON.stringify(this.sprite)  
    };
  }
}

module.exports = Planet;

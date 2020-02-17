const ObjectClass = require('./object');
const Constants = require('../shared/constants');
const Animation = require('./animation');
const shortid = require('shortid');

class explosion extends ObjectClass {
  constructor(x, y, dir) {
    super(shortid(),x, y, dir);
    this.radius = Constants.EXPLOSION_RADIUS;
    this.parentID = null;
    this.anim = new Animation();
    this.anim.FrameRate = 50;
    this.anim.FramesLimit = Constants.EXPLOSION_FRAME_COUNT;
    this.anim.Oscillate = false;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    if(this.anim.CurrentFrame >= Constants.EXPLOSION_FRAME_COUNT - 1)
    {   
      return true;
    }
    this.anim.OnAnimate();
    return false;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      //direction: this.direction,
      current_frame: this.anim.CurrentFrame,     
    };
  }
}

module.exports = explosion;

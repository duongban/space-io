const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class ItemHeath extends ObjectClass {
  constructor(x, y, dir) {
    super(shortid(),x, y, dir);
    this.hp = Constants.ITEM_HEATH_HP;
    this.radius = Constants.ITEM_HEATH_RADIUS;
    this.parentID = null;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    
  }
}

module.exports = ItemHeath;

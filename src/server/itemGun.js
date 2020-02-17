const ObjectClass = require('./object');
const Constants = require('../shared/constants');
const shortid = require('shortid');
class ItemGun extends ObjectClass {
  constructor(x, y, dir) {
    super(shortid(), x, y, dir, 0);
    this.radius = Constants.ITEM_GUN_RADIUS;
    this.parentID = null;
  }
  // Returns true if the bullet should be destroyed
  update(dt) {
    
  }
}

module.exports = ItemGun;

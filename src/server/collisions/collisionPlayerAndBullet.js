const Constants = require('../../shared/constants');
var damagedPlayerMap = new Map();

// Returns an array of bullets to be destroyed.
function applyCollisions(players, bullets) {
  resetDamagedPlayerMap();
  const destroyedBullets = [];
  // var damagedPlayerMap = new Map();
  for (let i = 0; i < bullets.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < players.length; j++) {
      const bullet = bullets[i];
      const player = players[j];
      if (
        bullet.parentID !== player.id &&
        player.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet);
        player.takeDamage(Constants.BULLET_DAMAGE);
        //Add id ship take damage and ship shoot bullet
        if (!isNaN(player.id)) {
          damagedPlayerMap.set(player.id, bullet.parentID);
        }
        // if (isNaN(bullet.parentID)) {
        //   damagedPlayerMap.set(player.id, {parentID: bullet.parentID, hit: true});
        //   // console.log(damagedPlayerMap);
        // }
        break;
      }
    }
  }
  // return destroyedBullets;
  return {
    destroyedBullets,
    damagedPlayerMap
  }
}

function resetDamagedPlayerMap() {
  if (damagedPlayerMap.size == 0) {
    return;
  }
  var i;
  for (i = 0; i < Constants.AMOUNT_OF_BOTS; i++) {
    var pair = damagedPlayerMap.get(Constants.ID_BOTS[i]);
    if (pair) {
      pair.hit = false;
    }
  }
}

module.exports = applyCollisions;

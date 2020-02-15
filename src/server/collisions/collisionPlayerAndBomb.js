const Constants = require('../../shared/constants');

// Returns an array of bombs to be destroyed.
function applyCollisions(players, bombs) {
  const destroyedBombs = [];
  for (let i = 0; i < bombs.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < players.length; j++) {
      const bomb = bombs[i];
      const player = players[j];
      if (
        bomb.parentID !== player.id &&
        player.distanceTo(bomb) <= Constants.PLAYER_RADIUS + (bomb.animPlay == "idle" ? Constants.BOMB_RADIUS : (Constants.BOMB_RADIUS + 20))
      ) {
        destroyedBombs.push(bomb);
        player.takeDamage(Constants.BOMB_DAMAGE_PER_FRAME);
        //break;
      }
    }
  }
  return destroyedBombs;
}

module.exports = applyCollisions;

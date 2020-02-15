const Constants = require('../../shared/constants');

// Returns an array of items to be destroyed.
function applyCollisionsItem(players, items) {
    const destroyedItem = [];
    for (let i = 0; i < items.length; i++) {
        // Look for a player (who didn't create the bullet) to collide each bullet with.
        // As soon as we find one, break out of the loop to prevent double counting a bullet.
        for (let j = 0; j < players.length; j++) {
            const item = items[i];
            const player = players[j];
            if (
                player.distanceTo(item) <= Constants.PLAYER_RADIUS + item.radius
            ) {
                item.parentID = player.id;
                destroyedItem.push(item);
                break;
            }
        }
    }
    return destroyedItem;
}

module.exports = applyCollisionsItem;

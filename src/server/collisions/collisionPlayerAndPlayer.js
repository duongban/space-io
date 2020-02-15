const Constants = require('../../shared/constants');

function distance(objectA, objectB) {
    const dx = objectA.x - objectB.x;
    const dy = objectA.y - objectB.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Returns an array of bullets to be destroyed.
function applyCollisions(players, otherPlayers, dt) {
    for (let i = 0; i < otherPlayers.length; i++) {
        // Look for a player (who didn't create the bullet) to collide each bullet with.
        // As soon as we find one, break out of the loop to prevent double counting a bullet.
        for (let j = 0; j < players.length; j++) {
            const otherPlayer = otherPlayers[i];
            const player = players[j];
            if (
                otherPlayer.id !== player.id &&
                player.distanceTo(otherPlayer) <= (Constants.PLAYER_RADIUS - 5 + Constants.PLAYER_RADIUS - 5)
            ) {

                dame_player = player.hp;
                dame_other = otherPlayer.hp;
                player.takeDamage(dame_other);
                otherPlayer.takeDamage(dame_player);
                // if(player.speed > otherPlayer.speed){
                //     otherPlayer.x += (dt * (player.speed) * Math.sin(player.direction))*1.2;
                //     otherPlayer.y -= (dt * (player.speed) * Math.cos(player.direction))*1.2;
                // }            
                // else{
                //     player.x += -(dt * (player.speed) * Math.sin(player.direction));
                //     player.y -= -(dt * (player.speed) * Math.cos(player.direction));
                // }   
                break;
            }
        }
    }
}

module.exports = applyCollisions;

const throttleParent = require('throttle-debounce');
const Constants = require('../shared/constants');
const Player = require('./player');
const applyCollisionPlayerAndBullet = require('./collisions/collisionPlayerAndBullet');
const applyCollisionPlayerAndItem = require('./collisions/collisionPlayerAndItem');
const applyCollisionPlayerAndBomb = require('./collisions/collisionPlayerAndBomb');
const applyCollisionPlayerAndPlayer = require('./collisions/collisionPlayerAndPlayer');
const ItemHeath = require('./itemHeath');
const ItemGun = require('./itemGun');
const Sparkling = require('./Sparkling');
const Explosion = require('./explosion');
const Planet = require('./planet');
const Bomb = require('./bomb');
class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.heathItems = [];
    this.gunItems = [];
    this.sparklings = [];
    this.explosions = [];
    this.bombs = [];
    this.bots = [];

    this.planets = [];
    this.planets.push(new Planet(Constants.MAP_SIZE / 2, Constants.MAP_SIZE / 2, 0, { w: Constants.PLANET_WIDTH, h: Constants.PLANET_HEIGHT }, { Sprite_Json: 'spritesheet_planet_01.json', Sprite_Png: 'spritesheet_planet_01.png' }, 12, 250));
    this.planets.push(new Planet(Constants.MAP_SIZE / 4, Constants.MAP_SIZE / 5, 0, { w: 512, h: 512 }, { Sprite_Json: 'spritesheet_star_blue.json', Sprite_Png: 'spritesheet_star_blue.png' }, 4, 130));
    this.planets.push(new Planet(Constants.MAP_SIZE * 3 / 4, Constants.MAP_SIZE * 3.5 / 5, 0, { w: 512, h: 512 }, { Sprite_Json: 'spritesheet_star_ograne.json', Sprite_Png: 'spritesheet_star_ograne.png' }, 4, 130));
    this.planets.push(new Planet(Constants.MAP_SIZE * 2 / 4, Constants.MAP_SIZE * 4 / 5, 0, { w: 512, h: 512 }, { Sprite_Json: 'spritesheet_star_red.json', Sprite_Png: 'spritesheet_star_red.png' }, 4, 130));
    this.planets.push(new Planet(Constants.MAP_SIZE * 5.5 / 6, Constants.MAP_SIZE * 1.5 / 5, 0, { w: 512, h: 512 }, { Sprite_Json: 'spritesheet_star_yellow.json', Sprite_Png: 'spritesheet_star_yellow.png' }, 4, 130));
    this.planets.push(new Planet(Constants.MAP_SIZE * 6 / 7, Constants.MAP_SIZE * 7 / 8, 0, { w: 512, h: 512 }, { Sprite_Json: 'spritesheet_star_white.json', Sprite_Png: 'spritesheet_star_white.png' }, 4, 130));

    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    this.randomBomb = 13000;
    setInterval(this.update.bind(this), 1000 / 60);
    setInterval(this.addBombRandom.bind(this), this.randomBomb);

    this.lastUpdateBots = Date.now();
  }

  addBombRandom() {

    if (this.bombs.length < Constants.BOMB_MAX_NUM_ON_MAP) {
      let randomX = Math.floor(Math.random() * ((Constants.MAP_SIZE - 100) - 100 + 1) + 100);
      let randomY = Math.floor(Math.random() * ((Constants.MAP_SIZE - 100) - 100 + 1) + 100);
      this.bombs.push(new Bomb(randomX, randomY, 0,
        {
          idle: { w: 203, h: 203 },
          explosion: { w: 203, h: 203 },
        },
        {
          idle: { Sprite_Json: 'spritesheet_bomb_1_idle.json', Sprite_Png: 'spritesheet_bomb_1_idle.png' },
          explosion: { Sprite_Json: 'spritesheet_bomb_1_explosion.json', Sprite_Png: 'spritesheet_bomb_1_explosion.png' }
        },
        {
          idle: 10,
          explosion: 9
        },
        {
          idle: 100,
          explosion: 110
        }
      ))
    }
  }

  addPlayer(socket, data) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, data.UserName, x, y, data.ShipType);
  }

  addBot(socket, data) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    var x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    var y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    if (socket.id == 0) {
      x = 0;
      y = 0;
    }
    this.players[socket.id] = new Player(socket.id, data.UserName, x, y, data.ShipType);
  }

  addBots() {
    var count = 0;
    // while (Object.keys(this.players).length < Constants.AMOUNT_OF_BOTS) {
    while (count < Constants.AMOUNT_OF_BOTS) {
      var socket = require('socket.io-client')('http://localhost');
      socket.id = Constants.ID_BOTS[count];
      const data = { UserName: Constants.NAME_BOTS[count], ShipType: Constants.SHIP_BOTS[socket.id] };
      this.addBot(socket, data);
      count++;
    }
  }

  addBotDead(socket) {
    const data = { UserName: Constants.NAME_BOTS[socket.id], ShipType: Constants.SHIP_BOTS[socket.id] };
    this.addPlayer(socket, data);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];

    if (!isNaN(socket.id)) {
      this.addBotDead(socket);
    }
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  handleMousePos(socket, dis) {
    if (this.players[socket.id]) {
      this.players[socket.id].setMousePos(dis);
    }
  }

  handleMouseLeftClick(socket) {
    if (this.players[socket.id]) {
      this.players[socket.id].speedUp();
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

    const SparklingToRemove = [];
    this.sparklings.forEach(sparkling => {
      if (sparkling.update(dt)) {
        // Destroy this sparkling
        SparklingToRemove.push(sparkling);
      }
    });
    this.sparklings = this.sparklings.filter(sparkling => !SparklingToRemove.includes(sparkling));

    const ExplosionToRemove = [];
    this.explosions.forEach(Explosion => {
      if (Explosion.update(dt)) {
        // Destroy this sparkling
        ExplosionToRemove.push(Explosion);
      }
    });
    this.explosions = this.explosions.filter(Explosion => !ExplosionToRemove.includes(Explosion));

    const bombToRemove = [];
    this.bombs.forEach(bomb => {
      if (bomb.update(dt)) {
        // Destroy this sparkling
        bombToRemove.push(bomb);
      }
    });
    this.bombs = this.bombs.filter(bomb => !bombToRemove.includes(bomb));

    //update planet
    //const PlanetToRemove = [];
    this.planets.forEach(planet => {
      if (planet.update(dt)) {
        // Destroy this sparkling
        //ExplosionToRemove.push(Explosion);
      }
    });
    //this.explosions = this.explosions.filter(Explosion => !ExplosionToRemove.includes(Explosion));

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newBullets = player.update(dt);
      if (newBullets) {
        for (let i = 0; i < newBullets.length; i++) {
          this.bullets.push(newBullets[i]);
        }
      }

    });

    // Apply collisions, give players score for hitting bullets
    // const destroyedBullets = applyCollisionPlayerAndBullet(Object.values(this.players), this.bullets);
    const result = applyCollisionPlayerAndBullet(Object.values(this.players), this.bullets);
    const destroyedBullets = result.destroyedBullets;
    destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
        this.sparklings.push(new Sparkling(b.x, b.y, 0));
      }
    });
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    //Update bots
    var i;
    const damagedPlayerMap = result.damagedPlayerMap;

    const nowTime = Date.now();
    const diffTime = (nowTime - this.lastUpdateBots) / 1000;
    var flag = false;

    for (i = 0; i < Constants.AMOUNT_OF_BOTS; i++) {
      var player = this.players[Constants.ID_BOTS[i]];
      var socket = this.sockets[Constants.ID_BOTS[i]];
      if (player && socket) {
        if (diffTime > 0.3) {
          player.move = Math.floor((Math.random() * 2));
          flag = true;
        }
        //Get ship damage bot
        if (damagedPlayerMap.size != 0) {
          const playerIdDamage = damagedPlayerMap.get(Constants.ID_BOTS[i]);
          const playerEnemy = this.players[playerIdDamage];
          if (playerIdDamage) {
            if (this.players[playerIdDamage]) {
              var posShipX = this.players[playerIdDamage].x;
              var posShipY = this.players[playerIdDamage].y;
              var posBotX = this.players[Constants.ID_BOTS[i]].x;
              var posBotY = this.players[Constants.ID_BOTS[i]].y;
              if (posShipX > posBotX) {
                player.x += 1;
              } else {
                player.x -= 1;
              }

              if (posShipY > posBotY) {
                player.y += 1;
              } else {
                player.y -= 1;
              }
              var x = player.x;
              var y = player.y;

              const dir = -(playerEnemy.direction);
              this.handleInput(socket, dir);
            }
          } else {
            var dir = 0;
            switch (player.move) {
              case 0: {
                if (player.x < Constants.MAP_SIZE / 2) {
                  player.x += 1;
                  dir = 1.5;
                } else {
                  player.x -= 1;
                  dir = -1.5;
                }
              };
              case 1: {
                if (player.y < Constants.MAP_SIZE / 2) {
                  player.y += 1;
                  dir = 3
                } else {
                  player.y -= 1;
                  dir = 0
                }
              }
            }
            this.handleInput(socket, dir);
          }
        } else {
          var dir = 0;
          switch (player.move) {
            case 0: {
              if (player.x < Constants.MAP_SIZE / 2) {
                player.x += 1;
                dir = 1.5;
              } else {
                player.x -= 1;
                dir = -1.5;
              }
            };
            case 1: {
              if (player.y < Constants.MAP_SIZE / 2) {
                player.y += 1;
                dir = 3
              } else {
                player.y -= 1;
                dir = 0
              }
            }
          }
          this.handleInput(socket, dir);
        }
      }
    }
    if (flag) {
      this.lastUpdateBots = nowTime;
    }
    //

    // Apply collisions, give players score for hitting Bomb
    const destroyedBombs = applyCollisionPlayerAndBomb(Object.values(this.players), this.bombs);
    destroyedBombs.forEach(b => {
      //this.players[b.parentID].onDealtDamage();
      //this.sparklings.push(new Sparkling(b.x,b.y, 0));
      b.animPlay = "explosion";
    });
    //this.bombs = this.bombs.filter(bomb => !destroyedBombs.includes(bomb));

    // Apply collisions, give players 
    applyCollisionPlayerAndPlayer(Object.values(this.players), Object.values(this.players), dt);

    // Apply collisions, give players score for heath items
    const destroyedHeathItems = applyCollisionPlayerAndItem(Object.values(this.players), this.heathItems);
    destroyedHeathItems.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].takeHeal();
      }
    });
    this.heathItems = this.heathItems.filter(item => !destroyedHeathItems.includes(item));

    // Apply collisions, give players score for gun items
    const destroyedGunItems = applyCollisionPlayerAndItem(Object.values(this.players), this.gunItems);
    destroyedGunItems.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].takeGun();
      }
    });
    this.gunItems = this.gunItems.filter(item => !destroyedGunItems.includes(item));

    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        var random = Math.floor(Math.random() * 2);
        if (random) {
          this.heathItems.push(new ItemHeath(player.x, player.y, 0));
        }
        this.explosions.push(new Explosion(player.x, player.y, 0));
        this.gunItems.push(new ItemGun(player.x + Constants.ITEM_MAX_ALIGN_X, player.y, 0));
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = true;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    const nearbyHeathItems = this.heathItems.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    const nearbyGunItems = this.gunItems.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    const nearbySparkling = this.sparklings.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    const nearbyExplosion = this.explosions.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    const nearbyPlanet = this.planets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    const nearbyBomb = this.bombs.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      heathitems: nearbyHeathItems.map(b => b.serializeForUpdate()),
      gunitems: nearbyGunItems.map(b => b.serializeForUpdate()),
      sparklings: nearbySparkling.map(b => b.serializeForUpdate()),
      explosions: nearbyExplosion.map(b => b.serializeForUpdate()),
      planets: nearbyPlanet.map(b => b.serializeForUpdate()),
      bombs: nearbyBomb.map(b => b.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;

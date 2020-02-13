const ASSET_NAMES = [
  'spritesheet.png',
  'spritesheet2.png',
  'spritesheet3.png',
  'spritesheet4.png',
  'spritesheet5.png',
  'bullet.png',
  'heath.png',
  'HP_Bonus.png',
  'Damage_Bonus.png',
  'spritesheetspark.png',
  'spritesheetexplosion.png',
  'SpaceBackground-12.jpg',
  'spritesheet_planet_01.png',
  'spritesheet_star_blue.png',
  'spritesheet_star_ograne.png',
  'spritesheet_star_red.png',
  'spritesheet_star_yellow.png',
  'spritesheet_star_white.png',
  'spritesheet_bomb_1_idle.png',
  'spritesheet_bomb_1_explosion.png',
];

const assets = {};
const json = {};

const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

function downloadAsset(assetName) {
  return new Promise(resolve => {
    const asset = new Image();
    asset.onload = () => {
      console.log(`Downloaded ${assetName}`);
      assets[assetName] = asset;
      resolve();
    };
    asset.src = `/assets/${assetName}`;
  });
}

export function readJSOn(jsonName) {
  return new Promise(resolve => {
    fetch(`/assets/${jsonName}`)
      .then(response => response.json())
      .then(data => { // Do stuff with the response
        json[jsonName] = data;
        resolve();
      })
      .catch(function (error) {
        console.log('Looks like there was a problem: \n', error);
      });
  });
}

export const downloadAssets = () => downloadPromise;

export const getAsset = assetName => assets[assetName];

export const getJson = jsonName => json[jsonName];

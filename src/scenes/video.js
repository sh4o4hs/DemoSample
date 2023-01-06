import app from 'entity/app';

// 初始值
let player = null;

export async function getPlayer () {
  let obj = await app.game.getProject('video/player', {
    version: '2.0.0'
  });
  return await obj.lib.getH264();
}

export async function init (config) {
  if (!player) {
    player = await getPlayer();
  }
  await player.init(config);
  app.player = player;
}

import app from 'entity/app';


let sources = null;
let groupIndex = 0;
let videoUrls = [];

export async function init (config) {

  let player = await app.game.getPlayer();
  app.player = player;

  if (player.mpeg1) {
    await player.mpeg1.init(config);
    app.mpeg1 = player.mpeg1;
  }

  if (player.h264) {
    await player.h264.init(config);
    app.h264 = player.h264;
  }

  if (config.id) {
    if (config.tableKey) {
      let str = config.tableKey;
      groupIndex = Number(str.slice(-1)) - 1;
    } else {
      groupIndex = parseInt(config.groupIndex) ?? 0;
    }

    sources = {};
    let obj = await app.game.getProject('video/domains');
    let lib = obj.lib;
    sources = await lib.getVideoSource(config.id);

    useUrls(groupIndex);
    console.log('sources : ', sources);
  }
}

export async function release () {

  let mpeg1 = app.mpeg1;
  if (mpeg1) {
    await mpeg1.closeAll();
  }

  let h264 = app.h264;
  if (h264) {
    await h264.closeAll();
  }

}


/**
 * 使用指定名稱的視訊來源清單
 * @param {String} id
 */
export async function useVideoSource (id) {
  sources = {};
  let obj = await app.game.getProject('video/domains');
  let lib = obj.lib;
  sources = await lib.getVideoSource(id);
}

export function getUrls (group) {
  let urls = [];
  let list = sources.list;
  if (list && typeof group === 'number') {
    urls = sources.list[group];
  }

  return urls;
}

export function useUrls (group) {
  if (sources.list) {
    if (Array.isArray(sources.list[group])) {
      videoUrls = sources.list[group];
    }
  }
}

export function getUrl (index) {
  let url = videoUrls[index] || '';
  return url;
}

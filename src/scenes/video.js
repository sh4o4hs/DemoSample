import app from 'entity/app';

// 初始值
let lib = null;
let mpeg1 = null;
let h264 = null;

export async function getLib () {
  if (!lib) {
    let obj = await app.game.getProject('video/player', {
      version: '2.0.0'
    });
    lib = obj.lib;
  }

  return lib;
}


export async function init (config, options) {

  if (!mpeg1 && options.useMpeg1) {
    let obj = await getLib();

    mpeg1 = await obj.getMpeg1();
    await mpeg1.init(config);
    app.mpeg1 = mpeg1;
  }

  if (!h264 && options.useH264) {
    let obj = await getLib();

    h264 = await obj.getH264();
    await h264.init(config);
    app.h264 = h264;
  }
}

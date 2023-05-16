import app from 'entity/app';
import * as png from 'scene/png';


let isCreate = false;
let sceneSounds = null;
let scene = null;

let elephant1 = null;
let elephant2 = null;

let clock1 = null;
let clock2 = null;

export async function create (game) {
  let sceneManager = app.nuts.scene.sceneManager;
  let lib = await import('entity/main');
  let Main = lib.default;
  let main = Main.getSingleton();
  let center = main.getCenter();

  // 是否需要建立
  if (!isCreate) {

    // 讀取資源檔
    let vendor = await import('src/vendor');

    let res;
    if (app.setting.useAvif) {
      res = await vendor.get('v2load');
    } else {
      res = await vendor.get('v1load');
    }

    let config = {
      game,
      infoList: [
        { eventName: 'sound',   obj: res}
      ]
    };

    console.log('[讀取資源] 音效');
    sceneSounds = await sceneManager.createScene(config);
    console.log('[讀取資源] 完成');
    console.log(sceneSounds);

    // 設定音效物件
    center.sounds = sceneSounds.sounds;

    config = {
      game,
      infoList: [
        { eventName: 'texture',   obj: res}
      ]
    };

    console.log('[讀取資源] 圖檔');
    scene = await sceneManager.createScene(config);
    console.log('[讀取資源] 完成');
    console.log(scene);
    isCreate = true;

    // globalThis.Howler.autoSuspend = false;

    await main.reload(scene);
  }

  // const video = document.createElement('video');
  // video.src = app.baseURL + 'res/video/soccer1.webm';
  // video.controls = true;
  // video.muted = false;

  // console.log(video);

  // video.onplay = (/* event */) => {
  //   // console.log('播放');
  // };

  // video.onended = (/* event */) => {
  //   // console.log('結束');
  //   video.play();
  // };

  // const videoMask = document.createElement('video');
  // videoMask.src = '	https://simpl.info/videoalpha/video/dancer1.webm';
  // videoMask.controls = true;
  // videoMask.muted = false;


  // videoMask.onplay = (/* event */) => {
  // };

  // videoMask.onended = (/* event */) => {
  //   video.play();
  // };


  // 建立
  let url;
  url = app.baseURL + 'res/video/kingBaccarata001_comfort.png';
  let image1 = await png.createImage(url);

  url = app.baseURL + 'res/video/clock.png';
  let image2 = await png.createImage(url);

  if (!elephant1) {
    elephant1 = await png.createPlayer(image1, 'elephant1');
  }

  if (!elephant2) {
    elephant2 = await png.createPlayer(image1, 'elephant2');
  }

  if (!clock1) {
    clock1 = await png.createPlayer(image2, 'clock1');
  }

  if (!clock2) {
    clock2 = await png.createPlayer(image2, 'clock2');
  }

  // 顯示
  clock1.x = 10;
  clock1.y = 400;
  clock2.speed = 1.0;
  game.layer.overlay.addChild(clock1);

  clock2.x = 10;
  clock2.y = 600;
  clock2.speed = 0.5;
  game.layer.overlay.addChild(clock2);

  elephant1.x = 10;
  elephant1.speed = 0.5;
  game.layer.overlay.addChild(elephant1);

  elephant2.x = 350;
  elephant2.speed = 0.75;
  game.layer.overlay.addChild(elephant2);


  // 播放
  async function playClock1 () {
    console.log('[clock1] start');
    for (let i = 0; i < 5; i++) {
      await clock1.play();
    }
    console.log('[clock1] end');
  }
  async function playClock2 () {
    console.log('[clock2] start');
    for (let i = 0; i < 10; i++) {
      await clock2.play();
    }
    console.log('[clock2] end');
  }
  console.log('[playclock1] start');
  playClock1();
  console.log('[playclock1] end');

  console.log('[playclock2] start');
  clock2.loop = 5;
  clock2.play();

  // playClock2();
  console.log('[playclock2] end');


  console.log('[play] start elephant1');
  elephant1.play(0);
  await game.idle(0.5);
  await elephant1.pause();
  console.log('[play] end elephant1');

  console.log('[play] start elephant2');
  await elephant2.play();
  console.log('[play] end elephant2');

  console.log('[play] start elephant1');
  await elephant1.play();
  console.log('[play] end elephant1');

  console.log('[play] start elephant2');
  elephant2.speed = 1.0;
  elephant2.loop = false;
  await elephant2.play();
  console.log('[play] end elephant2');

  await game.idle(1.0);
  await elephant2.pause();

  await game.idle(1.0);
  await elephant2.play();

  await game.idle(1.0);
  await elephant2.pause();

  await game.idle(1.0);
  await elephant2.play(10);

  elephant2.loop = true;
  elephant2.play();

  // teVideo = PIXI.Texture.from(url);

  // const teMask = PIXI.Texture.from(videoMask);
  // let mask = new PIXI.Sprite(teMask);


  //----------------------------------------
  // 播放背景音樂
  // let sound = center.sounds.demo;
  // if (sound && sound.music && sound.music.play) {
  //   sound.music.volume(0.2);
  //   sound.music.play();
  // }


}

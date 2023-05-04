import app from 'entity/app';

import parseAPNG from 'apng-js';

let isCreate = false;
let sceneSounds = null;
let scene = null;

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


  let url = app.baseURL + 'res/video/kingBaccarata001_1.png';

  let response = await fetch(url);

  // let apng = null;
  // let teVideo = PIXI.Texture.EMPTY;
  if (response.ok) {
    let array = await response.arrayBuffer();
    let apng = parseAPNG(array);


    apng.createImages().then(async () => {
      let teList = [];
      console.log(`${apng.width}px`);
      console.log(`${apng.height}px`);

      // let firstFrame = null;
      apng.frames.forEach(f => {

        // console.log(f);
        // console.log(`${f.left}px`);
        // console.log(`${f.top}px`);
        let te = PIXI.Texture.from(f.imageElement);
        teList.push(te);
      });

      let sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
      game.layer.overlay.addChild(sprite);

      console.log(teList);
      for (let i = 0; i < teList.length; i++) {
        let te = teList[i];
        let f = apng.frames[i];
        console.log(f);

        sprite.texture = te;
        sprite.x = f.left;
        sprite.y = f.top;

        await game.idle(0.15);
      }

      // console.log(teVideo);
    });

    // teVideo = PIXI.Texture.fromBuffer(array, 480, 400);

    // self.texture.baseTexture.resource.data = array;
    // self.texture.baseTexture.update();
  }

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

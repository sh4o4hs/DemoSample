import app from 'entity/app';
import Main from 'entity/main';


let isCreate = false;

let sceneSounds = null;
let sceneTextures = null;

export async function create (game) {
  let sceneManager = app.nuts.scene.sceneManager;
  let main = Main.getSingleton();
  let center = main.getCenter();

  // console.log('[讀取資源]等待 2 秒');
  // await game.idle(0.01);
  // console.log('[讀取資源]2 秒後');

  // 是否需要建立
  if (!isCreate) {
    isCreate = true;

    // 讀取資源檔
    let vendor = await import('src/vendor');
    let res = await vendor.get('load');

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
    sceneTextures = await sceneManager.createScene(config);
    console.log('[讀取資源] 完成');
    console.log(sceneTextures);
  } else {
    main.init();
  }


  //----------------------------------------
  // 播放背景音樂
  let sound = center.sounds.demo;
  if (sound && sound.music && sound.music.play) {
    sound.music.volume(0.2);
    sound.music.play();
  }

  await main.reload(sceneTextures);

  // //----------------------------------------------
  // console.log('[更新結束]等待 1 秒');
  // await game.idle(1.0);
  // console.log('[更新結束]1 秒後');
}

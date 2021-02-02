//import * as nuts from 'nuts';
import app from 'entity/app';

// import app from 'entity/app';
import vendor from 'res/vendor';


let isCreate = false;

export async function create (game, ent) {

  let sceneManager = app.nuts.scene.sceneManager;

  // 是否需要建立
  if (isCreate) {
    return;
  }

  isCreate = true;
  let res = vendor.main;

  let config = {
    game,
    infoList: [
      { eventName: 'sound',   obj: res}
    ]
  };

  let scene = null;
  scene = await sceneManager.createScene(config);
  console.log(scene);
  if (ent && ent.getCenter) {
    let center = ent.getCenter();
    center.sounds = scene.sounds;
  }

  // 播放背景音樂
  let sound = scene.sounds.demo;
  if (sound && sound.music && sound.music.play) {
    sound.music.play();
  }

  //----------------------------------------
  res = vendor.info;
  config = {
    game,
    infoList: [
      { eventName: 'texture',   obj: res}
    ]
  };

  scene = await sceneManager.createScene(config);
  console.log(scene);

  app.sceneDemo = scene;
}



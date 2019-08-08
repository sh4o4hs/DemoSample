import * as nuts from 'nuts';
import app from 'entity/app';
import vendor from 'res/vendor';

let sceneManager = nuts.scene.sceneManager;

let isCreate = false;
let scene = null;

export async function create (game, ent) {

  // 是否需要建立
  if (!isCreate) {
    isCreate = true;
    let res = vendor.main;
    console.log(res);
    let config = {
      game,
      infoList: [
        { eventName: 'sound',   obj: res}
      ]
    };
    scene = await sceneManager.createScene(config);
  }
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
  app.sceneDemo = scene;
}



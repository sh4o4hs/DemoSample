//import * as nuts from 'nuts';
import app from 'entity/app';

import Main from 'entity/main';


let isCreate = false;
let scene = null;
export async function create () {
  let sceneManager = app.nuts.scene.sceneManager;

  let main = Main.getSingleton();
  let center = main.getCenter();
  let game = center.game;

  // 是否需要建立
  if (!isCreate) {

    // isCreate = true;
    let loading = app.nuts.ui.loading;

    // 讀取資源檔
    let vendor = await import('src/vendor');
    let res = await vendor.get('info');

    let config = {
      game,
      loading,
      infoList: [
        { eventName: 'texture', obj: res}
      ]
    };
    scene = await sceneManager.createScene(config);
    if (scene && scene.textures) {
      game.textures = scene.textures;
      if (center.rule) {
        center.rule.reload(scene);
      }
    }
  }
  console.log('等待 1 秒');
  await game.idle(1.0);
  console.log('1 秒後');
  console.log(scene);
  if (scene && center.rule) {
    center.rule.show();
  }


}



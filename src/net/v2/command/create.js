import app from 'entity/app';
import Main from 'entity/main';

//import * as SceneLoad from 'src/scenes/load';
//import * as module from 'component/module';
//import * as comGame from 'component/game';


/**
 * 建立遊戲
 */
export async function send () {
  let net = await import('net/network');
  let actionTypes = net.getActionTypes();
  let ActionType = actionTypes.data;
  let data = {
    actionType: ActionType.CREATE
  };

  // 傳送
  console.log('[傳送] 建立遊戲');
  let result = await net.send(data);
  if (!result) {
    return;
  }
  console.log('[收到] 建立遊戲');
  console.log(result);

  app.decimal = 2;
  let main = Main.getSingleton();
  if (main) {
    let mainSet = await import('entity/mainSet');
    main.setInitMap(mainSet.normal);
    main.eventFinish();
    main.addToScene();
  }
  app.game.play();

  // 讀取資源
  let sceneLoad = await import('scene/load');
  sceneLoad.create();
}

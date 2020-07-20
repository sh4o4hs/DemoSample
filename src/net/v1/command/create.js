import app from 'entity/app';
import Main from 'entity/main';

let isCreated = false;

/**
 * 建立遊戲 (舊版)
 */
let Command = {
  async handle (obj) {

    console.log('[收到] create :' + JSON.stringify(obj));
    if (isCreated) {
      return;
    }
    isCreated = true;

    app.decimal = 2;
    let main = Main.getSingleton();
    if (main) {
      let mainSet = await import('entity/mainSet');
      main.setInitMap(mainSet.normal);
      main.eventFinish();
      main.addToScene();
    }
    app.game.play();


  }
};

export default Command;


/**
 * 建立遊戲 (新版)
 */
export async function send () {
  let net = await import('net/network');

  // 傳送
  let netCmd = net.getCommand();
  const CMD = netCmd.CMD;
  let dataObj = {};

  console.log('[傳送] 建立遊戲');
  let result = await net.sendCommand(CMD.CREATE, dataObj);

  // 判斷是否是舊版
  if ((typeof result === 'number') || (typeof result === 'boolean')) {
    return;
  }
  if (!result || isCreated) {
    return;
  }
  isCreated = true;

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
}

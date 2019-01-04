import app from 'entity/app';
import Seed from 'entity/seed';
import * as module from 'component/module';
import * as comGame from 'component/game';

/**
 * 建立遊戲
 */


let Command = {
  handle (obj, data) {
    console.log('create :' + JSON.stringify(obj));
    app.decimal = 2;
    let seed = Seed.getSingleton();
    if (seed) {
      seed.eventFinishEx();
    }

    app.game.play();
    //-------------------------------
    // 是否有附加命令或資料
    if (!data) {
      return;
    }
    const CMD = Command.CMD;
    const cmdList = Command.cmdList;
    let cmd = null;

    // 是否有 JP 命令
    if (data.jackpot) {
      let jp = JSON.parse(data.jackpot);
      cmd = cmdList[CMD.JACKPOT];
      if (cmd.handle) {
        cmd.handle(jp);
      }
    }

    // 移除 overview
    module.remove(0);
    module.setVisible(false);

    // end
    comGame.setVisibleUI(true);
  }
};

export default Command;

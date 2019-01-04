import Seed from 'entity/seed';

/**
 * 下注
 */
let testIndex = 0;

let Command = {
  handle (obj, data) {
    console.log('bet :' + JSON.stringify(obj));
    let seed = Seed.getSingleton();
    if (seed) {
      obj.testIndex = testIndex;
      seed.setResult(obj);
      testIndex += 1;
      if (testIndex >= 6) {
        testIndex = 0;
      }
    }

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

    // end
  }
};

export default Command;

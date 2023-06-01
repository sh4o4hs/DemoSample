import app from 'entity/app.js';

/**
 * jackpot
 */
let Command = {
  handle (obj) {
    console.log('處理 jackpot :' + JSON.stringify(obj));
    app.jackpot = obj;
  }
};

export default Command;

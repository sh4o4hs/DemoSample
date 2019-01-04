import app from 'entity/app';

/**
 * jackpot
 */
let Command = {
  handle (obj) {
    console.log('jackpot :' + JSON.stringify(obj));
    app.jackpot = obj;
  }
};

export default Command;

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */
import * as command from 'net/command';
import * as event from 'net/event';

let game = null;

/**
 * 網路相關
 */
export let id = null;
export let cmdList = null;

/**
 * init
 * @param conf {Object} conf
 */
export function init (conf) {
  game = conf.game;
  id = conf.id;

  //--註冊網路事件
  cmdList = command.init();
  if (id) {
    console.log('init id : ' + id);
    game.command.registerGameEvent(event, id);
  } else {
    console.log('init error');
  }
}

/**
 * send command
 * @param cmd {String} command id
 * @param dataObj {Object} data object
 * @return {boolean} 是否傳送成功
 */
export function sendCommand (cmd, dataObj) {
  let state = false;
  let packet = {
    command: cmd,
    data: JSON.stringify(dataObj)
  };

  if (navigator.onLine) {
    state = game.command.send(packet, id);
  } else {
    console.log('未連線');
  }

  if (!state) {
    console.log('傳送失敗');
  }

  return state;
}

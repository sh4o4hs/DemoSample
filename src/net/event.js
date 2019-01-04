/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */
import * as net from 'net/network';

import broadcast from 'net/command/broadcast';


/**
 * receive game data
 * @param data {Object} 接收網路資料（遊戲用）
 */
export function recvGameData (data) {
  let obj;
  let commandName = data.command;
  let cmdList = net.cmdList;
  if (typeof commandName === 'string' && data.data) {
    console.log('recv cmd : ' + commandName);
    obj = JSON.parse(data.data);
    let cmd = cmdList[commandName];
    if (cmd) {
      if (cmd.handle) {
        cmd.handle(obj, data);
      }
    }
  } else {
    console.log('recvGameData error : ' + commandName);
  }
}

/**
 * 接收廣播訊息
 * @param data {Object} 廣播內容
 */
export function recvBroadcast (data) {
  let cmd = JSON.parse(data);
  broadcast.handle(cmd);
}

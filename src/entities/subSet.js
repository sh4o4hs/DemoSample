/* ************************************************************************
 *
 *   Copyright:
 *
 *   License:
 *
 *   Authors:
 *
 ************************************************************************ */
//import app from 'entity/app';
////import * as nuts from 'nuts';
// import app from 'entity/app';


/**
 * 子場景初始化
 * @param {Object} that
 *
 */
export function normal (that) {

  //--初始化對照表
  let set = {

    // 按鈕
    clickSys (obj) {

      obj.setClick(() => {
        that.removeFromScene();
      });
    },

    // 動畫
    play (obj) {
      console.log(obj);
      obj.play();
    }
  };

  // 初始化
  let config = {
    set
  };
  that.init(config);
}

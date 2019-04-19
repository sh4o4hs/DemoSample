/* ************************************************************************
 *
 *   Copyright:
 *
 *   License:
 *
 *   Authors:
 *
 ************************************************************************ */
import * as strings from 'language/strings';
import * as nuts from 'nuts';
import app from 'entity/app';


/**
 * 物件初始化
 * @param {Object} that
 */
export function normal (that) {
  let ui = nuts.ui;
  const NUM = ui.Number.NUM;
  let center = that.getCenter();
  let textures = center.textures.demo;
  let event = center.event;

  //--初始化對照表
  let set =  {

    // 訊息物件用
    setInfo (obj) {
      console.log('set info');
      console.log(obj);
      console.log(obj.conf);
    },

    // 開始
    clickStart (obj) {
      obj.setClick(event.clickStart);
    },

    // 自動
    clickAuto (obj) {
      obj.setClick(event.clickAuto);
    },

    // 下注
    clickBet (obj) {
      obj.setClick(event.clickBet);
    },

    // 規則
    clickRule (obj) {
      obj.setClick(event.clickRule);
    },

    // 離開
    clickLeave (obj) {
      obj.setClick(event.clickLeave);
    },

    // 文字物件用
    setText (obj) {
      let conf = obj.conf;
      obj.text = strings.get(conf.text);
    },

    // 動畫物件用
    setSpine (obj) {
      let conf = obj.conf;
      let childName = conf.childName || 'star_1';

      // 取得動畫物件
      let spine = obj.getSpine('star');
      console.log('obj.getSpine 取得動畫物件 star');
      console.log(spine);

      // 取得動畫設定
      let animConfig = obj.getAnimConfig('star');
      console.log('obj.getAnimConfig 取得動畫設定 star');
      console.log(animConfig);


      // 設定動畫
      if (spine && spine.state) {
        let state = spine.state;

        // 設定動畫事件
        if (state.clearListeners) {
          state.clearListeners();
          state.addListener({
            complete: trackIndex => {
              console.log('track ' + trackIndex + ' completed ');
            },
            start: trackIndex => {
              console.log('開始播放動畫 at ' + trackIndex);
            },
            end: trackIndex => {
              console.log('動畫結束 at ' + trackIndex);
            },
            event: (entry, event) => {
              console.log('event fired ' + event.data + ' at track' + entry.trackIndex);
            }
          });
        }


        // 取得動畫子物件
        let child = ui.Spine.getChild(spine, childName);
        center.spineDemo = spine;
        center.spineChildDemo = child;
      }

    },

    // 籌碼
    setCoin (obj) {
      center.spriteDemo = obj;
    },

    // 動畫物件用
    play (obj) {
      obj.play();
    },

    // 籌碼堆子物件 圖片物件用
    aa (obj) {
      let conf = obj.conf;
      let index = conf.index || 0;
      obj.texture = textures.coin[index] || obj.texture;
    },

    // 籌碼堆子物件 數字物件用
    setCash (obj) {
      obj.setAlign(NUM.HORI_ALIGN.CENTER, NUM.VERTI_ALIGN.CENTER);
      obj.fixVal = app.decimal;
      obj.custom.fixVal = app.decimal;
      obj.setValue(4321);
    },

    // 數字物件用
    setNum (obj) {
      obj.setAlign(NUM.HORI_ALIGN.CENTER, NUM.VERTI_ALIGN.CENTER);
      obj.custom.fixVal = 0;
      obj.setValue(0);
    },

    // 籌碼堆群組物件用
    createCoin (obj) {
      let group = obj;
      console.log(group);
    }

  };

  let config = {
    set
  };
  that.init(config);
}

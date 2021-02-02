/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */
//import * as nuts from 'nuts';
import app from 'entity/app';

import * as seedSet from 'entity/seedSet';

// import * as strings from 'language/strings';
// import resource from 'src/res/main';

import vendor from 'res/vendor';

/**
 * 主場景
 */

const SCENE_NAME = 'seed';
let singleton = null;

export default class Scene extends app.nuts.scene.Base {

  static  getSingleton () {
    return singleton;
  }
  static setSingleton (scene) {
    singleton = scene;
  }


  /**
   * 建立物件
   * @param game {Object} game
   */
  constructor (game) {
    let root = (function (game) {
      let entity = {};
      let center = {};

      center.entity = entity;
      center.game = game;
      center.layer = game.layer.main;
      center.currentUpdate = null;
      center.sounds = null;
      center.objs = null;
      center.textures = null;

      let isAuto = false;
      center.isRun = false;

      /************************************************************************/
      /**
       * 事件設定
       *
       */
      let extendEvent = {};
      let event = {};

      // 開始
      event.clickStart = obj => {
        if (extendEvent.clickStart) {
          extendEvent.clickStart(obj);
        }
      };

      // 自動
      event.clickAuto = obj => {
        console.log('click');
        let textures = center.textures.demo;
        isAuto = !isAuto;
        if (isAuto) {
          obj.setTexture(textures.button.autoLight);

          if (extendEvent.clickAuto) {
            extendEvent.clickAuto(obj);
          }
        } else {
          obj.setTexture(textures.button.auto);
          if (extendEvent.clickNormal) {
            extendEvent.clickNormal(obj);
          }
        }
      };

      // 下注
      event.clickBet = obj => {
        if (extendEvent.clickBet) {
          extendEvent.clickBet(obj);
        }
      };

      // 規則
      event.clickRule = obj => {
        if (extendEvent.clickRule) {
          extendEvent.clickRule(obj);
        }
      };

      // 離開
      event.clickLeave = obj => {
        if (extendEvent.clickLeave) {
          extendEvent.clickLeave(obj);
        }
      };

      // 呼叫子場景
      event.callSubScene = data => {
        if (extendEvent.callSubScene) {
          extendEvent.callSubScene(data);
        }
      };

      /************************************************************************/
      /**
       * 更新畫面用
       * @param offsetTime {Number} 時間偏移量, 每一個 frame 所花費的時間
       */
      event.update = (offsetTime) => {
        if (center.currentUpdate !== null) {
          center.currentUpdate(offsetTime);
        }
      };

      /**
       * 等待接收遊戲資料
       */
      event.updateCheckStart = (/*offsetTime*/) => {
        let obj = entity.wildOpen;

        game.setTimeout(() => {
          console.log('主場景 - 關閉等待動畫');
          if (obj) {
            obj.stop();
            center.layer.removeChild(obj);
          }
        }, 1.00);
        center.currentUpdate = event.updateStart;
      };

      /**
       * 開始表演遊戲結果
       */
      event.updateStart = (/*offsetTime*/) => {
        let obj = entity.wildLoop;
        if (obj) {
          obj.play();

          // 取得動畫物件
          let spine = obj.getSpine('loop');

          // 設定動畫
          if (spine && spine.state) {
            let state = spine.state;

            // 設定動畫事件
            if (state.clearListeners) {
              state.clearListeners();
              state.addListener({
                complete () {
                  console.log('主場景 - 確認是否開始建立子場景');
                  center.loopCounts -= 1;
                  if (center.loopCounts <= 0) {
                    obj.stop();
                    center.layer.removeChild(obj);
                    event.callSubScene(center.result);
                  }
                }
              });
            }
          }
        }

        center.currentUpdate = null;
      };

      center.event = event;
      center.extendEvent = extendEvent;
      center.update = event.update;

      //--
      return {
        center
      };
    }(game));

    super(SCENE_NAME);
    let self = this;
    self.setGame(game);
    self.setRoot(root);
  }

  //---------------------------------------------
  /**
   * 更新畫面用
   * @param offsetTime {Number} 時間偏移量, 每一個 frame 所花費的時間
   */
  /*
    refresh(offsetTime) {
      //    console.log(this.getName() + ' ' + offsetTime);
    }
  */

  /**
   * 開始表演
   * @returns {boolean}
   */
  run () {

    let center = this.getCenter();
    let entity = center.entity;
    let layer = center.layer;
    let obj;

    if (center.isRun) {
      console.log('主場景 - 表演中');
      return false;
    }
    console.log('主場景 - 表演開始流程');
    center.isRun = true;
    center.loopCounts = 2;

    obj = entity.wildOpen;
    if (obj) {
      obj.play();
      layer.addChild(obj);
    }
    obj = entity.wildLoop;
    if (obj) {
      obj.play();
      layer.addChild(obj);
    }

    center.currentUpdate = null;
    console.log('主場景 - 等待接收遊戲結果');
    return true;
  }

  /**
   * 結束流程
   */
  end () {
    console.log('主場景 - 表演結束流程');

    let self = this;
    let center = self.getCenter();
    let entity = center.entity;
    let event = center.event;

    let obj = entity.wildLoop;
    if (obj) {
      obj.play();
      center.layer.addChild(obj);

      // 取得動畫物件
      let spine = obj.getSpine('loop');

      // 設定動畫
      if (spine && spine.state) {
        let state = spine.state;

        // 設定動畫事件
        if (state.clearListeners) {
          state.clearListeners();
          state.addListener({
            complete (/*trackIndex*/) {
              center.layer.removeChild(obj);
              self.restart();
              if (event.roundFinish) {
                event.roundFinish();
              }
            }
          });
        }
      }
    }
  }

  /**
   * 設定遊戲結果
   * @param data 遊戲結果
   */
  setResult (data) {
    console.log('主場景 - 表演遊戲結果');
    let center = this.getCenter();
    let event = center.event;
    center.result = data;
    center.currentUpdate = event.updateCheckStart;
  }

  /**
   * 重新設定場景狀態
   */
  reset (mode) {
    console.log('reset mode :' + mode);
    let center = this.getCenter();
    let entity = center.entity;
    let layer = center.layer;
    let obj;

    // 選擇模式
    if (mode === 'h') {
      let layer = new PIXI.DisplayObject();

      obj = entity.groupVertical;
      obj && layer.removeChild(obj);

      obj = entity.groupHorizontal;
      obj && layer.addChild(obj);

    } else if (mode === 'v') {
      obj = entity.groupHorizontal;
      obj && layer.removeChild(obj);

      obj = entity.groupVertical;
      obj && layer.addChild(obj);
    } else {
      obj = entity.groupHorizontal;
      obj && layer.addChild(obj);

      obj = entity.groupVertical;
      obj && layer.addChild(obj);
    }

  }

  /**
   * demo used
   */
  restart () {
    let center = this.getCenter();
    center.isRun = false;
  }

  /**
   * 場景建立完成
   */
  /*
  eventFinish () {
  }
*/

  /**
   * 處理原始資料
   */
  /*
    eventRawData(rawdata){
    }
  */
  /**
   * 處理音樂音效
   * @param sounds {Object} 取得音樂音效物件
   */
  /*
    eventSound (sounds){
    }
  */
  /**
   * 處理材質
   */
  // eventTexture (textures) {
  //   console.log(textures);
  //   console.log('---------------------');
  //   console.log(PIXI);
  //   console.log('---------------------');
  //   super.eventTexture(textures);
  // }


  /**
   * 處理動畫
   */
  /*
    eventSpine(spines) {
    }
  */
  /**
   * 處理物件
   */
  /*
    eventObject(objs){
    }
  */

  /**
   * 是否顯示讀取畫面
   */
  setLoadingVisible (visible) {
    let center = this.getCenter();
    let entity = center.entity;
    let loading = entity.loading;
    if (visible) {
      center.game.layer.foreground.addChild(loading);
    } else {
      center.game.layer.foreground.removeChild(loading);
    }
  }

  /**
   * 取得物件
   */
  getLoading () {
    let center = this.getCenter();
    let entity = center.entity;
    let loading = entity.loading;
    return loading;
  }

  /**
   * 播放動畫
   * @param name {String} 動畫名稱
   */
  play (name, configList) {
    let center = this.getCenter();
    let spine = center.spineDemo;
    let child = center.spineChildDemo;
    let sprite = center.spriteDemo;
    let entity = center && center.entity;
    let changeState = false;
    let obj = entity && entity[name];
    if (obj) {

      // 設定動畫事件
      let state = spine.state;
      if (state.clearListeners) {
        state.clearListeners();
        state.addListener({
          complete (trackIndex) {
            console.log('track ' + trackIndex + ' completed ');
            changeState = !changeState;
            if (changeState) {
              obj.play();
            } else {
              obj.play(configList);
            }
          },
          start (trackIndex) {
            console.log('開始播放動畫 at ' + trackIndex);
          },
          end (trackIndex) {
            console.log('動畫結束 at ' + trackIndex);
          }
        });
      }

      if (child && sprite) {
        child.addChild(sprite);
      }
      obj.play(configList);
    }
  }

  /**
   * 停止動畫
   * @param name {String} 動畫名稱
   */
  stop (name) {
    let center = this.getCenter();
    let entity = center && center.entity;
    let obj = entity && entity[name];
    if (obj) {
      obj.stop();
    }
  }

  /**
   * 設定事件
   * @param event
   */
  setEvent (event) {
    let center = this.getCenter();
    let ee = center.extendEvent;
    ee.clickLeave = event.clickLeave     || ee.clickLeave;    // 說明
    ee.clickAuto = event.clickAuto       || ee.clickAuto;    // 自動
    ee.clickNormal = event.clickNormal   || ee.clickNormal;  // 一般
    ee.clickBet = event.clickBet         || ee.clickBet;     // 下注
    ee.clickRule = event.clickRule       || ee.clickRule;    // 說明
    ee.clickStart = event.clickStart     || ee.clickStart;   // 開始
    ee.callSubScene = event.callSubScene || ee.callSubScene; // 呼叫子場景
    ee.roundFinish = event.roundFinish   || ee.roundFinish;  // 回合結束
  }

  /**
   * 啟動 stage event
   */
  enableStageEvent () {
    console.log('enableStageEvent');
    let self = this;
    let center = self.getCenter();


    let testContainer = center.testContainer;
    if (!testContainer) {
      testContainer = new PIXI.Container();
      center.testContainer = testContainer;
    }
    testContainer.x = 250;
    testContainer.y = 200;

    let overlay = center.game.layer.overlay;
    if (overlay) {
      let length = 70;

      //      stage.buttonMode = true;

      // 顯示觸發事件區域
      let circle = center.testObj;
      if (!circle) {
        circle = new PIXI.Circle(length, length, length);
        center.testObj = circle;
        let graphics = new PIXI.Graphics();
        graphics.x = 250;
        graphics.y = 200;
        graphics.lineStyle(1, 0xFF0000, 0.75);
        graphics.beginFill(0x00ff0B, 0.25);
        graphics.drawCircle(length, length, length);
        graphics.endFill();
        center.testGraphics = graphics;
      }

      // 觸發事件區域
      testContainer.interactive = true;
      testContainer.hitArea = circle;
      testContainer.buttonMode = true;
      if (center.testGraphics) {
        overlay.addChild(center.testGraphics);
      }
      overlay.addChild(testContainer);


      // 處理觸發事件
      overlay.touchstart = overlay.mousedown = data => {
        console.log('stage event : touchstart or mousedown');
        console.log(data);
        self.disableStageEvent();

      };

      overlay.touchend = overlay.mouseup = data => {
        console.log('stage event : touchend or mouseup');
        console.log(data);
      };

      overlay.mouseover = data => {
        console.log('stage event : mouseover');
        console.log(data);
      };

      overlay.mouseout = data => {
        console.log('stage event : mouseout');
        console.log(data);
      };

      overlay.touchendoutside = overlay.mouseupoutside = data => {
        console.log('stage event : touchendoutside or mouseupoutside');
        console.log(data);
      };
    }

  }

  /**
   * 關閉 stage event
   */
  disableStageEvent () {
    console.log('disableStageEvent');
    let center = this.getCenter();
    let overlay = center.game.layer.overlay;
    if (overlay) {

      // if (center.testGraphics) {
      //   overlay.removeChild(center.testGraphics);
      // }
      // overlay.interactive = false;
      // overlay.hitArea = null;
    }
  }

  /**
   * 場景管理
   */
  /*
    addToScene() {
      let layer = this.getLayer();
      super.addToScene();
      var basicText = new PIXI.Text('Basic text in pixi');
      basicText.x = 30;
      basicText.y = 90;
      layer.addChild(basicText);
    }
  */
  /**
   * 場景管理
   */
  /*
    removeFromScene(){
    }
  */
  /**
   * 場景管理
   */
  /*
    destroyScene(){
      super.destroyScene();
    }
  */
  /**
   * 場景管理
   * @param finish {Object} 場景建立完成後執行的任務
   */
  createScene (finish) {
    let self = this;

    // let res = resource[strings.getID()];
    let res = vendor.main;

    self.setInitMap(seedSet.normal);

    /*
    import('res/vendor').then(data => {
      console.log('=============================');
      console.log(data);
      console.log('=============================');
    });
*/

    if (res) {
      console.log(res);

      // 設定資訊
      let config = {
        infoList: [
          { eventName: 'spine',   obj: res},
          { eventName: 'texture', obj: res},
          { eventName: 'object',  obj: res}

          // { eventName: 'data',    obj: res.data},
          // { eventName: 'sound',   obj: res.sound},
          // { eventName: 'spine',   obj: res.spine},
          // { eventName: 'texture', obj: res.texture},
          // { eventName: 'object',  obj: res.object}
        ],
        isObject: true
      };
      super.createScene(finish, config);
    } else {
      console.error('resource map is undefined');
    }
  }
}

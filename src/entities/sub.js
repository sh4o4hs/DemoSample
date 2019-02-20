/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */
import * as nuts from 'nuts';
import * as strings from 'language/strings';
import * as subSet from 'entity/subSet';
import resource from 'src/res/sub.js';

/**
 * 子場景
 *
 */
const SCENE_NAME = 'sub';
let singleton = null;

export default class Scene extends nuts.scene.Base {

  static  getSingleton () {
    return singleton;
  }
  static setSingleton (scene) {
    if (!singleton) {
      singleton = scene;
    }
  }

  /**
   * 建立物件
   * @param game {Object} game
   */
  constructor (game) {
    super(SCENE_NAME);
    let self = this;

    /**
     * todo: 設定遊戲管理物件與指定圖層
     */
    self.setGame(game);
    self.setLayer(game.layer.foreground);
    let center = self.getCenter();
    center.currentUpdate = null;
    let event = {};

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

    /************************************************************************/
    center.index = 0;
    center.event = event;
    center.update = event.update;

  }

  //---------------------------------------------
  /**
   * 更新畫面用
   * @param offsetTime {Number} 時間偏移量, 每一個 frame 所花費的時間
   */
  /*
   refresh (offsetTime) {
   }
   */

  /**
   * 場景建立完成
   */
  /*
   eventFinish() {
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
  /*
   eventTexture (textures){
   }
   */
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
   * 玩
   * @param index
   */
  run (data) {
    console.log('子場景 - 表演流程 ' + data.testIndex);

    let self = this;
    let center = self.getCenter();
    let entity = center.entity;
    let objList = [
      entity.contboTomStar,
      entity.contboTomLoop
    ];
    console.log('sub scene run ');
    console.log(data);
    center.index = data.testIndex;
    if (center.index > 6) {
      center.index = 0;
    }
    let index = center.index;
    let currentConfig = null;

    objList.forEach(obj => {
      if (obj) {
        let configList = [];
        let setList = obj.custom && obj.custom.configList;
        if (index < setList.length) {
          let config = setList[index];
          configList.push(config);
          currentConfig = config;
        }
        if (configList.length > 0) {
          obj.play(configList);
        } else {
          obj.stop();
          center.layer.removeChild(obj);
        }
      }
    });

    if (entity.boy) {
      entity.boy.play();
    }
    if (entity.aaaa) {
      entity.aaaa.play();
    }

    let obj = entity.contboTomStar;
    let event = center.event;
    let isEnd = true;
    if (obj) {
      obj.play();
      if (currentConfig) {

        // 取得動畫物件
        let spine = obj.getSpine(currentConfig.name);

        // 設定動畫
        if (spine && spine.state) {
          let state = spine.state;

          // 設定動畫事件
          if (state.clearListeners) {
            state.clearListeners();
            state.addListener({
              complete () {
                if (event.finish) {
                  event.finish();
                }
              }
            });
            isEnd = false;
          }
        }
      }
    }
    if (isEnd) {
      let game = self.getGame();
      game.setTimeout(() => {
        if (event.finish) {
          event.finish();
        }
      }, 2.0);
    }
  }

  /**
   * 設定事件
   * @param event
   */
  setEvent (event) {
    let center = this.getCenter();
    let e = center.event;
    e.finish = event.finish || e.finish;
  }

  /**
   * 場景管理
   */
  /*
   addToScene () {
   super.addToScene();
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
   destroyScene () {
   }
   */

  /**
   * 場景管理
   * @param finish {Object} 場景建立完成後執行的任務
   */
  createScene (finish) {
    let self = this;
    let res = resource.default[strings.getID()];

    self.setInitMap(subSet.normal);

    if (res) {
      console.log(res);

      // 設定資訊
      let config = {
        infoList: [
          { eventName: 'data',    obj: res.data},
          { eventName: 'texture', obj: res.texture},
          { eventName: 'spine',   obj: res.spine},
          { eventName: 'object',  obj: res.object}
        ],
        isObject: true
      };
      super.createScene(finish, config);
    } else {
      console.error('resource map is undefined');
    }
  }
}

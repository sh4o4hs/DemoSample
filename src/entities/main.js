/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */
import * as nuts from 'nuts';
import * as strings from 'language/strings';
import * as mainSet from 'entity/mainSet';
import resource from 'src/res/main';

/**
 * 主場景
 */

const SCENE_NAME = 'main';
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

      /************************************************************************/
      /**
       * 事件設定
       *
       */
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


      center.event = event;
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
    let res = resource[strings.getID()];

    self.setInitMap(mainSet.normal);

    if (res) {
      console.log(res);

      // 設定資訊
      let config = {
        infoList: [
          { eventName: 'data',    obj: res.data},
          { eventName: 'sound',   obj: res.sound},
          { eventName: 'texture', obj: res.texture},
          { eventName: 'spine',   obj: res.spine},
          { eventName: 'object',  obj: res.object},
          { eventName: 'object',  obj: res.objectV},
          { eventName: 'object',  obj: res.objectH}
        ],
        isObject: true
      };
      super.createScene(finish, config);
    } else {
      console.error('resource map is undefined');
    }
  }
}

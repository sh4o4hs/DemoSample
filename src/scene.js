/* ************************************************************************
 *
 *   Copyright:
 *
 *   License:
 *
 *   Authors:
 *
 ************************************************************************ */
// import m from 'mithril';

import * as nuts from 'nuts';
import app from 'entity/app';
import * as comGame from 'component/gamePIXI';
import * as component from 'src/component';

import * as entity from 'src/entity';

let eventList = null;


/**
 * 存檔
 */
async function save () {
  let localforage = app.game.localforage;
  let setting = app.setting;
  let store = app.store;
  if (!store) {
    store = localforage.createInstance({
      name: 'mygames',
      storeName: 'sample'
    });
    app.store = store;
  }

  await store.setItem('setting', setting);
}

/**
 * 復原
 */
async function restore () {
  let localforage = app.game.localforage;

  let store = app.store;
  if (!store) {
    store = localforage.createInstance({
      name: 'mygames',
      storeName: 'sample'
    });
    app.store = store;
  }

  // 預設值
  let setting = {
    sound: 100,
    music: 50
  };
  app.setting = setting;
  let value = null;

  // 讀取設定
  value = await store.getItem('setting');
  if (value) {
    setting = value;
  }

  console.log('restore : ');
  console.log(setting);
}

/**
 * 初始化事件 (接收大廳傳送的命令用)
 * @returns {Object} 傳回物件事件
 */

export function init () {
  console.log('scene init');
  if (eventList) {
    return eventList;
  }

  // 遊戲管理用
  let gameRoot = null;
  let gamecard = null;

  eventList = {

    /**
     * 建立場景
     * @param conf config
     */
    create (conf)  {
      let game = conf.game;
      let loadingEvent = null;
      if (game.scene) {
        loadingEvent = game.scene.loadingEvent;
        gamecard = game.scene.gamecard;
        gameRoot = game;
        app.game = game;
        app.gamecard = gamecard;
      }

      // console.log('==================================');
      // console.log(game.localforage);

      // 初始化
      app.langID = conf.langID;
      app.baseURL = conf.baseURL || '';
      app.isChild = conf.isChild;

      if (conf.console) {
        console.info = conf.console.info;
      }

      // todo:game 收到建立遊戲事件
      let pixiConfig = gamecard.pixiConfig;
      pixiConfig.game = gameRoot;
      app.pixiConfig = pixiConfig;

      // 指定遊戲引擎初始化完成後, 需要執行的工作
      // (開始讀取遊戲資料,然後建立遊戲場景)
      pixiConfig.ready = (game) => {
        console.log('=====================');
        console.log(pixiConfig);
        entity.create({
          game: game,
          langID: conf.langID,
          isChild: conf.isChild,
          baseURL: conf.baseURL,
          loadingEvent: loadingEvent
        });
        game.play();
      };
      component.add({
        com: comGame.Component,
        attrs: {
          config: pixiConfig
        }
      });


    },

    /**
     * 開始更新畫面
     */
    play (conf) {
      console.log(conf.game.scene.info.id + ' scene play: from ' + conf.from);
      app.from = conf.from;

    },

    /**
     * 暫停更新畫面
     */
    pause (conf) {
      console.log(conf.game.scene.info.id + ' scene pause : from ' + conf.from);

    },

    /**
     * 進入場景
     *
     */


    /**
      *
      * @param {*} conf
      */
    async enter (conf) {
      console.log('scene enter ');
      if (conf.tablecofig) {
        return;
      }
      await restore();
      await save();

      let game = conf.game;

      // 歷程 開始遊戲
      if (app.game.report) {
        app.game.report.loadBegin(app.recordStart);
      }

      // 初始化網路
      let net = await import('net/network');
      await net.init(conf);

      // 傳送網路命令
      let cmd = await import('net/command/create');
      cmd.send();

      // 初始化視訊
      let ip = await app.game.getIP();
      if (ip) {
        console.log(ip);
      }

      // component.showVideo();

      /*
      component.add({
        com: comGame.Other,
        attrs: {
          config: {
            async ready (game) {
              game.play();
              let scene = await import('scene/sub');
              console.log(scene);
              await scene.play(game);
            }
          }
        }
      }, 1);
*/
      game.disconnect = () => {
        console.log('!!!! game.disconnect !!!!');
      };
      game.sysTray.visible = true;

      // 讀取資源
      let sceneLoad = await import('scene/load');
      sceneLoad.create();
    },

    /**
     * 離開場景
     */
    async leave (conf) {
      console.log('scene leave');
      let scene = conf.game.scene;
      if (scene && scene.localEvent) {
        scene.localEvent.pause(conf);
        scene.localEvent.hide();
      }
    },

    /**
     * 操作中
     */
    focus () {
      console.log('scene focus');
    },

    /**
     * 未操作
     */
    blur () {
      console.log('scene blur');
    },

    /**
     * 鎖定畫面比例
     * @param state {boolean} 是否鎖定畫面比例
     */
    lock (state) {
      console.log('lock :' + state);
    },

    /**
     * 全螢幕事件
     * @param state
     */
    fullscreen (state) {
      console.log(state);
    },

    /**
     * 尺寸改變事件
     * @param state
     */
    resize (/* state */) {
      // let setting = state.setting;
      // if (setting) {
      //   let style = component.style;
      //   style.width = setting.width;
      //   style.height = setting.height;
      //   console.log(style);
      //   m.redraw();
      // }

      // console.log(gameRoot);
      // gameRoot.getRenderer().resize(640, 720);
    },

    /**
     * 音樂事件
     * @param state
     */
    music (state) {
      console.info('音樂事件 : ' + state.isMute);
    },

    /**
     *  音效事件
     * @param state
     */
    sound (state) {
      console.info('音效事件 : ' + state.isMute);
    }
  };

  return eventList;
}

window.addEventListener('beforeunload', (event) => {
  console.log('beforeunload' + JSON.stringify(event));
});
window.addEventListener('unload', (/*event*/) => {
  console.log('unload');
  nuts.scene.sceneManager.destroyAllSound();
});

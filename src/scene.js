/* ************************************************************************
 *
 *   Copyright:
 *
 *   License:
 *
 *   Authors:
 *
 ************************************************************************ */

import * as nuts from 'nuts';
import app from 'entity/app';
import * as net from 'net/network';
import * as command from 'net/command';
import * as eventKeys from 'event/keys';
import * as eventDemo from 'event/demo';

import * as comGame from 'component/game';
import * as comUI from 'component/ui';

import Seed from 'entity/seed';


/**
 * 事件用
 */
let eventList = null;


/**
 * 初始化事件 (接收大廳傳送的命令用)
 * @returns {Object} 傳回物件事件
 */
export function init (config) {
  console.log('scene init');
  if (eventList) {
    return eventList;
  }
  const CMD = command.CMD;

  // 遊戲管理用
  let gameRoot = null;
  let entity = config.entity;
  let usePIXI = app.usePIXI;
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

      app.langID = conf.langID;
      app.isChild = conf.isChild;
      if (conf.console) {
        console.info = conf.console.info;
      }

      // 開始更新畫面
      game.play();

      // todo:game 收到建立遊戲事件
      if (usePIXI && entity && entity.create) {
        let pixiConfig = app.pixiConfig;
        let loadingMgr = nuts.scene.loadingManager;
        if (gamecard && !app.pixiConfig) {
          pixiConfig = gamecard.pixiConfig;
          app.pixiConfig = pixiConfig;
        }
        pixiConfig.game = gameRoot;
        loadingMgr.setGame(gameRoot);
        loadingMgr.setUseLobbyState(true);


        // 指定遊戲引擎初始化完成後, 需要執行的工作
        // (開始讀取遊戲資料,然後建立遊戲場景)
        pixiConfig.ready = (game) => {

          entity.create({
            game: game,
            langID: conf.langID,
            isChild: conf.isChild,
            baseURL: conf.baseURL,
            loadingEvent: loadingEvent
          });
        };

        comGame.create(pixiConfig);
      } else {

        // 測試用
        let progress = {
          current: 0,
          length: 100
        };

        /*
        let obj = {
          update (offsetTime) {
            console.log('com game update : ' + offsetTime);
          }
        };
        conf.game.addUpdate(obj);
*/

        // todo 場景更新範例
        if (loadingEvent) {

          // 通知 lobby 開始建立遊戲場景
          if (loadingEvent.start) {
            loadingEvent.start();
          }
          let timer = game.setInterval((/*time*/) => {
            progress.current += 1;
            loadingEvent.sceneResLoading(progress);
            if (progress.current >= progress.length) {
              game.clearInterval(timer);

              // 通知 lobby 遊戲場景建立完成
              if (loadingEvent.finish) {
                loadingEvent.finish();
              }
            }
          }, 0.02);

        }
      }
    },

    /**
     * 開始更新畫面
     */
    play (conf) {
      console.log(conf.game.scene.info.id + ' scene play: from ' + conf.from);

      app.from = conf.from;

      // todo:game 收到開始更新遊戲畫面事件
      let event;
      event = eventDemo.create({
        game: gameRoot
      });
      eventKeys.init({
        game: gameRoot,
        event
      });
      comUI.setEvent(event);

      let seed = Seed.getSingleton();
      if (seed) {
        let sound = seed.getSound('demo');
        if (sound && sound.music && sound.music.play) {
          sound.music.play();
        }
        seed.setEvent(event);
      }
    },

    /**
     * 暫停更新畫面
     */
    pause (conf) {
      console.log(conf.game.scene.info.id + ' scene pause : from ' + conf.from);

      // todo:game 收到暫停更新遊戲畫面事件
      let seed = Seed.getSingleton();
      if (seed) {
        let sound = seed.getSound('demo');
        if (sound && sound.music && sound.music.stop) {
          sound.music.stop();
        }
      }
      eventKeys.release();
    },

    /**
     * 進入場景
     */
    enter (conf) {
      console.log('scene enter ');
      console.log(conf);

      // todo:game 收到玩家進入遊戲

      // 設定網路
      net.init(conf);

      //--
      let dataObj = {};
      net.sendCommand(CMD.CREATE, dataObj);

      let event;
      event = eventDemo.create({
        game: gameRoot
      });
      eventKeys.init({
        game: gameRoot,
        event
      });
      comUI.setEvent(event);

      let seed = Seed.getSingleton();
      if (seed) {
        seed.setEvent(event);

        // 播放背景音樂
        let sound = seed.getSound('demo');
        if (sound && sound.music && sound.music.play) {
          sound.music.play();
        }
      }
    },

    /**
     * 離開場景
     */
    leave (conf) {
      console.log('scene leave');
      console.log(conf);
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
    resize (state) {
      console.log(state);

      // let loading = nuts.ui.loading;
      //
      // if (state.width > state.height) {
      //   let size = gamecard.resize.horizontal;
      //   if (size && gameRoot && gameRoot.getRenderer) {
      //     gameRoot.getRenderer().resize(size.width, size.height);
      //
      //     // 修正 loading 座標
      //     if (loading.setPosition) {
      //       loading.setPosition({
      //         x: size.width / 2,
      //         y: size.height / 2
      //       });
      //     }
      //   }
      // } else {
      //   let size = gamecard.resize.vertical;
      //   if (size && gameRoot && gameRoot.getRenderer) {
      //     gameRoot.getRenderer().resize(size.width, size.height);
      //
      //     // 修正 loading 座標
      //     if (loading.setPosition) {
      //       loading.setPosition({
      //         x: size.width / 2,
      //         y: size.height / 2
      //       });
      //     }
      //   }
      // }
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
  eventKeys.release();
  nuts.scene.sceneManager.destroyAllSound();
});

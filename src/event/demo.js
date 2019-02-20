/* ************************************************************************
 *
 * Copyright:
 *
 * License:
 *
 * Authors:
 *
 ************************************************************************ */

import app from 'entity/app';
import Sub from 'entity/sub';
import Seed from 'entity/seed';
import * as command from 'net/command';
import * as net from 'net/network';
import * as loading from 'loading/base';

let sub = null;
let eventList = null;

import * as module from 'component/module';


/**
 * create
 * @return {Object} 傳回命令對照表
 */
export function create (config) {

  if (eventList) {
    return eventList;
  }

  let game = config.game;
  let testID = 'testTheOther';


  let seed = Seed.getSingleton();

  eventList = {

    /**
     * 動畫範例 - 播放
     */
    play () {
      console.log('播放');
      let name = 'fiveOfKind';
      let configList = [
        { name: 'text', animationName: 'demo' },
        { name: 'star', animationName: 'demo' }
      ];

      // todo:spine 播放動畫範例
      if (seed) {
        seed.play(name, configList);
      }
    },

    /**
     * 動畫範例 - 停止
     */
    stop () {
      console.log('停止');
      let name = 'fiveOfKind';

      // todo:spine 停止動畫範例
      if (seed) {
        seed.stop(name);
      }
    },

    /**
     * 呼叫子場景
     */
    callSubScene (data) {
      console.log('呼叫子場景');

      if (game) {
        if (!sub) {
          sub = new Sub(game);
          Sub.setSingleton(sub);
        }
      }

      let config = {
        isDestroyScene: false,
        sceneList: [
          {scene: sub}
        ],
        finish () {

          // 場景建立完成後需要執行的流程
          sub.run(data);

          // 設定子場景結束時需要執行的動畫
          sub.setEvent({
            finish: eventList.subSceneFinish
          });
        }
      };
      loading.create(config);
    },

    /**
     * 子場景 - 動畫播放完成
     */
    subSceneFinish () {
      console.log('子場景 - 表演結束');

      // 移除子場景
      sub.removeFromScene();

      // 開始播放主場景結束流程
      if (seed) {
        seed.end();
      }
    },

    /**
     * 主場景 - 回合結束
     */
    roundFinish () {
      console.log('主場景 - 回合結束');
    },

    /**
     * 自動
     */
    clickAuto () {
      if (seed) {
        seed.enableStageEvent();
      }
      if (game && game.scene) {
        game.scene.setMode('demo');
      }

      // let set = {
      //   index: 0,
      //   type: module.TYPE_DEMO
      // };
      // module.add(set);

      if (seed) {
        seed.reset('h');
      }
    },

    /**
     * 一般
     */
    clickNormal () {

      if (seed) {
        seed.disableStageEvent();
      }
      if (game && game.scene) {
        game.scene.setMode('real');
      }


      // if (game && game.getRenderer) {
      //   game.getRenderer().resize(900, 1680);
      // }
      if (seed) {
        seed.reset('v');
      }
    },

    /**
     * 下注
     */
    clickBet () {
      console.log('下注');
      if (!game) {
        return;
      }
      let jackpot = JSON.parse(`{"mJpOutIdx":0,"mJpOutScene":"NULL","mJpOutValue":0,
      "mJpValue":[34713731,51699878,69600704,104784137,23779170,37964995],"resultCode":1}`);

      let loading = null;
      if (seed) {
        loading = seed.getLoading();
      }

      let sceneID = 'Jackpot';
      let gameID = 'sample.0';
      let config = {
        style: {
          position: 'absolute',
          left: '0%',
          top: '0%',
          width: '100%',
          height: '100%'
        },
        reference: {
          left: 0.0,
          top: 0.0,
          width: 1.0,
          height: 1.0
        },
        groupName: 'demo',
        id: testID,
        sceneID: sceneID,
        loadingEvent: {
          start ()  {
          },

          resBegin (/*index*/) {
          },

          resEnd (/*index*/) {
          },

          sceneResBegin (/*id*/) {
          },

          sceneResLoading (value) {

            // 顯示進度
            let s = value.state;
            let totalProgress = value.totalProgress;
            if (s) {
              let baseValue = (s.currentIndex - 1) / s.totals * 100;
              totalProgress = baseValue + totalProgress / s.totals;
            }

            if (loading && loading.progress) {
              loading.progress.setValue(totalProgress.toFixed(0));
            }
          },

          sceneResEnd (/*id*/) {
          },

          finish (scene) {
            scene.localEvent.enter({
              jackpot,
              id: gameID,
              from: game.scene.info.id
            });
            if (seed) {
              seed.setLoadingVisible(false);
            }

            game.scene.localEvent.pause();
            game.once();
          }
        }
      };

      // 是否已經建立完成
      let scene = game.scene.getTheOther(testID);
      if (scene) {
        scene.localEvent.enter({
          jackpot,
          id: gameID,
          from: game.scene.info.id
        });
        game.scene.localEvent.pause();
      } else {
        if (game.scene && game.scene.createTheOther) {
          game.scene.createTheOther(config);
          if (seed) {
            seed.setLoadingVisible(true);
          }
          if (loading && loading.progress) {
            if (game.scene.gamecard && game.scene.gamecard.pixiConfig) {
              let pixiConf = game.scene.gamecard.pixiConfig;
              let pos = {
                x: pixiConf.width / 2,
                y: pixiConf.height / 2
              };
              loading.x = pos.x;
              loading.y = pos.y;
            }

            loading.progress.setValue(0);
          }
        }
      }
    },

    /**
     * 說明
     */
    clickRule () {
      console.log('說明');
      module.setVisible(true);

      let set = {
        index: 1,
        type: module.TYPE_FORM
      };
      module.add(set);
    },

    /**
     * 開始
     */
    clickStart () {
      console.log('開始');
      if (game) {
        if (!game.debug) {

          //        game.debug = true;
          if (game.stats) {
            let style = game.stats.dom.style;
            style.left = '20px';
            style.top = '20px';
          }
        }
        if (game.sysTray) {
          game.sysTray.visible = !game.sysTray.visible;
        }
      }

      let flag = false;
      if (seed) {
        if (seed.run()) {
          flag = true;
        }
      } else {
        flag = true;
      }
      if (flag) {

        // todo: 下注範例
        let state;
        let dataObj = {
          bet: 100
        };

        //--
        const CMD = command.CMD;
        state = net.sendCommand(CMD.BET, dataObj);
        console.log('net.sendCommand state : ' + state);
      }
    },

    /**
     * 確認
     */
    clickOk () {
      console.log('確認');
    },

    /**
     * 離開
     */
    clickLeave () {
      console.log('離開');
      if (app.isChild) {
        game.scene.localEvent.leave();
      } else {

        // todo 取得指定的專案
        let scene = game.scene.getTheOther(testID);
        if (scene) {
          scene.localEvent.leave({
            from: game.scene.info.id
          });
        }
      }

      let set = {
        index: 0,
        type: module.TYPE_FORM
      };
      module.add(set);

    }
  };
  return eventList;
}

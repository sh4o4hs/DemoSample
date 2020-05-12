/* ************************************************************************
 *
 *   Copyright:
 *
 *   License:
 *
 *   Authors:
 *
 ************************************************************************ */
// import * as strings from 'language/strings';

import * as nuts from 'nuts';
import app from 'entity/app';

// import * as sceneInfo from 'src/scenes/info';
// import * as sceneSub from 'src/scenes/sub';

/**
 * 物件初始化
 * @param {Object} that
 */
export function normal (that) {

  let ui = nuts.ui;
  const NUM = ui.Number.NUM;

  let center = that.getCenter();

  //  let textures = center.textures.demo;
  let ruleVisible = false;
  class Rule {
    constructor (obj, layer) {
      this.group = obj;
      this.layer = layer;
    }
    show () {
      this.layer.addChild(this.group);
    }
    hide () {
      this.layer.removeChild(this.group);
    }
    reload (scene) {
      let self = this;
      console.log(scene);
      self.group.reload();
    }
  }

  // function createOther () {
  //   console.log('建立附屬專案');

  //   let game = center.game;

  //   let jackpot = JSON.parse(`{"mJpOutIdx":0,"mJpOutScene":"NULL","mJpOutValue":0,
  //   "mJpValue":[34713731,51699878,69600704,104784137,23779170,37964995],"resultCode":1}`);

  //   let loading = null;

  //   let sceneID = 'other';
  //   let gameID = 'zzzz.0';
  //   let config = {
  //     style: {
  //       position: 'absolute',
  //       left: '50%',
  //       top: '0%',
  //       width: '50%',
  //       height: '100%'
  //     },
  //     reference: {
  //       left: 0.5,
  //       top: 0.0,
  //       width: 0.5,
  //       height: 1.0
  //     },
  //     groupName: 'demo',
  //     id: gameID,
  //     sceneID: sceneID,
  //     loadingEvent: {
  //       start ()  {
  //       },

  //       resBegin (/*index*/) {
  //       },

  //       resEnd (/*index*/) {
  //       },

  //       sceneResBegin (/*id*/) {
  //       },

  //       sceneResLoading (value) {

  //         // 顯示進度
  //         let s = value.state;
  //         let totalProgress = value.totalProgress;
  //         if (s) {
  //           let baseValue = (s.currentIndex - 1) / s.totals * 100;
  //           totalProgress = baseValue + totalProgress / s.totals;
  //         } else {
  //           totalProgress = value.current / value.length * 100;
  //         }

  //         if (loading && loading.progress) {
  //           loading.progress.setValue(totalProgress.toFixed(0));
  //         }
  //         console.log(totalProgress);
  //       },

  //       sceneResEnd (/*id*/) {
  //       },

  //       finish (scene) {

  //         /*
  //         scene.localEvent.enter({
  //           jackpot,
  //           id: gameID,
  //           from: game.scene.info.id
  //         });
  //         */
  //         console.log('==================================');
  //         console.log(scene);
  //         scene.localEvent.play({
  //           jackpot,
  //           id: gameID,
  //           from: game.scene.info.id
  //         });
  //         scene.localEvent.show();

  //         game.scene.localEvent.pause();
  //         game.once();
  //       }
  //     }
  //   };

  //   // 是否已經建立完成
  //   // let scene = game.scene.getTheOther(testID);
  //   // if (scene) {
  //   //   scene.localEvent.enter({
  //   //     jackpot,
  //   //     id: gameID,
  //   //     from: game.scene.info.id
  //   //   });
  //   //   game.scene.localEvent.pause();
  //   // } else {
  //   // }
  //   if (game.scene && game.scene.createTheOther) {
  //     game.scene.createTheOther(config);

  //     if (loading && loading.progress) {
  //       if (game.scene.gamecard && game.scene.gamecard.pixiConfig) {
  //         let pixiConf = game.scene.gamecard.pixiConfig;
  //         let pos = {
  //           x: pixiConf.width / 2,
  //           y: pixiConf.height / 2
  //         };
  //         loading.x = pos.x;
  //         loading.y = pos.y;
  //       }

  //       loading.progress.setValue(0);
  //     }
  //   }
  // }

  //--初始化對照表
  let set =  {
    async setInfo (obj) {
      async function create () {
        console.log('[初始化說明場景]');
        let scene = await import('scene/info');
        console.log('[開始建立說明場景]');
        await scene.create();
        console.log('[完成建立說明場景]');
      }
      obj.setClick((/*o*/) => {
        // ruleVisible = !ruleVisible;
        // if (ruleVisible) {
        //   create();
        // } else {
        //   center.rule.hide();
        // }
        let config = {
          game: 'HexagonSlot',
          group: 'slot',
          id: 'sample',
          tablekey: 'abcd1234'
        };
        app.game.scene.reload(config);
      });
    },

    async setPlay (obj) {

      async function play () {

        // 傳送網路命令
        let cmd = await  import('net/command/bet');
        await cmd.send(1000);
      }

      obj.setClick((/*o*/) => {
        play();
      });
    },

    async setLeave (obj) {

      // async function leave () {
      //   console.log('leave');
      //   console.log(app);
      //   center.game.scene.callTheOther(app.gamecard.theOther, {
      //     jackpot: app.jackpot
      //   });
      // }

      obj.setClick((/*o*/) => {
        // leave();

        // createOther();
        let config = {};

        //config.url = '//www.gt-igaming.com/real/bingo?language=zh-cn';
        // config.url = 'http://beta.sp2001.com:8070/web/BetTracer?g=BingoParade001001&key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnYW1lcklkIjoiY255X2J0cGxhdF9idGFnZW50X2J0aG91c2VfdHJ5X2RlbW8xMjM0Iiwibmlja25hbWUiOiJkZW1vMTIzNCIsImlhdCI6MTU4OTE1OTMxNiwiZXhwIjoxNTg5MjQ1NzE2fQ.0u1S9rfDnRRWimNQvlPYh9WM2wkJNRCHMaiDSwhC9LE&z=+8&lang=zh-CN';

        // config.setting = {
        //   id: 'info',
        //   isLock: true,
        //   left: '5%',
        //   top: '5%',
        //   width: '90%',
        //   height: '90%',
        //   game: {
        //     width: 4096,
        //     height: 4096,
        //     portrait: {
        //       width: 5400,
        //       height: 9600
        //     },
        //     landscape: {
        //       width: 9600,
        //       height: 5400
        //     }
        //   },
        //   reference: {
        //     left: 0.0,
        //     top: 0.0,
        //     width: 1.0,
        //     height: 1.0
        //   }
        // };

        app.game.scene.callWeb(config);
      });
    },

    // 設定動畫
    setAnim (obj) {
      obj.play();
    },

    // 設定數字
    setNum (obj) {
      obj.setAlign(NUM.HORI_ALIGN.CENTER, NUM.VERTI_ALIGN.CENTER);
      obj.fixVal = 2;
      obj.setValue(654321);
    },

    // 設定 spine
    setSpine (obj) {
      obj.play();
    },
    createRule () {
      console.log('[create rule]');

      // console.log(obj);
      // center.rule = new Rule(obj, center.game.layer.foreground);
    },
    autoonPageNumber (obj) {
      obj.fixVal = center.decimal;
      obj.setAnchor({
        x: 0.0,
        y: 0.0
      });
      obj.setAlign(NUM.HORI_ALIGN.RIGHT, NUM.VERTI_ALIGN.TOP);
      obj.setValue(999999.00);
    }
  };

  let config = {
    set
  };
  that.init(config);
}

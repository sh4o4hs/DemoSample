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

// import * as other from 'loading/other';

import * as component from 'src/component';

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
  /*
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
*/

  // function createOther () {
  //   console.log('建立附屬專案');

  //   let game = center.game;

  //   let jackpot = JSON.parse(`{"mJpOutIdx":0,"mJpOutScene":"NULL","mJpOutValue":0,
  //   "mJpValue":[34713731,51699878,69600704,104784137,23779170,37964995],"resultCode":1}`);


  //   let sceneID = 'dragontiger';
  //   let gameID = 'other';
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
  //     groupName: 'video',
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
  //         let totalProgress = value.totalProgress;
  //         let num = totalProgress.toFixed(0);
  //         console.log('num : ' + num);
  //       },

  //       sceneResEnd (/*id*/) {
  //       },

  //       finish (scene) {

  //         scene.localEvent.enter({
  //           jackpot,
  //           id: gameID,
  //           from: game.scene.info.id
  //         });
  //         scene.localEvent.play({
  //           jackpot,
  //           id: gameID,
  //           from: game.scene.info.id
  //         });

  //         game.scene.localEvent.pause();
  //         game.once();
  //       }
  //     }
  //   };

  //   // 是否已經建立完成
  //   let scene = game.scene.getTheOther(gameID);
  //   if (scene) {

  //     scene.localEvent.enter({
  //       jackpot,
  //       id: gameID,
  //       from: game.scene.info.id
  //     });

  //     scene.localEvent.play({
  //       id: gameID,
  //       from: game.scene.info.id
  //     });

  //     game.scene.localEvent.pause();
  //     game.once();

  //   } else {
  //     game.scene.createTheOther(config);
  //   }
  // }

  let videoSourceIndex = 0;

  let videoSourceList = [
    'wss://lcsvd001001wss.streamingvds.com:8174/',
    'wss://lcsvd001001wss.streamingvds.com:8374/',
    'wss://lcsvd001001wss.streamingvds.com:8474/',
    'wss://bgvd001001wss.streamingvds.com:9084/'
  ];

  //--初始化對照表
  let set =  {
    async setInfo (obj) {

      // async function create () {
      //   console.log('[初始化說明場景]');
      //   let scene = await import('scene/info');
      //   console.log('[開始建立說明場景]');
      //   await scene.create();
      //   console.log('[完成建立說明場景]');
      // }
      obj.setClick(async (/*o*/) => {

        // let project = {
        //   id: 'HexagonSlot',
        //   group: 'slot',
        //   name: 'HexagonSlot',
        //   reloadConfig: {
        //     tablekey: 'abc123',
        //     id: 'HexagonSlot'
        //   }
        // };

        // other.create(project);
        // component.releaseVideo();
        await app.game.idle(0.01);
        let config = {
          game: 'HexagonSlot',
          group: 'slot',
          id: 'sample',
          tablekey: 'abcd1234',
          zzz: 'aaa'
        };
        app.game.scene.reload(config);


      });
    },

    async setAuto (obj) {
      obj.setClick(async (/*o*/) => {
        let com = await import('/project/example/z01/debug/main.js');
        console.log(com);
      });
    },

    async setPlay (obj) {

      async function play () {

        // 歷程 下注
        if (app.game.report) {
          app.game.report.serviceBegin(app.recordBet);
        }

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

      obj.setClick(async (/*o*/) => {

        // component.releaseVideo();
        await app.game.idle(0.01);

        let other  = await import('loading/other');

        let project = {
          id: 'sample',
          group: 'video',
          name: 'dragontiger',
          reloadConfig: {
            tablekey: 'abc123',
            id: 'sample'
          }
        };

        other.create(project);

        // let config = {};
        // config.url = '//www.gt-igaming.com/real/bingo?language=zh-cn';

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
        // app.game.scene.callWeb(config);

      });
    },

    // 設定下注
    setBet (obj) {
      let sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);

      obj.setClick(async (/*o*/) => {

        let sound = center?.sounds?.demo;
        sound?.countDown?.play();

        let url = videoSourceList[videoSourceIndex];
        videoSourceIndex++;
        if (videoSourceIndex >= videoSourceList.length) {
          videoSourceIndex = 0;
        }
        let streaming = new app.game.Streaming(PIXI);
        let texture = await streaming.play(url);
        console.log(texture);
        let videoScreen = streaming.videoScreen;
        let w = videoScreen.width / 4;
        let h = videoScreen.height / 4;

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            let x = i * w;
            let y = j * h;
            let frame = new PIXI.Rectangle(x, y, w, h);
            let te = new PIXI.Texture(texture.baseTexture, frame);
            let child = new PIXI.Sprite(te);
            child.texture = te;
            child.x = 5 + i * (w + 5);
            child.y = 5 + j * (h + 5);
            app.game.layer.overlay.addChild(child);
            createjs.Tween.get(child, { loop: true })
              .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4))
              .to({ alpha: 0, y: 175 }, 500, createjs.Ease.getPowInOut(2))
              .to({ alpha: 0, y: 225 }, 100)
              .to({ alpha: 1, y: 200 }, 500, createjs.Ease.getPowInOut(2))
              .to({ x: 100 }, 800, createjs.Ease.getPowInOut(2));

          }
        }


        // nuts.updateManager.add({
        //   update (offsetTime) {
        //     frame.x += 1;
        //     if (frame.x > 200) {
        //       frame.x = 0;
        //     }
        //     sprite.texture.updateUvs();
        //   }
        // });

        // sprite.texture = texture;
        // sprite.x = 0;
        // sprite.y = 768 / 2;
        // sprite.anchor.x = 0;
        // sprite.anchor.y = 0.5;
        // sprite.alpha = 1.0;
        // app.game.layer.overlay.addChild(sprite);
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

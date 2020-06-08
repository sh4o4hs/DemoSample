/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */
// import * as nuts from 'nuts';
import app from 'entity/app';

export async function create (project) {

  return new Promise((resolve) => {
    console.log('[建立附屬專案]');
    let game = app.game;

    // let sceneID = 'dragontiger';
    // let gameID = 'other';
    let id = project.id;
    let group = project.group;
    let name = project.name;
    let reloadConfig = project.reloadConfig;

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
      groupName: group,
      id: 'other',
      sceneID: name,
      loadingEvent: {

        // 開始 (進度歸零)
        start ()  {
        },

        resBegin (/*index*/) {
        },

        resEnd (/*index*/) {
        },

        sceneResBegin (/*id*/) {
        },

        // 顯示進度
        sceneResLoading (value) {
          let totalProgress = value.totalProgress;
          let num = totalProgress.toFixed(0);
          console.log('num : ' + num);
        },

        sceneResEnd (/*id*/) {
        },

        // 完成
        finish (scene) {

          game.scene.localEvent.pause();
          game.once();

          // 目標專案
          scene.localEvent.enter({
            reloadConfig,
            id: id
          });
          scene.localEvent.play({
            id: id,
            from: game.scene.info.id
          });

          resolve(scene);
        }
      }
    };

    // 是否已經建立完成
    // let scene = game.scene.getTheOther('other');
    // if (scene) {

    //   scene.localEvent.enter({
    //     reloadConfig,
    //     id: id,
    //     from: game.scene.info.id
    //   });

    //   scene.localEvent.play({
    //     id: id,
    //     from: game.scene.info.id
    //   });

    // } else {
    //   game.scene.createTheOther(config);
    // }

    // 建立專案
    game.scene.createTheOther(config);
  });
}

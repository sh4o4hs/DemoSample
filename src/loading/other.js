/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */
import * as nuts from 'nuts';
import app from 'entity/app';

let isBusy = false;

export async function create (project) {

  // 是否建立中
  if (isBusy) {
    return;
  }
  isBusy = true;

  return new Promise((resolve, reject) => {
    console.log('[建立附屬專案]');
    let game = app.game;
    let other = app.other;
    if (!other) {
      other = {};
      app.other = other;
    }

    let id = project.id;
    let tablekey = id;
    let group = project.group;
    let name = project.name;
    let reloadConfig = project.reloadConfig;

    function finish (scene, isCreate = true) {

      game.scene.localEvent.pause();
      game.once();

      // 目標專案
      if (isCreate) {
        scene.localEvent.enter({
          id,
          tablekey
        });
      }

      scene.localEvent.play({
        id,
        tablekey,
        from: game.scene.info.id
      });

      isBusy = false;
      resolve(scene);
    }

    function cancel () {
      isBusy = false;
      reject();
    }

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
      reloadConfig,
      loadingEvent: {

        // 開始
        start () {
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

          other.timeout = nuts.updateManager.setTimeout(() => {
            other.timeout = null;
            cancel();
          }, 6);
        },

        sceneResEnd (/*id*/) {
        },

        // 完成
        finish (scene) {
          finish(scene);
        }
      }
    };

    // 是否已經建立完成
    let scene = game.scene.getTheOther(config.id);
    if (scene) {
      finish(scene, true);
    } else {
      game.scene.createTheOther(config);
    }

  });
}

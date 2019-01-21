/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */

import * as nuts from 'nuts';
import * as strings from 'language/strings';
import Seed from 'entity/seed';

/**
 * 建立場景
 * @param conf {Object} lobby 傳入建立場景設定檔
 */
export function create (conf) {
  let game = conf.game;
  let loadingMgr = nuts.scene.loadingManager;
  let sceneList;

  // 設定多語
  strings.setLanguage(conf.langID);
  console.log(strings.get('loading'));

  // 設定 base URL
  let baseURL = conf.baseURL || '';
  nuts.scene.sceneManager.setBaseURL(baseURL);

  let seed = new Seed(game);
  Seed.setSingleton(seed);

  //--設定讀取畫面
  let loading = nuts.ui.loading;
  let resource = [
    baseURL + '/project/demo/sample/res/loading/Loading_01.png',
    baseURL + '/project/demo/sample/res/loading/Loading_02.png',
    baseURL + '/project/demo/sample/res/loading/Loading_03.png',
    baseURL + '/project/demo/sample/res/loading/Loading_04.png',
    baseURL + '/project/demo/sample/res/loading/Loading_05.png',
    baseURL + '/project/demo/sample/res/loading/Loading_06.png',
    baseURL + '/project/demo/sample/res/loading/Loading_07.png',
    baseURL + '/project/demo/sample/res/loading/Loading_08.png',
    baseURL + '/project/demo/sample/res/loading/Loading_09.png',
    baseURL + '/project/demo/sample/res/loading/Loading_10.png',
    baseURL + '/project/demo/sample/res/loading/Loading_11.png',
    baseURL + '/project/demo/sample/res/loading/Loading_12.png'
  ];
  loading.setScene(resource);
  loadingMgr.setDisplayLoading(loading);

  let createFinish = function () {
    seed.eventFinish();
    seed.addToScene();
    game.play();
  };

  // 設定場景更新方式
  let loadingEvent = conf.loadingEvent;
  if (loadingEvent) {

    // 場景建立完成
    createFinish = function () {

      // reset
      loadingMgr.setGame(game);
      loadingMgr.setUseLobbyState(false);
      game.play();

      // 通知 lobby 遊戲場景建立完成
      if (loadingEvent.finish) {
        loadingEvent.finish();
      }
    };

    // 通知 lobby 開始建立遊戲場景
    if (loadingEvent.start) {
      loadingEvent.start();
    }
  }

  // 場景清單
  sceneList = [];
  sceneList.push({ scene: seed });
  loadingMgr.go(sceneList, createFinish);
}

/**
 * 銷毀場景 (目前沒使用)
 */
export function destroy () {

  // todo: 釋放資源
  // 銷毀音樂音效
  nuts.scene.sceneManager.destroyAllSound();
}


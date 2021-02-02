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

// //import * as nuts from 'nuts';
import app from 'entity/app';

// import app from 'entity/app';
import * as strings from 'language/strings';


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


let eventList = null;

/**
 * 初始化事件 (接收大廳傳送的命令用)
 * @returns {Object} 傳回物件事件
 */
export async function init (config) {

  if (eventList) {
    return eventList;
  }

  console.log('scene init');

  // 初始化
  app.isChild = config.isChild;

  let nuts = config.nuts;
  let baseURL = config.baseURL || '.';
  let langID = config.langID;

  app.nuts = nuts;
  app.baseURL = baseURL;
  app.langID = langID;

  eventList = {

    /**
     * 建立場景
     * @param conf config
     */
    async create (conf)  {
      let game = conf.game;
      let loadingEvent = null;

      app.game = game;
      if (game.scene) {
        loadingEvent = game.scene.loadingEvent;
        app.gamecard = game.scene.gamecard;
      }

      nuts.scene.sceneManager.setBaseURL(baseURL);


      // 建立場景
      let scene = await import('scene/main');

      nuts.scene.sceneManager.setEvent(loadingEvent);

      await scene.create(game, loadingEvent);

      nuts.scene.sceneManager.setEvent(null);
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
    async enter (conf) {
      console.info('[scene] enter ');
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
        console.info(ip);
      }

      game.disconnect = () => {
        console.info('!!!! game.disconnect !!!!');
      };

      // 讀取資源
      let sceneLoad = await import('scene/load');
      sceneLoad.create(game);

      // 測試
      // async function test () {
      //   let obj = await game.getProject('video/domains');
      //   console.log('========= get domains =========');
      //   console.log(obj);

      //   let lib = obj.lib;
      //   let sources;
      //   sources = await lib.getVideoSource('BaccaratSeatPC');
      //   console.log('==== pc sources ====');
      //   console.log(sources);

      //   sources = await lib.getVideoSource('BGBaccarat');
      //   console.log('==== mobile sources ====');
      //   console.log(sources);

      //   let photos = null;

      //   // let photos = await game.getProject('video/photos');
      //   if (photos) {
      //     console.log(photos);
      //     let lib = photos.lib;
      //     let pathname = photos.pathname;
      //     let dataList = await lib.getDealer();
      //     console.log(dataList);
      //     let data = dataList[12];
      //     console.log(data);
      //     if (data && data.photo) {
      //       let filename = `${pathname}/${data.photo}`;
      //       let te = PIXI.Texture.from(filename);
      //       let sprite = new PIXI.Sprite(te);
      //       sprite.x = 20;
      //       sprite.y = 40;
      //       game.layer.overlay.addChild(sprite);
      //     }
      //   }
      // }

      // test();
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

  // 設定多語
  strings.setLanguage(app.langID);

  // 設定資源
  let vendor = await import('src/vendor');
  vendor.setLang(langID);
  vendor.setBaseURL(baseURL);

  return eventList;
}

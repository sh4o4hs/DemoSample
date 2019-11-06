import m from 'mithril';
import Loader from 'resource-loader';
import Stats from 'stats';

import * as nuts from 'nuts';
import app from 'entity/app';
import * as entity from 'src/entity';
import * as scene from 'src/scene';
import comUI from 'component/ui';
import Background from 'component/background';

let defaultStyle = {
  position: 'absolute',
  left: '0%',
  top: '0%',
  width: '100%',
  height: '100%'
};
let styleList = [
  {
    position: 'absolute',
    left: '0%',
    top: '0%',
    width: '50%',
    height: '100%'
  },
  {
    position: 'absolute',
    left: '50%',
    top: '0%',
    width: '50%',
    height: '100%'
  }
];

// todo : 是否顯示背景
let useBackground = false;
let backgroundFilename = null;

// todo : 是否使用 UI
let useUI = app.useUI;

// todo : 是否顯示 UI
let visibleUI =  app.visibleUI;

// todo : 是否使用 PIXI
let usePIXI = app.usePIXI;

function setBackgroundFilename (filename) {
  backgroundFilename = filename;
  m.redraw();
}

function setUseUI (enable) {
  useUI = enable;
  m.redraw();
}
function isUseUI () {
  return useUI;
}
function setVisibleUI (enable) {
  visibleUI = enable;
  m.redraw();
}

let plugin = [

  // 'pixi-spine',
  // 'pixi-particles'
];

let comList = [];
function add (com, index = 0) {
  comList[index] = com;
  m.redraw();
}
function remove (index = 0) {
  comList[index] = null;
  let last = comList.pop();
  if (index < comList.length) {
    comList[index] = last;
  }
  m.redraw();
}

function create (config, index = 0) {

  let component = {

    // oninit (vnode) {
    // },
    view () {
      return m(config.component,
        {
          style: styleList[index],
          config
        }
      );
    }
  };
  add(component, index);
}

let Component = {
  entity: null,
  game: null,
  oninit (/*vnode*/) {
  },
  oncreate (/*vnode*/) {
    if (Component.game && Component.game.scene) {
      Component.game.scene.ready();
    }
  },
  view (/*vnode*/) {
    return m('.',
      {
        style: defaultStyle
      }, [
        (useBackground && backgroundFilename) ? m(Background,
          {
            imageName: backgroundFilename
          }
        ) : null,

        // 遊戲
        comList.map(com => {
          return m(com);
        }),

        // 共用操作界面
        (useUI && visibleUI) ? m(comUI)
          : null
      ]
    );
  }
};

/**
 * 初始化
 * @returns {void}
 */
function init () {

  return new Promise((resolve/*, reject*/)=> {
    let config = {};
    config.Loader = Loader;
    config.m = m;

    // 是否使用 PIXI
    if (usePIXI) {
      config.PIXI = PIXI;
      config.Stats = Stats;
      config.plugin = plugin;
    }

    // 初始化
    nuts.init(config).then(() => {
      let config = {};
      config.id = document.body.id || 9999;
      config.event = scene.init({
        entity
      });

      Component.game = nuts.game.run(config);
      Component.game.id = config.id;
      Component.entity = entity;

      resolve(Component);
    });
  });
}

export {
  setBackgroundFilename,
  add,
  remove,
  create,
  init,
  setUseUI,
  setVisibleUI,
  isUseUI,
  Component
};

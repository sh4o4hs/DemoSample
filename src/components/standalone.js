import m from 'mithril';
import * as Loader from 'resource-loader';
import Stats from 'stats';

import * as nuts from 'nuts';

import * as sceneDemo from 'scene/demo';

let defaultStyle = {
  position: 'absolute',
  left: '0%',
  top: '0%',
  width: '100%',
  height: '100%'
};


let plugin = [

  // 'pixi-spine',
  // 'pixi-particles'
];


let Component = {
  oninit (/*vnode*/) {
    let config = {
      id: 'aaaa0001',
      width: 1024,
      height: 768,
      resolution: 1,
      antialias: false,
      transparent: true
    };
    this.config = config;
    config.game = nuts.game.run();

  },
  oncreate (/*vnode*/) {
  },
  view (/*vnode*/) {
    let config = this.config;
    return m('.',
      {
        style: defaultStyle
      },
      m(nuts.components.game.pixi, {
        config,
        ready (game) {
          console.log(game);
          game.play();
          sceneDemo.create(game);
        }
      })
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

    // 使用 PIXI
    config.PIXI = PIXI;
    config.Stats = Stats;
    config.plugin = plugin;

    // 初始化
    nuts.init(config).then(() => {
      let config = {};
      config.id = document.body.id || 9999;

      resolve(Component);
    });
  });
}

export {
  init,
  Component
};

import m from 'mithril';

//import * as Loader from 'resource-loader';
//import Stats from 'stats';

import * as nuts from 'nuts';
import * as scene from 'src/scene';

let defaultStyle = {
  position: 'absolute',
  zIndex: 9,
  left: '0%',
  top: '0%',
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0)'
};

let plugin = [
  'pixi-spine',
  'pixi-particles'
];

export let Component = {
  oninit (vnode) {
    let attrs = vnode.attrs;
    this.config = attrs.config;
    this.style = attrs.style || defaultStyle;
  },
  oncreate (/*vnode*/) {
  },
  view () {
    let config = this.config;
    let style = this.style;
    return m(nuts.components.game.pixi,
      {
        style,
        config
      }
    );
  }
};

export let Other = {
  oninit (vnode) {
    let attrs = vnode.attrs;
    this.config = attrs.config;
    this.style = {
      position: 'absolute',
      zIndex: 9,
      left: '0%',
      top: '0%',
      width: '50%',
      height: '100%'
    };
  },
  oncreate (/*vnode*/) {
  },
  view () {
    let config = this.config;
    let style = this.style;
    return m(nuts.components.game.pixi,
      {
        style,
        config
      }
    );
  }
};

/**
 * 初始化
 * @returns {void}
 */
export async function init () {

  // await import('pixi');
  let Loader = await import('resource-loader');

  // let Stats = await import('stats.js');

  let config = {};
  config.Loader = Loader;
  config.m = m;

  config.PIXI = PIXI;

  // config.Stats = Stats;
  config.plugin = plugin;

  await nuts.init(config);

  // 建立
  config = {};
  config.id = document.body.id || 9999;
  config.event = scene.init();

  let game = nuts.game.run(config);
  game.id = config.id;

  // 通知 lobby 準備好了
  if (game.scene) {

    let manual = {
      overview: true
    };

    game.scene.ready(manual);
  }
}


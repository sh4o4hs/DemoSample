import app from 'entity/app';

import m from 'mithril';
import createjs from 'tweenjs';

import * as PIXI from 'pixi.js';
import * as spine from 'pixi-spine';
import * as nuts from 'nuts';

let defaultStyle = {
  position: 'absolute',
  zIndex: 0,
  left: '0%',
  top: '0%',
  width: '100%',
  height: '100%'
};


export let Component = {
  oninit (vnode) {
    let attrs = vnode.attrs;
    this.config = attrs.config;
    this.style = attrs.style || defaultStyle;
    this.config.PIXI = PIXI;
    this.config.spine = spine;

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
export async function init (scene) {
  console.log('!!!!!!!!!! init !!!!!!!!!!!!');
  app.nuts = nuts;


  // let Stats = await import('stats');
  // let Loader = await import('resource-loader');

  let config = {
    Ticker: createjs.Ticker,
    m: m
  };

  // config.plugin = plugin;

  await nuts.init(config);

  // 建立
  config = {};
  config.id = document.body.id || 9999;
  config.event = scene.init();

  let game = nuts.game.run(config);
  game.id = config.id;

  // 通知 lobby 準備好了
  if (game.scene) {
    game.scene.ready();
  }
}


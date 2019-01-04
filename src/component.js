/* ************************************************************************
 *
 *   Copyright:
 *
 *   License:
 *
 *   Authors:
 *
 ************************************************************************ */

import m from 'mithril';

import * as game from 'component/game';
import * as module from 'component/module';
import Background from 'component/background';


let imageName = '/project/demo/sample/res/background/background.jpg';

/**
 * 啟動程式
 * @returns {void}
 */
export function run () {

  // todo : 是否顯示背景
  let useBackground = true;

  // todo : 設定 overview 圖片
  let set = {
    index: 0,
    type: module.TYPE_OVERVIEW,
    attrs: {
      logo: '/project/demo/sample/res/overview/cat.jpg'
    }
  };
  module.add(set);

  // 設定最大顯示畫面
  let style = {
    position: 'absolute',
    left: '0%',
    top: '0%',
    width: '100%',
    height: '100%'
  };

  let Application = {
    main: {
      view () {
        return m('.bg-white red', 'init');
      }
    },

    view () {
      return m('.',
        {
          style
        },
        useBackground ? m(Background,
          {
            imageName
          }
        ) : null,
        m(Application.main),
        module.isVisible() ? m(module.Component,
        ) : null,
      );
    }
  };
  m.mount(document.body, Application);

  // 初始化
  game.init().then(component => {
    if (component) {
      Application.main = component;
      m.redraw();
    }
  });
}

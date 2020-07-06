
import m from 'mithril';

let canvasStyle = {
  position: 'absolute',
  left: '0%',
  top: '0%',
  width: '100%',
  height: '100%'
};
let baseStyle = {
  zIndex: 10,
  position: 'absolute',
  left: '0%',
  top: '0%',
  width: '100%',
  height: '100%'
};


async function link (config) {

  let player = config.player;
  let canvas = config.canvas;
  if (player) {
    player.destroy();
    player.source = null;
    player.video = null;
    player.renderer = null;
    player.audio = null;
    player.audioOut = null;
    player.demuxer = null;
  }

  let connection = config.source;
  let LCS = await window.parent.getLCS();
  player = new LCS.Player(connection, {canvas: canvas});
  config.player = player;
  console.info(player);
}

let Component = {
  oninit (vnode) {
    let self = this;
    let attrs = vnode.attrs;

    self.style = attrs.style || baseStyle;
    self.ready = attrs.ready;

    self.setting = attrs.setting;

    self.setting.setSource = (src) => {
      self.setting.source = src;
      link(self.setting);
    };


  },

  oncreate (vnode) {
    console.info('av oncreate : ');
    let self = this;

    let setting = self.setting;
    setting.canvas = vnode.instance.children[0].dom;
    setting.element = vnode.dom;

    link(setting);

    if (self.ready) {
      self.ready();
    }
  },

  onremove (/*vnode*/) {
    console.log('av onremove');
    let self = this;
    let setting = self.setting;
    if (setting.player) {
      let player = setting.player;
      player.destroy();
      player.source = null;
      player.video = null;
      player.renderer = null;
      player.audio = null;
      player.audioOut = null;
      player.demuxer = null;
      setting.player = null;
    }
  },
  view (/*vnode*/) {
    let self = this;

    return m('.', {style: self.style},
      m('canvas', {style: canvasStyle})
    );
  }
};


export default Component;

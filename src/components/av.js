
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
  let connection = 'ws://vtest.sp2001.com:8074/';

  // let connection = 'wss://bgvd001001wss.streamingvds.com:9084/';
  let LCS = await window.parent.getLCS();
  console.info('====');
  console.info(LCS);
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
  },

  oncreate (vnode) {
    console.info('av oncreate : ');
    let self = this;
    let config = {};
    config.canvas = vnode.instance.children[0].dom;
    config.element = vnode.dom;
    console.info(config);
    link(config);


    if (self.ready) {
      self.ready();
    }
  },

  onremove (/*vnode*/) {
    console.log('av onremove');
  },
  view (/*vnode*/) {
    let self = this;

    return m('.', {style: self.style},
      m('canvas', {style: canvasStyle})
    );
  }
};


export default Component;

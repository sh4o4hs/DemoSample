
import app from 'entity/app';
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

  // 啟動串流
  let LCS = await app.game.getLCS();
  player = new LCS.Player(connection, {
    videoBufferSize: 2048 * 1024,
    disableGl: false,
    disableWebAssembly: false,
    canvas: canvas
  });
  config.player = player;

  // 檢測串流
  // let videoList = [
  //   {
  //     id: 'Ali',
  //     tables: [
  //       'wss://testplay18374.50fo.com:443/',
  //       'wss://testplay18374.50fo.com:443/',
  //       'wss://testplay18374.50fo.com:443/',
  //       'wss://testplay18374.50fo.com:443/',
  //       'wss://testplay18374.50fo.com:443/',
  //       'wss://testplay18374.50fo.com:443/'
  //     ]
  //   },
  //   {
  //     id: 'GCP',
  //     tables: [
  //       'wss://lcsvd001001wss.streamingvds.com:8174/',
  //       'wss://lcsvd001001wss.streamingvds.com:8374/',
  //       'wss://lcsvd001001wss.streamingvds.com:8474/',
  //       'wss://lcsvd001001wss.streamingvds.com:8274/',
  //       'wss://lcsvd001001wss.streamingvds.com:8074/',
  //       'wss://lcsvd001001wss.streamingvds.com:28574'
  //     ]
  //   }
  // ];

  // app.game.scanLCS(videoList).then(result => {
  //   console.log(result);
  // });
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

    self.setting.releaseVideo = () => {
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

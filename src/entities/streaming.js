

export default class Streaming {
  constructor (game) {
    let self = this;
    self.worker = null;
    self.videoScreen = null;
    self.isBusy = false;
    self.game = game;
    self.texture = PIXI.EMPTY;
  }

  async stop () {
    let self = this;

    if (!self.worker) {
      return Promise.resolve();
    }
    self.isEnd = true;
    if (self.texture) {
      self.texture = PIXI.EMPTY;
    }

    return new Promise((resolve /*, reject*/) => {
      let msg = {
        cmd: 'stop'
      };
      if (self.worker) {
        self.worker.postMessage(msg);
        self.worker.onmessage = null;
        self.worker.terminate();
        self.worker = undefined;
      }
      resolve();
    });
  }

  async play (url, options) {
    let self = this;
    if (self.isBusy) {
      return;
    }
    self.isBusy = true;

    await self.stop();


    return new Promise((resolve /*, reject*/) => {
      let isFirst = true;
      self.videoMessage = (msg) => {
        if (self.isEnd) {
          return;
        }

        if (msg.data) {
          let data = msg.data;
          if (data.byteLength > 0) {
            let array = new Uint8Array(data);
            if (!self.texture) {
              self.texture = PIXI.Texture.fromBuffer(array, self.videoScreen.width, self.videoScreen.height);
            } else {
              self.texture.baseTexture.resource.data = array;
              self.texture.baseTexture.update();
            }
            if (isFirst) {
              self.isBusy = false;
              isFirst = false;
              resolve(self.texture);
            }

            self.game.idle(0.01).then(() => {

              if (self.worker) {
                if (self.tmpBuffer) {
                  self.worker.postMessage(self.tmpBuffer, [ self.tmpBuffer ]);
                }
              }
              self.tmpBuffer = data;

            });
            return;
          }
          if (data.cmd === 'audio') {

            // console.log('!! play audio !!', msg.data.sampleRate);
          }

          if (data.cmd === 'resize') {
            self.videoScreen = data.screen;
          } else if (data.cmd === 'render') {
            let array = new Uint8Array(msg.data.buffer);
            if (!self.texture) {
              self.texture = PIXI.Texture.fromBuffer(array, self.videoScreen.width, self.videoScreen.height);
            } else {
              self.texture.baseTexture.resource.data = array;
              self.texture.baseTexture.update();
            }

            if (self.tmpBuffer) {
              self.worker.postMessage({
                cmd: data.cmd,
                buffer: self.tmpBuffer
              }, [ self.tmpBuffer ]);
            }

            self.tmpBuffer = data.buffer;

            if (isFirst) {
              self.isBusy = false;
              isFirst = false;
              resolve(self.texture);
            }
          }
        }
      };

      self.worker = new Worker('/project/lib/player/debug/main.js');
      self.worker.onmessage = self.videoMessage;
      console.log('!! streaming.play !!');

      let msg = {
        cmd: 'player',
        options: options,
        url: url
      };
      self.worker.postMessage(msg);
    });
  }


}

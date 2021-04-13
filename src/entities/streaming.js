

let project = null;

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

    if (self.isEnd || !self.worker) {
      return Promise.resolve();
    }
    self.isEnd = true;
    if (self.texture) {
      self.texture = PIXI.EMPTY;
    }

    let msg = {
      cmd: 'stop'
    };
    self.worker.onmessage = null;
    self.worker.postMessage(msg);

    await self.game.idle(0.01);

    self.worker.terminate();
    self.worker = undefined;
  }

  async play (url, options) {
    let self = this;

    if (!project) {
      project = await self.game.getProject('lib/player', true);
    }

    if (self.isBusy) {
      return;
    }
    self.isBusy = true;

    // await self.stop();


    return new Promise((resolve /*, reject*/) => {
      let isFirst = true;
      self.videoMessage = (msg) => {

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

            if (self.worker) {
              if (self.tmpBuffer) {
                self.worker.postMessage(self.tmpBuffer, [ self.tmpBuffer ]);
              }
            }
            self.tmpBuffer = data;

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

      self.worker = new Worker(project.filename);
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

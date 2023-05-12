import app from 'entity/app';

import parseAPNG from 'apng-js';

/*
let bytes = 0;

async function readData (url) {
  console.log('[readData] fetch start');
  let response = await fetch(url);
  console.log(response.headers.entries('content-length'));
  console.log('[readData] fetch end');
  for await (const chunk of response.body) {
    console.log(chunk);
    bytes += chunk.length;
    console.log(`[readData]Chunk: ${chunk.length}. Read ${bytes} characters.`);
  }
  return response;
}
*/

let cache = {};

export async function createImage (url) {

  let img = cache[url];
  if (img) {
    return img;
  }

  console.log('[apng] fetch start');
  let response = await fetch(url);
  console.log('[apng] fetch end');

  if (response.ok) {

    console.log('[apng] arrayBuffer start');
    let array = await response.arrayBuffer();
    console.log('[apng] arrayBuffer end');
    img = parseAPNG(array);

    console.log(`${img.width}px`);
    console.log(`${img.height}px`);

    await img.createImages();
    console.log(img);
    cache[url] = img;
    return img;

  } else {
    return null;
  }
}


export async function createPlayer (image) {

  let canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  let context = canvas.getContext('2d');

  let group = new PIXI.Container();

  let current = new PIXI.Sprite(PIXI.Texture.EMPTY);
  group.current = current;
  group.addChild(current);
  group.speed = 0.001;
  group.index = 0;
  group.image = image;
  group.isPlay = false;
  group.loop = false;

  let game = app.game;
  let frames = image.frames;

  let _currentFrameNumber = -1;
  let _prevFrame = null;
  let _prevFrameData = null;
  let currentFrame = null;

  let teTest = null;

  function renderNextFrame () {
    _currentFrameNumber = (_currentFrameNumber + 1) % frames.length;
    currentFrame = frames[_currentFrameNumber];

    if (_prevFrame && _prevFrame.disposeOp === 1) {
      context.clearRect(_prevFrame.left, _prevFrame.top, _prevFrame.width, _prevFrame.height);
    } else if (_prevFrame && _prevFrame.disposeOp === 2) {
      context.putImageData(_prevFrameData, _prevFrame.left, _prevFrame.top);
    }

    const frame = currentFrame;
    _prevFrame = frame;
    _prevFrameData = null;
    if (frame.disposeOp === 2) {
      _prevFrameData = context.getImageData(frame.left, frame.top, frame.width, frame.height);
    }
    if (frame.blendOp === 0) {
      context.clearRect(frame.left, frame.top, frame.width, frame.height);
    }

    context.drawImage(frame.imageElement, frame.left, frame.top);

    let img = context.getImageData(0, 0, image.width, image.height);

    if (!teTest) {
      teTest = PIXI.Texture.fromBuffer(img.data, image.width, image.height);
      current.texture = teTest;
    } else {
      teTest.baseTexture.resource.data = img.data;
      teTest.baseTexture.update();
    }
  }
  async function play (idx) {
    if (group.isPlay) {
      console.log('[png.play] 播放中');
      return;
    }
    group.isPlay = true;
    if (typeof idx === 'number') {
      group.index = idx;
    }

    console.log(`[png.play] index : ${group.index}`);

    for (let i = group.index; i < frames.length; i++) {
      if (group.isPause) {
        group.isPause = false;
        group.isPlay = false;
        console.log('[png.pause] index', group.index);
        group.pauseResolve();
        group.pauseResolve = null;
        return;
      }
      renderNextFrame();

      let f = frames[i];

      await game.idle(f.delay * group.speed);

      group.index = i;
    }
    group.index = 0;
    if (group.loop) {
      console.log('[png]loop:', group.loop);
      group.isPlay = false;
      if (typeof group.loop === 'number') {
        if (group.loop > 0) {
          group.loop--;
          await play();
          return;
        }
      } else {
        await play();
        return;
      }
    }
    group.isPlay = false;
    group.isPause = false;
    group.pauseResolve = null;
  }

  async function pause () {
    if (!group.isPlay) {
      return;
    }
    return new Promise((resolve) => {
      group.pauseResolve = resolve;
      group.isPause = true;
    });
  }

  async function stop () {
    await pause();
    group.index = 0;
    group.isPlay = false;
    group.isPause = false;
    group.pauseResolve = null;

    renderNextFrame();

  }

  stop();


  group.play = play;
  group.pause = pause;
  group.stop = stop;

  return group;
}



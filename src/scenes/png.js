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


let playerName = 0;

export async function createPlayer (image, name) {

  if (!name) {
    name = playerName;
    playerName++;
  }
  console.log('[png.createPlayer]', name);

  let canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  let context = canvas.getContext('2d');

  let group = new PIXI.Container();

  let current = new PIXI.Sprite(PIXI.Texture.EMPTY);

  let game = app.game;
  let frames = image.frames;
  let frameCnts = frames.length;
  let currentFrameNumber = -1;
  let prevFrame = null;
  let prevFrameData = null;
  let currentFrame = null;

  group.name = name;
  group.current = current;
  group.addChild(current);
  group.speed = 1.0;
  group.index = frameCnts - 1;
  group.image = image;
  group.isPlay = false;
  group.loop = false;
  group.playResolve = null;
  group.currentTime = 0;

  let teTest = null;

  function renderNextFrame () {
    currentFrameNumber = (currentFrameNumber + 1) % frameCnts;
    currentFrame = frames[currentFrameNumber];

    if (prevFrame && prevFrame.disposeOp === 1) {
      context.clearRect(prevFrame.left, prevFrame.top, prevFrame.width, prevFrame.height);
    } else if (prevFrame && prevFrame.disposeOp === 2) {
      context.putImageData(prevFrameData, prevFrame.left, prevFrame.top);
    }

    const frame = currentFrame;
    prevFrame = frame;
    prevFrameData = null;
    if (frame.disposeOp === 2) {
      prevFrameData = context.getImageData(frame.left, frame.top, frame.width, frame.height);
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

  function update (offsetTime) {

    // console.log(`[png.update] offsetTime ${offsetTime} ${group.name}`);

    if (group.isPause) {
      return;
    }

    if (currentFrame) {
      let time = parseInt(currentFrame.delay);

      group.currentTime += parseInt((offsetTime + 0.001) * group.speed * 1000);
      if (group.currentTime < time) {
        return;
      }

      // console.log(`[png.update] time ${group.currentTime} delay ${currentFrame.delay * group.speed} ${group.name}`);
      group.currentTime = group.currentTime - time;
    }

    // if (currentFrameNumber === 0) {
    //   console.log(`[png.update] play ${group.name}`);
    // }

    renderNextFrame();

    if (group.index === currentFrameNumber) {
      if (!group.loop) {
        console.log(`[png.update] event index ${group.index}`);
        group.stop(false);
        if (group.playResolve) {
          group.playResolve();
          group.playResolve = null;
        }
      }
    }

    if (currentFrameNumber === frameCnts - 1) {

      // console.log(`[png.update] stop ${group.name}`);


      if (group.loop) {
        if (typeof group.loop === 'number') {
          group.loop--;
          if (group.loop <= 0) {
            group.loop = 0;
            group.stop(false);
          }
        }
      } else {
        group.stop(false);
      }
    }
  }


  /**
   * 播放
   * @param {number} idx
   * @returns
   */
  async function play (idx) {
    if (group.isPlay) {
      console.log(`[png.play] 播放中 ${group.name}`);
      return;
    }
    group.isPause = false;
    group.isPlay = true;
    group.currentTime = 0.0;
    group.index = frameCnts - 1;
    game.addUpdate(group);

    if (typeof idx === 'number') {
      group.index = idx;
    }

    console.log(`[png.play] ${group.name}`);

    let promise = new Promise((resolve) => {
      group.playResolve = resolve;
    });

    return promise;
  }

  /**
   * 暫停
   */
  async function pause () {
    if (!group.isPlay) {
      return;
    }
    console.log('[png.pause] ', group.name);
    group.isPause = true;
    group.isPlay = false;
  }

  /**
   * 停止
   */
  async function stop (reset = true) {
    console.log('[png.stop] ', group.name);

    group.isPlay = false;
    group.isPause = false;
    game.removeUpdate(group);

    if (reset) {
      group.index = frameCnts - 1;
      currentFrameNumber = -1;
      renderNextFrame();
    }
  }


  stop();

  group.play = play;
  group.pause = pause;
  group.stop = stop;
  group.update = update;

  return group;
}



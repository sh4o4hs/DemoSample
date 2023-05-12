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

  let group = new PIXI.Container();

  let current = new PIXI.Sprite(PIXI.Texture.EMPTY);
  let prev = new PIXI.Sprite(PIXI.Texture.EMPTY);
  group.current = current;
  group.prev = prev;
  group.addChild(current);
  group.addChild(prev);
  group.speed = 0.001;
  group.index = 0;
  group.image = image;
  group.isPlay = false;

  let game = app.game;
  let frames = image.frames;

  let f = frames[0];

  if (!f.texture) {
    console.log(`[png.texture] index : ${0}`, f);
    f.texture = PIXI.Texture.from(f.imageElement);
  }
  current.x = f.left;
  current.y = f.top;
  current.texture = f.texture;

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
      let f = frames[i];
      if (!f.texture) {
        console.log(`[png.texture] index : ${i}`, f);
        f.texture = PIXI.Texture.from(f.imageElement);
      }

      // if (f.disposeOp === 1) {
      //   prev.texture = PIXI.Texture.EMPTY;
      // } else if (f.disposeOp === 2) {
      //   prev.texture = f.texture;
      //   prev.x = f.left;
      //   prev.y = f.top;
      // }


      // if (f.blendOp === 1) {
      //   prev.texture = f.texture;
      //   prev.x = f.left;
      //   prev.y = f.top;
      //   prev.blendMode = PIXI.BLEND_MODES.ERASE;

      // } else {
      //   prev.blendMode = PIXI.BLEND_MODES.NORMAL;
      //   current.texture = f.texture;
      //   current.x = f.left;
      //   current.y = f.top;
      // }

      current.texture = f.texture;
      current.x = f.left;
      current.y = f.top;

      await game.idle(f.delay * group.speed);

      group.index = i;
    }
    group.index = 0;
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

    let f = frames[0];
    prev.texture = PIXI.Texture.EMPTY;

    current.x = f.left;
    current.y = f.top;
    current.texture = f.texture;

  }


  group.play = play;
  group.pause = pause;
  group.stop = stop;

  return group;
}



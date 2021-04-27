import app from 'entity/app';


export async function getPlayer () {
  let game = app.game;
  let obj = await game.getProject('video/player');

  return obj.lib.pixiStreaming;
}

// 初始值
let Streaming = null;
let startvideo = false;
let videoUrls = null;
let sources = null;
let tableIndex = -1;
let streamingList = [];

// 測試用
let isTest = false;
let testList = null;

export async function init (config) {

  if (!config.id) {
    console.error('video 未指定 id');
    return false;
  }
  tableIndex = 0;
  if (app.tableInfo && app.tableInfo.tableKey) {
    let str = app.tableInfo.tableKey;
    tableIndex = Number(str.slice(-1)) - 1;
  }

  if (!Streaming) {
    Streaming = await getPlayer();
  }

  if (!sources) {
    if (isTest) {
      sources = {};
      let list = [
        [
          'wss://pc-18084.streamingvds.com/'
        ],
        [
          'wss://pc-24084.streamingvds.com/'
        ]
      ];
      sources.list = list;

      let videoList = [
        {  // 服務線路
          id: 'streamingvds-M',

          // 視訊清單
          tables: [
            'wss://pc-18084.streamingvds.com/'
          ]
        }
      ];
      sources.videoList = videoList;

    } else {
      let obj = await app.game.getProject('video/domains');
      let lib = obj.lib;
      sources = await lib.getVideoSource(config.id);
    }
  }

  testList = sources.videoList;
  videoUrls = sources.list[tableIndex];
  if (!Array.isArray(videoUrls)) {
    console.error('視訊清單錯誤');
    return false;
  }
  console.log('sources : ', sources);

  return true;
}


export function test () {

  if (startvideo || !testList) {
    return;
  }
  startvideo = true;

  app.game.scanLCS(testList).then(result => {
    console.log(result);
  });
}

export async function open (channel, options) {

  // 確認設定值
  if (!options) {
    options = {};
  }
  options.videoBufferSize = 256 * 1024;  // 影像緩衝容量
  options.audioBufferSize = 32 * 1024;   // 語音緩衝容量
  options.audio = true;                  // 是否使用語音
  options.fps = options.fps || 50;       // 設定畫面更新率

  let url = videoUrls[channel];
  if (!url) {
    console.error('沒指定視訊頻道');
  }
  console.log('channel:', channel);
  console.log('open:', url);

  await close(channel);

  let streaming = new Streaming(app.game);
  streamingList[channel] = streaming;


  let isError = true;
  app.game.setTimeout(() => {
    if (isError) {
      console.error('無法連線');
      return PIXI.Texture.EMPTY;
    }
  }, 6);

  let texture = await streaming.play(url, options);
  isError = false;

  return texture;
}


export async function close (channel) {

  let streaming = streamingList[channel];
  if (!streaming) {
    return;
  }

  await streaming.stop();
  streamingList[channel] = null;
}

export async function closeAll () {

  let cnts = streamingList.length;
  for (let ch = 0; ch < cnts; ch++) {
    close(ch);
  }
}

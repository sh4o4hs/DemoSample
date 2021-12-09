import * as message from 'demo/demo';

let logger$5 = null;
let CustomFormat$5 = null;
function init$5(config) {
  logger$5 = config.logger;
  CustomFormat$5 = config.CustomFormat;
}


// function decode(packet) {
//   let obj = null;
//   let Game = message.Game;
//   if(packet.format === CustomFormat.PROTOBUF) {
//     let check = Game.CheckAction.decode(packet.data);
//     if(check.actionType === Game.ActionType.BET) {
//       let value = Game.BetRequest.decode(packet.data);
//       obj = Game.BetRequest.toObject(value, {
//         defaults: true,
//         arrays: false,
//         objects: false,
//         oneofs: false
//       });
//     }
//   }

//   logger.info('輸入');
//   console.log(obj);
//   return obj;
// }

/**
 * 產生結果
 * @param input 輸入資訊
 */
function generate$5(input) {
  let packet = {};
  let Game = message.Game;

  // decode(input);

  try {
    // 結果
    let data = {
      actionType: Game.ActionType.CREATE_RESPONSE,
      betCoin: 0,
      betForm: [300,500,1000,1500,2500,5000,10000,25000,50000,100000],
      betFormAmount: 10,
      cmdResult: 0,
      credit: message.randInt(100, 10000000)
    };
    logger$5.info('建立遊戲');
    console.log(data);

    let Response = Game.CreateResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.format = CustomFormat$5.PROTOBUF;
    packet.data = buf;
  } catch (err) {
    console.error(err);
  }

  try {
    // 遊戲資訊
    let Command = Game.Info;
    let data = {
      actionType: Command.ActionType.NORMAL,
      aPIVersion: '1',
      chanceVersion: '2',
      libVersion: '3',
      packageVersion: '4',
      slotServerVersion: '5'
    };
    logger$5.info('遊戲資訊');
    console.log(data);

    let Response = Command.BaseResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.info = {
      format: CustomFormat$5.PROTOBUF,
      data: buf
    };
  } catch (err) {
    console.error(err);
  }


  try {
    // 遊戲設定
    let Command = Game.Setting;
    let data = {
      actionType: Command.ActionType.NORMAL,
      betForm: [500,1000,2000,2500,5000,10000,12500,25000,50000,100000,125000,250000,500000],
      betFormIndex: 4,
      decimalPosition: 5,
      enableJP: false,
      isDemo: false,
      lastBet: 5000,
      lineAmount: 0
    };
    logger$5.info('遊戲設定');
    console.log(data);

    let Response = Command.BaseResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.setting = {
      format: CustomFormat$5.PROTOBUF,
      data: buf
    };
  } catch (err) {
    console.error(err);
  }  

  // 設定錯誤訊息
  // packet.errorCode = 'error message : zzzz';
  // 測試


  return packet;
}

var create$1 = {
  init: init$5,
  generate: generate$5
};

let logger$4 = null;
let CustomFormat$4 = null;
function init$4(config) {
  logger$4 = config.logger;
  CustomFormat$4 = config.CustomFormat;
}

function decode$3(packet) {
  let Game = message.Game;
  let obj = null;

  if(packet.format === CustomFormat$4.PROTOBUF) {
    let check = Game.CheckAction.decode(packet.data);
    if(check.actionType === Game.ActionType.BET) {
      let value = Game.BetRequest.decode(packet.data);
      obj = Game.BetRequest.toObject(value, {
        defaults: true,
        arrays: false,
        objects: false,
        oneofs: false
      });
    }
  }

  logger$4.info('輸入');
  console.log(obj);
  return obj;
}

/**
 * 產生結果
 * @param input 輸入資訊
 */
function generate$4(input) {
  let packet = {};
  let Game = message.Game;

  let obj = decode$3(input);

  try {
    // 遊戲結果
    let data = {
      actionType: Game.ActionType.RESULT,
      bet: obj.bet,
      score: 0,
      a: 999,
      state: 'lost'
    };
    logger$4.info('遊戲結果');
    console.log(data);

    let Response = Game.ResultResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.format = CustomFormat$4.PROTOBUF;
    packet.data = buf;
  } catch (err) {
    console.error(err);
  }

  return packet;
}

var lost$1 = {
  init: init$4,
  generate: generate$4
};

let logger$3 = null;
let CustomFormat$3 = null;
function init$3(config) {
  logger$3 = config.logger;
  CustomFormat$3 = config.CustomFormat;
}

function decode$2(packet) {
  let Game = message.Game;
  let obj = null;

  if(packet.format === CustomFormat$3.PROTOBUF) {
    let check = Game.CheckAction.decode(packet.data);
    if(check.actionType === Game.ActionType.BET) {
      let value = Game.BetRequest.decode(packet.data);
      obj = Game.BetRequest.toObject(value, {
        defaults: true,
        arrays: false,
        objects: false,
        oneofs: false
      });
    }
  }

  logger$3.info('輸入');
  console.log(obj);
  return obj;
}

/**
 * 產生結果
 * @param input 輸入資訊
 */
function generate$3(input) {
  let packet = {};
  let Game = message.Game;

  let obj = decode$2(input);

  try {
    // 遊戲資料
    let data = {
      actionType: Game.ActionType.RESULT,
      bet: obj.bet,
      score: message.randInt(50, 498),
      b: 'pppp',
      state: 'win'
    };
    logger$3.info('遊戲結果');
    console.log(data);
    
    let Response = Game.ResultResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.format = CustomFormat$3.PROTOBUF;
    packet.data = buf;
  } catch (err) {
    console.error(err);
  }

  return packet;
}

var win$1 = {
  init: init$3,
  generate: generate$3
};

var normal = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$1,
  lost: lost$1,
  win: win$1
});

let logger$2 = null;
let CustomFormat$2 = null;
function init$2(config) {
  logger$2 = config.logger;
  CustomFormat$2 = config.CustomFormat;
}

// function decode(packet) {
//   let obj = null;
//   let Game = message.Game;
//   if(packet.format === CustomFormat.PROTOBUF) {
//     let check = Game.CheckAction.decode(packet.data);
//     if(check.actionType === Game.ActionType.BET) {
//       let value = Game.BetRequest.decode(packet.data);
//       obj = Game.BetRequest.toObject(value, {
//         defaults: true,
//         arrays: false,
//         objects: false,
//         oneofs: false
//       });
//     }
//   }

//   logger.info('輸入');
//   console.log(obj);
//   return obj;
// }

/**
 * 產生結果
 * @param input 輸入資訊
 */
function generate$2(input) {
  let packet = {};
  let Game = message.Game;

//  decode(input);

  try {
    // 建立遊戲
    let data = {
      actionType: Game.ActionType.CREATE_RESPONSE,
      betCoin: 0,
      betForm: [300,500,1000,1500,2500,5000,10000,25000,50000,100000],
      betFormAmount: 10,
      cmdResult: 0,
      credit: message.randInt(100, 10000000)
    };
    logger$2.info('建立遊戲');
    console.log(data);

    let Response = Game.CreateResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.format = CustomFormat$2.PROTOBUF;
    packet.data = buf;
  } catch (err) {
    console.error(err);
  }

  try {
    // 遊戲資訊
    let Command = Game.Info;
    let data = {
      actionType: Command.ActionType.NORMAL,
      aPIVersion: '1',
      chanceVersion: '2',
      libVersion: '3',
      packageVersion: '4',
      slotServerVersion: '5'
    };
    logger$2.info('遊戲資訊');
    console.log(data);

    let Response = Command.BaseResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.info = {
      format: CustomFormat$2.PROTOBUF,
      data: buf
    };
  } catch (err) {
    console.error(err);
  }

  try {
    // 遊戲設定
    let Command = Game.Setting;
    let data = {
      actionType: Command.ActionType.NORMAL,
      betForm: [500,1000,2000,2500,5000,10000,12500,25000,50000,100000,125000,250000,500000],
      betFormIndex: 4,
      decimalPosition: 5,
      enableJP: false,
      isDemo: false,
      lastBet: 5000,
      lineAmount: 0
    };
    logger$2.info('遊戲設定');
    console.log(data);

    let Response = Command.BaseResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.setting = {
      format: CustomFormat$2.PROTOBUF,
      data: buf
    };
  } catch (err) {
    console.error(err);
  }

  try {
    // JP 資訊
    let Command = Game.Jackpot;
    let data = {
      actionType: Command.ActionType.NORMAL,
      mJpOutIdx: message.randInt(0, 30),
      mJpOutValue: message.randInt(2, 8),
      mJpValue: [15652692963,2294455271,83607676,13329065,5014439,1430232,1797476],
      resultCode: 1
    };
    logger$2.info('JP 資訊');
    console.log(data);

    let Response = Command.BaseResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.jackpot = {
      format: CustomFormat$2.PROTOBUF,
      data: buf
    };  
  } catch (err) {
    console.error(err);
  }

  return packet;
}

var create = {
  init: init$2,
  generate: generate$2
};

let logger$1 = null;
let CustomFormat$1 = null;
function init$1(config) {
  logger$1 = config.logger;
  CustomFormat$1 = config.CustomFormat;
}

function decode$1(packet) {
  let obj = null;
  let Game = message.Game;
  if(packet.format === CustomFormat$1.PROTOBUF) {
    let check = Game.CheckAction.decode(packet.data);
    if(check.actionType === Game.ActionType.BET) {
      let value = Game.BetRequest.decode(packet.data);
      obj = Game.BetRequest.toObject(value, {
        defaults: true,
        arrays: false,
        objects: false,
        oneofs: false
      });
    }
  }

  logger$1.info('輸入');
  console.log(obj);
  return obj;
}


/**
 * 產生結果
 * @param input 輸入資訊
 */
function generate$1(input) {
  let packet = {};
  let Game = message.Game;

  let obj = decode$1(input);

  try {
    // 遊戲結果
    let data = {
      actionType: Game.ActionType.RESULT,
      bet: obj.bet,
      score: 0,
      state: 'lost'
    };
    logger$1.info('遊戲結果');
    console.log(data);

    let Response = Game.ResultResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.format = CustomFormat$1.PROTOBUF;
    packet.data = buf;
  } catch (err) {
    console.error(err);
  }

  try {
    // JP 資訊
    let Command = Game.Jackpot;
    let data = {
      actionType: Command.ActionType.NORMAL,
      mJpOutIdx: message.randInt(10, 300),
      mJpOutValue: message.randInt(20, 80),
      mJpValue: [15652692963,2294455271,83607676,13329065,5014439,1430232,1797476],
      resultCode: 2
    };
    logger$1.info('JP 資訊');
    console.log(data);

    let Response = Command.BaseResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.jackpot = {
      format: CustomFormat$1.PROTOBUF,
      data: buf
    };
  } catch (err) {
    console.error(err);
  }  

  return packet;
}

var lost = {
  init: init$1,
  generate: generate$1
};

let logger = null;
let CustomFormat = null;
function init(config) {
  logger = config.logger;
  CustomFormat = config.CustomFormat;
}

function decode(packet) {
  let obj = null;
  let Game = message.Game;
  if(packet.format === CustomFormat.PROTOBUF) {
    let check = Game.CheckAction.decode(packet.data);
    if(check.actionType === Game.ActionType.BET) {
      let value = Game.BetRequest.decode(packet.data);
      obj = Game.BetRequest.toObject(value, {
        defaults: true,
        arrays: false,
        objects: false,
        oneofs: false
      });
    }
  }

  logger.info('輸入');
  console.log(obj);
  return obj;
}

/**
 * 產生結果
 * @param input 輸入資訊
 */
function generate(input) {
  let packet = {};
  let Game = message.Game;

  let obj = decode(input);

  try {
    // 遊戲結果
    let data = {
      actionType: Game.ActionType.RESULT,
      bet: obj.bet,
      score: message.randInt(100, 500000),
      state: 'win'
    };
    logger.info('遊戲結果');
    console.log(data);

    let Response = Game.ResultResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.format = CustomFormat.PROTOBUF;
    packet.data = buf;
  } catch (err) {
    console.error(err);
  }

  try {
    // JP 資訊
    let Command = Game.Jackpot;
    let data = {
      actionType: Command.ActionType.NORMAL,
      mJpOutIdx: message.randInt(100, 3000),
      mJpOutValue: message.randInt(200, 800),
      mJpValue: [15652692963,2294455271,83607676,13329065,5014439,1430232,1797476],
      resultCode: 0
    };
    logger.info('JP 資訊');
    console.log(data);

    let Response = Command.BaseResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.jackpot = {
      format: CustomFormat.PROTOBUF,
      data: buf
    };
  } catch (err) {
    console.error(err);
  }
  
  return packet;
}

var win = {
  init,
  generate
};

var jp = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create,
  lost: lost,
  win: win
});

// import * as normal from 'demo/v1/normal/**/*.ts';


var input = {
  normal,
  jp
};

export { input as default };

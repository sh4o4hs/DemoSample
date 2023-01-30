/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */

import * as scene from 'src/scene';

import CodecParser from 'codec-parser';

const mimeType = 'audio/ogg';
const options = {
  onCodec: () => {},
  onCodecUpdate: () => {},
  enableLogging: true
};

const parser = new CodecParser(mimeType, options);
console.log(parser);

export {
  scene
};

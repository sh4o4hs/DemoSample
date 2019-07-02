
import data from 'res/sub/base.config.yml';
import spine from 'res/sub/base.spineList.yml';
import object from 'res/sub/base.objectList.yml';

import teEn from 'res/sub/en-us.textureList.yml';
import teTw from 'res/sub/zh-tw.textureList.yml';
import teCn from 'res/sub/zh-cn.textureList.yml';

let resource = {
  'en-us': {
    data,
    texture: teEn,
    spine,
    object
  },
  'zh-tw': {
    data,
    texture: teTw,
    spine,
    object
  },
  'zh-cn': {
    data,
    texture: teCn,
    spine,
    object
  }
};

export default resource;

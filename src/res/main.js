
import data from 'res/main/config.yml';
import sound from 'res/main/base.soundList.yml';
import spine from 'res/main/base.spineList.yml';
import object from 'res/main/objectList.yml';

import teEn from 'res/main/en.textureList.yml';
import teTw from 'res/main/zh-tw.textureList.yml';
import teCn from 'res/main/zh-cn.textureList.yml';

let resource = {
  en: {
    data,
    sound,
    texture: teEn,
    spine,
    object
  },
  'zh-tw': {
    data,
    sound,
    texture: teTw,
    spine,
    object
  },
  'zh-cn': {
    data,
    sound,
    texture: teCn,
    spine,
    object
  }
};

export default resource;


import en from 'language/en-us.ts';
import tw from 'language/zh-tw.ts';
import cn from 'language/zh-cn.ts';

/**
 * 語言代碼
 * @type {{EN_US: string, ZH_TW: string, ZH_CN: string}}
 */
export const ID = {
  EN_US: 'en-us',
  ZH_TW: 'zh-tw',
  ZH_CN: 'zh-cn'
};

let lang = en;
let currentID = ID.EN_US;
export function get (name) {
  'use strict';
  let str = lang[name];
  if (!str) {
    str = 'no found !';
  }

  return str;
}

/**
 * 設定語言
 * @param {string} id 語言代碼
 * @returns {void}
 */
export function setLanguage (id) {
  currentID = id;
  switch (id) {
    case ID.EN_US:
      lang = en;
      break;
    case ID.ZH_TW:
      lang = tw;
      break;
    case ID.ZH_CN:
      lang = cn;
      break;
    default:
      lang = en;
      currentID = ID.EN_US;
  }
}

/**
 * 取得目前語言代碼
 * @return {*} 傳回語言代碼
 */
export function getID () {
  return currentID;
}

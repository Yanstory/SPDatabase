import MD5 from 'md5';

import { TORAPPU_ENDPOINT, MEDIA_ENDPOINT } from './const.js';

export function getImagePath(filename) {
  const md5 = MD5(filename);
  return `${MEDIA_ENDPOINT}/${md5.slice(0, 1)}/${md5.slice(0, 2)}/${filename}`;
}

export const PROFESSTION_MAP = {
  PIONEER: '先锋',
  WARRIOR: '近卫',
  SNIPER: '狙击',
  SUPPORT: '辅助',
  CASTER: '术师',
  SPECIAL: '特种',
  MEDIC: '医疗',
  TANK: '重装',
};

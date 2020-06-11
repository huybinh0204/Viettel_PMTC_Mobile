import AsyncStorage from '@react-native-community/async-storage';

const KEY = {
  LAST_TIME_SHOW_RATING_DIALOG: 'LAST_TIME_SHOW_RATING_DIALOG',
  CAN_SHOW_RATING_DIALOG: 'CAN_SHOW_RATING_DIALOG',
  LANG_CODE: 'LANG_CODE',
  LANGUAGE: 'LANGUAGE',
  REMEMBER_PASSWORD: 'REMEMBER_PASSWORD',
  INIT_STORGE: '@ACCOUNT',
  STRING_TEST: 'STRING_TEST',
  SAVE_TOKEN_NOTI: '@SAVE_TOKEN_NOTI',
  FCM_TOKEN: '@FCM_TOKEN'
};
/**
 *
 * @param {string} key Using KEY.key to save data
 * @param {string} value data to save
 */
function save(key, value) {
  AsyncStorage.setItem(key, value);
}

/**
 *
 * @param {string} key Using KEY.key to get data from ROM
 */
async function get(key) {
  return AsyncStorage.getItem(key);
}

/**
 *
 * @param {string} key Using Key.key to delete saved data
 */
async function remove(key) {
  return AsyncStorage.removeItem(key)
}

/**
 *
 * @param {array} keys Using array key to delete multiple saved data
 */
async function multiRemove(keys) {
  return AsyncStorage.multiRemove(keys)
}
/**
 *
 * @param {string[][]} keyValuePairs multiSave and multiMerge take arrays of key-value array pairs that match the output of multiGet,
 */
async function multiSave(keyValuePairs) {
  AsyncStorage.multiSet(keyValuePairs)
}
/**
 *
 * @param {string[][]} keys array to multi get saved data
 * @callback {function} func To listen handle after multiget
 */
async function multiGet(keys, func) {
  return AsyncStorage.multiGet(keys, func)
}

export default {
  save,
  get,
  remove,
  KEY,
  multiGet,
  multiSave,
  multiRemove
};

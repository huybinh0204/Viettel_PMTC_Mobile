import * as TYPE from './actionTypes';

export function searchKeyword(body, tabActive) {
  return {
    type: TYPE.SEARCH_IN_TAB_DETAIL_INFO,
    body,
    tabActive
  }
}

export function coVoffice(bool, id) {
  return {
    type: TYPE.C0_VOFFICE,
    bool,
    id
  }
}

export function initDeparment(body) {
  return {
    type: TYPE.INIT_DEPARTMENT_ID,
    body,
  }
}

export function updateAdvanceRequestId(body) {
  return {
    type: TYPE.UPDATE_ADVANCE_REQUEST_ID,
    body,
  }
}

export function saveBeforeExit(body) {
  return {
    type: TYPE.CHECK_SAVE_BEFORE_EXIT,
    body,
  }
}

export function uploadFileAttackSuccess(body) {
  return {
    type: TYPE.UPLOAD_FILE_ATTACK_SUCCESS,
    body
  }
}

export function disableEdit(body) {
  return {
    type: TYPE.DISABLE_EDIT,
    body,
  }
}

export function updateListAdvanceRequest(body) {
  return {
    type: TYPE.RELOAD_UPDATE_LIST_ADVANCE_REQUEST,
    body,
  }
}

export function actionInputSearch(body) {
  return {
    type: TYPE.ACTION_INPUT_SEARCH,
    body,
  }
}

export function updateRequestAmount(body) {
  return {
    type: TYPE.UPDATE_REQUEST_AMOUNT,
    body,
  }
}

export function filterAdvanceRequest(body, tabActive) {
  return {
    type: TYPE.FILTER_ADVANCE_REQUEST,
    body,
    tabActive,
  }
}

export function showAllField(body) {
  return {
    type: TYPE.SHOW_ALL_FIELD,
    body,
  }
}

export function updateIconEye(body) {
  return {
    type: TYPE.UPDATE_ICON_EYE,
    body,
  }
}

export function createGeneralInfo(body) {
  return {
    type: TYPE.CREATE_GENERAL_INFO,
    body
  }
}

export function updateGeneralInfo(body) {
  return {
    type: TYPE.UPDATE_GENERAL_INFO,
    body
  }
}

export function onPressMenu(body) {
  return {
    type: TYPE.ON_PRESS_MENU,
    body
  }
}

export function setTabActive(body) {
  return {
    type: TYPE.SET_TAB_ACTIVE,
    body
  }
}

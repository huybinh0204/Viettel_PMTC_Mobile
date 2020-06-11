import {
  FETCH_LIST_STATEMENT_LINE,
  SET_STATEMENT_ID,
  RESET_STATEMENT_ID
} from './actionTypes';
import * as TYPE from './actionTypes';

// voffice
export function setFilterVOffice(data) {
  return {
    type: TYPE.SET_FILTER_VOFFICE,
    payload: data
  };
}

export function setStatementID(id) {
  return {
    type: SET_STATEMENT_ID,
    payload: id
  };
}
export function setStatementLineID(id) {
  return {
    type: TYPE.SET_STATEMENT_LINE_ID,
    payload: id
  };
}
export function resetStatementID(id) {
  return {
    type: RESET_STATEMENT_ID,
    payload: id
  };
}
export function fetchListStatementLine(data) {
  return {
    type: FETCH_LIST_STATEMENT_LINE,
    payload: data
  };
}
// status menu
export function setStatusMenu(data) {
  return {
    type: TYPE.SET_STATUS_MENU_STATEMENT,
    payload: data
  };
}

export function setKeySearchStatementLine(data) {
  return {
    type: TYPE.SET_KEY_SEARCH_TEXT_STATEMENT_LINE,
    payload: data
  };
}

export function setDataStatementLine(data) {
  return {
    type: TYPE.SET_DATA_STATEMENT_LINE,
    payload: data
  };
}
export function resetDataStatementLine() {
  return {
    type: TYPE.RESET_DATA_STATEMENT_LINE,
    payload: {}
  };
}

export function setTypeOfIconStatementLine(index) {
  return {
    type: TYPE.SET_TYPE_OF_ICON_STATEMENT_LINE,
    payload: index
  };
}

export function uploadFileAttackStatement(body) {
  return {
    type: TYPE.UPLOAD_FILE_ATTACK_STATEMENT_SUCCESS,
    body
  };
}

export function setTypeOfIconAttackInfo(index) {
  return {
    type: TYPE.SET_TYPE_OF_ICON_ATTACK_INFO,
    payload: index
  };
}

export function setTypeOfIconPayment(index) {
  console.log('export function setTypeOfIconPayment', index);
  return {
    type: TYPE.SET_TYPE_OF_ICON_PAYMENT_INFO,
    payload: index
  };
}

export function setIsHideGroupStatement(data) {
  return {
    type: TYPE.SET_IS_HIDE_GROUPS_STATEMENT,
    payload: data
  };
}

export function setStatusCOStatement(data) {
  return {
    type: TYPE.SET_STATUS_STATEMENT_STATEMENT,
    payload: data
  };
}

export function setStatusStatement(data) {
  return {
    type: TYPE.SET_STATUS_STATEMENT_CHIL_STATEMENT,
    payload: data
  };
}

export function setTermPayment(data) {
  return {
    type: TYPE.SET_TERM_PAYMENT,
    payload: data
  };
}
// work unit
export function fetchWorkUnit(data) {
  return {
    type: TYPE.FETCH_WORK_UNIT,
    payload: data
  };
}
export function setWorkUnit(data) {
  return {
    type: TYPE.SET_WORK_UNIT,
    payload: data
  };
}
// working market
export function fetchCurrencyList(data) {
  return {
    type: TYPE.FETCH_CURRENCY_LIST,
    payload: data
  };
}

import { FETCH_LIST_INVOICE, SET_LIST_INVOICE } from './actionTypes';
import * as TYPE from './actionTypes'

export function fetchListInvoice(body, checkData) {
  return {
    type: FETCH_LIST_INVOICE,
    payload: body,
    checkData
  }
}
export function setListInvoice(data) {
  return {
    type: SET_LIST_INVOICE,
    payload: data,
  }
}
// term payment
export function fetchTermPayment(data) {
  return {
    type: TYPE.FETCH_TERM_PAYMENT,
    payload: data,
  }
}
export function setTermPayment(data) {
  return {
    type: TYPE.SET_TERM_PAYMENT,
    payload: data,
  }
}
// work unit
export function fetchWorkUnit(data) {
  return {
    type: TYPE.FETCH_WORK_UNIT,
    payload: data,
  }
}
export function setWorkUnit(data) {
  return {
    type: TYPE.SET_WORK_UNIT,
    payload: data,
  }
}
// working market
export function fetchCurrencyList(data) {
  return {
    type: TYPE.FETCH_CURRENCY_LIST,
    payload: data,
  }
}
export function fetchListChanel(data) {
  return {
    type: TYPE.FETCH_LIST_CHANEL,
    payload: data,
  }
}
export function setTypeOfIcon(index) {
  return {
    type: TYPE.SET_TYPE_OF_ICON,
    payload: index,
  }
}
export function fetchListTypeTax(data) {
  return {
    type: TYPE.FETCH_LIST_TYPE_TAX,
    payload: data,
  }
}

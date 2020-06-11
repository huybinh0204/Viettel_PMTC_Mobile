import * as TYPE from './actionTypes';

export function fetchListInvoiceGroup(body, checkData) {
  return {
    type: TYPE.FETCH_LIST_INVOICE_GROUP,
    payload: body,
    checkData
  }
}
export function setListInvoiceGroup(data) {
  return {
    type: TYPE.SET_LIST_INVOICE_GROUP,
    payload: data,
  }
}

export function updateListInvoiceGroup(body) {
  return {
    type: TYPE.RELOAD_UPDATE_LIST_INVOICE_GROUP,
    body,
  }
}

export function updateIconEye(body) {
  return {
    type: TYPE.UPDATE_ICON_EYE,
    body,
  }
}

export function updateInvoiceGroupItem(body) {
  return {
    type: TYPE.UPDATE_INVOICE_GROUP_ITEM,
    body,
  }
}

export function filterPayOfGroupInvoice(body, tabActive) {
  return {
    type: TYPE.FILTER_PAY_OF_GROUP_INVOICE,
    body,
    tabActive,
  }
}

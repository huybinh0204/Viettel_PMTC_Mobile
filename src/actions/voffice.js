import * as TYPE from './actionTypes'

// voffice
export function setFilterVOffice(data) {
  return {
    type: TYPE.SET_FILTER_VOFFICE,
    payload: data
  }
}
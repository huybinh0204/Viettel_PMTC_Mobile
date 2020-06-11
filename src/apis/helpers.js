/* eslint-disable no-return-await */
/**
 * helper.js - for storing reusable logic.
 * axios.defaults.headers.common.Authorization = `Bearer ${account.tokenLogin}`; to set TOKEN default
 */
import axios from 'axios';
import { popupOk } from '../config';
import { showAlert, TYPE } from 'common/DropdownAlert';

axios.defaults.timeout = 10000

/**
 *
 * @param {*} url is link api
 * @param {*} isAuth is state auth
 */
export async function GetData(url, data) {
  let myRequest = {
    method: 'get',
    url,
    params: {
      ...data,
    },
    withCredentials: true
  }
  return await axios(myRequest)
    .then(response => response)
    .then(response => response)
    .catch(error => {
      error
      // popupOk('Thông báo', error.response.data.error.message)
    });
}
/**
 *
 * @param {*} url is link api
 * @param {*} json is input format json to request server
 * @param {*} isAuth is state auth
 */
export async function PostData(url, json, isAuth = true) {
  let myRequest = {
    method: 'post',
    url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(json),
    withCredentials: true
  }
  return await axios(myRequest)
    .then(response => response)
    .then(response => response)
    .catch(error => {
      if (error.response.data.returnMessage) {
        showAlert(TYPE.ERROR, 'Thông báo', error.response.data.returnMessage)
      }
      error
      // popupOk('Thông báo', error.response.data.error.message)
    });
}
/**
 *
 * @param {*} url is link api
 * @param {*} json is input format json to request server
 * @param {*} isAuth is state auth
 */
export async function PutData(url, json, isAuth = true) {
  let myRequest = {
    method: 'put',
    url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(json),
    withCredentials: true
  }
  return await axios(myRequest)
    .then(response => response)
    .then(response => response)
    .catch(error => {
      error
      // popupOk('Thông báo', error.response.data.error.message)
    });
}
/**
 *
 * @param {*} url is link api
 * @param {*} isAuth is state auth
 */
export async function DelData(url, isAuth = true) {
  let myRequest = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
  return await axios.delete(url, myRequest)
    .then(response => response)
    .then(response => response)
    .catch(error => {
      error
      // popupOk('Thông báo', error.response.data.error.message)
    });
}

/**
 *
 * @param {*} url is link api
 * @param {*} json is input format json to request server
 * @param {*} isAuth is state auth
 */
export async function PostFormData(url, json, isAuth = true) {
  let myRequest = {
    method: 'post',
    url,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: json,
    withCredentials: true
  }
  return await axios(myRequest)
    .then(response => response)
    .then(response => response)
    .catch(error => {
      // error.response.data.statusCode
      popupOk('Thông báo', error.response.data.error.message)
    });
}
/**
 *
 * @param {*} url is link api
 * @param {*} json is input format json to request server
 * @param {*} isAuth is state auth
 */
export async function PutFormData(url, json, isAuth = true) {
  let myRequest = {
    method: 'put',
    url,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: json,
    withCredentials: true
  }
  return await axios(myRequest)
    .then(response => response)
    .then(response => response)
    .catch(error => {
      // error.response.data.statusCode
      popupOk('Thông báo', error.response.data.error.message)
    });
}

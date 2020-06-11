/* eslint-disable handle-callback-err */
import * as contants from '../constant'
import { PostData, GetData } from '../helpers'
import url from 'apis/url';

export const getUserInfor = () => GetData(contants.MY_INFO, {}, true).then(res => res).catch(err => null);
export const ApiChangePassword = async (body) => PostData(contants.CHANGE_PASSWORD, body).then(res => res).catch(err => null);
export const createSession = async (body) => PostData(url.CREATE_SESSION_REQUEST, body).then(res => res).catch(err => null);
export const createSessionMobile = async (body) => PostData(url.CREATE_SESSION_MOBILE_REQUEST, body).then(res => res).catch(err => null);
export const saveDeviceToken = async (body) => PostData(url.SAVE_DEVICE_TOKEN_REQUEST, body).then(res => res).catch(err => null);

export const getUser = id => (GetData(`${url.GET_USER_REQUEST}${id}`, {})
  .then(res => res)
  .catch(err => err)
);

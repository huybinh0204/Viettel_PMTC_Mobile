/* eslint-disable handle-callback-err */
import { PostData, GetData } from '../helpers'
import url from 'apis/url';

export const getNotificationListRequest = async (body) => PostData(url.GET_NOTIFICATION_LIST_REQUEST, body).then(res => res).catch(err => null);
export const readNotificationRequest = async (body) => PostData(url.READ_NOTIFICATION_REQUEST, body).then(res => res).catch(err => null);
export const getActionHistory = async (body) => GetData(url.GET_ACTION_HISTORY_REQUEST, body).then(res => res).catch(err => null);

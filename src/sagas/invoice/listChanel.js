import { put, call, takeEvery } from 'redux-saga/effects';
import _ from 'lodash';
import url from 'apis/url';
import { PostData } from '../../apis/helpers';
import * as Types from '../../actions/actionTypes'

const apiGetListChanelt = (body) => PostData(url.GET_LIST_CHANEL, body);

export function* fetchListChanelt(action) {
  try {
    const response = yield call(apiGetListChanelt, action.payload);
    if (_.has(response, 'data')) {
      yield put({ type: Types.FETCH_LIST_CHANEL_SUCCESS, payload: response.data });
    } else yield put({ type: Types.FETCH_LIST_CHANEL_FAIL, payload: { } });
  } catch {
    yield put({ type: Types.FETCH_LIST_CHANEL_FAIL, payload: { } });
  }
}

export function* watchFetchListChanel() {
  yield takeEvery(Types.FETCH_LIST_CHANEL, fetchListChanelt);
}

import { put, call, takeEvery } from 'redux-saga/effects';
import _ from 'lodash';
import url from 'apis/url';
import { PostData } from '../../apis/helpers';
import * as Types from '../../actions/actionTypes'

const apiGetLisTypeTaxt = (body) => PostData(url.GET_LIST_TYPE_TAX, body);

export function* fetchLisTypeTaxt(action) {
  try {
    const response = yield call(apiGetLisTypeTaxt, action.payload);
    if (_.has(response, 'data')) {
      yield put({ type: Types.FETCH_LIST_TYPE_TAX_SUCCESS, payload: response.data });
    } else yield put({ type: Types.FETCH_LIST_TYPE_TAX_FAIL, payload: { } });
  } catch {
    yield put({ type: Types.FETCH_LIST_TYPE_TAX_FAIL, payload: { } });
  }
}

export function* watchFetchLisTypeTax() {
  yield takeEvery(Types.FETCH_LIST_TYPE_TAX, fetchLisTypeTaxt);
}

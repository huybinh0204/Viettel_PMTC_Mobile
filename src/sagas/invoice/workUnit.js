import { put, call, takeEvery } from 'redux-saga/effects';
import _ from 'lodash';
import url from 'apis/url';
import { PostData } from '../../apis/helpers';
import * as Types from '../../actions/actionTypes'

const apiGetWorkUnit = (body) => PostData(url.FETCH_WORK_UNIT, body);

export function* fetchWorkUnit(action) {
  try {
    const response = yield call(apiGetWorkUnit, action.payload);
    if (_.has(response, 'data.data')) {
      yield put({ type: Types.FETCH_WORK_UNIT_SUCCESS, payload: response.data });
    } else yield put({ type: Types.FETCH_WORK_UNIT_FAIL, payload: { } });
  } catch {
    // perhaps roll back page count?
    yield put({ type: Types.FETCH_WORK_UNIT_FAIL, payload: { } });
  }
}

export function* watchFetchListInvoice() {
  yield takeEvery(Types.FETCH_WORK_UNIT, fetchWorkUnit);
}

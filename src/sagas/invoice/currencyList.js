import { put, call, takeEvery } from 'redux-saga/effects';
import _ from 'lodash';
import url from 'apis/url';
import { PostData } from '../../apis/helpers';
import * as Types from '../../actions/actionTypes'

const apiGetWorkingMarket = (body) => PostData(url.GET_LIST_CURRENCY, body);

export function* fetchWorkingMarket(action) {
  try {
    const response = yield call(apiGetWorkingMarket, action.payload);

    if (_.has(response, 'data')) {
      // remove search more
      const data = response.data.filter(x => x.name !== 'Tìm kiếm thêm');
      yield put({ type: Types.FETCH_CURRENCY_LIST_SUCCESS, payload: data });
    } else yield put({ type: Types.FETCH_CURRENCY_LIST_FAIL, payload: {} });
  } catch {
    yield put({ type: Types.FETCH_CURRENCY_LIST_FAIL, payload: {} });
  }
}

export function* watchFetchListCurrency() {
  yield takeEvery(Types.FETCH_CURRENCY_LIST, fetchWorkingMarket);
}

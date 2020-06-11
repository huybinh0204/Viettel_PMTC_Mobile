import { put, call, takeEvery } from 'redux-saga/effects';
import _ from 'lodash';
import url from 'apis/url';
import { PostData } from '../../apis/helpers';
import * as Types from '../../actions/actionTypes'

const apiGetTermPayment = (body) => PostData(url.FETCH_TERM_PAYMENT, body);

export function* fetchTermPayment(action) {
  try {
    const response = yield call(apiGetTermPayment, action.payload);
    if (_.has(response, 'data.data')) {
      yield put({ type: Types.FETCH_TERM_PAYMENT_SUCCESS, payload: response.data });
    } else yield put({ type: Types.FETCH_TERM_PAYMENT_FAIL, payload: { } });
  } catch {
    // perhaps roll back page count?
    yield put({ type: Types.FETCH_TERM_PAYMENT_FAIL, payload: { } });
  }
}

export function* watchFetchListInvoice() {
  yield takeEvery(Types.FETCH_TERM_PAYMENT, fetchTermPayment);
}

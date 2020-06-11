import { put, call, takeEvery } from 'redux-saga/effects';
import _ from 'lodash';
import url from 'apis/url';
import { PostData } from '../../apis/helpers';
import * as Types from '../../actions/actionTypes'

const apiGetListInvoice = (body) => PostData(url.FETCH_LIST_INVOICE, body);

export function* fetchListInvoice(action) {
  try {
    const response = yield call(apiGetListInvoice, action.payload);
    if (_.has(response, 'data.size')) {
      yield put({ type: Types.FETCH_LIST_INVOICE_SUCCESS, payload: response.data, pageCnt: action.payload.pageCnt });
    } else yield put({ type: Types.FETCH_LIST_INVOICE_FAIL, payload: { } });
  } catch {
    // perhaps roll back page count?
    yield put({ type: Types.FETCH_LIST_INVOICE_FAIL, payload: { } });
  }
}

export function* watchFetchListInvoice() {
  yield takeEvery(Types.FETCH_LIST_INVOICE, fetchListInvoice);
}

import { all, fork } from 'redux-saga/effects';
import { watchSaveUserData, watchUpdateUserData } from './users';
import { watchNearPlaces } from './location';
import { watchFetchListInvoice } from './invoice/listInvoice';
import { watchFetchListCurrency } from './invoice/currencyList';
import { watchFetchListChanel } from './invoice/listChanel';
import { watchFetchLisTypeTax } from './invoice/listTypeTax'

export default function* rootSaga() {
  yield all([
    fork(watchSaveUserData),
    fork(watchUpdateUserData),
    fork(watchNearPlaces),
    fork(watchFetchListInvoice),
    fork(watchFetchListCurrency),
    fork(watchFetchListChanel),
    fork(watchFetchLisTypeTax)
  ]);
}

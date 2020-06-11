import { takeLatest, put } from 'redux-saga/effects';
import { WATCH_CURRENT_LOCATION, UPDATE_CURRENT_LOCATION } from '../actions/actionTypes';

function* handleNearPlaces(body) {
  yield put({
    type: UPDATE_CURRENT_LOCATION,
    body
  })
}

export function* watchNearPlaces() {
  yield takeLatest(WATCH_CURRENT_LOCATION, handleNearPlaces);
}

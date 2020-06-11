import { takeLatest, put } from 'redux-saga/effects';
import { WATCH_SAVE_USER_DATA, WATCH_UPDATE_USER_DATA, UPDATE_USER_DATA, EDIT_USER_PROFILE } from '../actions/actionTypes';

function* handleSaveUserData(body) {
  let { data, token } = body
  yield put({
    type: UPDATE_USER_DATA,
    payload: { data, token }
  })
}

export function* watchSaveUserData() {
  yield takeLatest(WATCH_SAVE_USER_DATA, handleSaveUserData);
}

function* handleUpdateUserData(body) {
  let { data } = body
  yield put({
    type: EDIT_USER_PROFILE,
    payload: { data }
  })
}

export function* watchUpdateUserData() {
  yield takeLatest(WATCH_UPDATE_USER_DATA, handleUpdateUserData);
}

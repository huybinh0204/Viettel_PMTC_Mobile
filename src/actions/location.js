import { UPDATE_CURRENT_LOCATION } from './actionTypes';

export function updateNearPlaces(location) {
  return {
    type: UPDATE_CURRENT_LOCATION,
    payload: location
  }
}

export function updateStack(payload) {
  return {
    type: 'UPDATE_STACK',
    payload
  }
}

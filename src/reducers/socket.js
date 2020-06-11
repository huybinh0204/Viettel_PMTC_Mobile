import { INIT_SOCKET } from '../actions/actionTypes'

const initialState = {
  socket: null
}

export default function socket(state = initialState, action) {
  let newState
  switch (action.type) {
    case INIT_SOCKET:
      newState = {
        ...state,
        socket: action.socket
      }
      break
    default:
      newState = state
      break
  }
  return newState
}
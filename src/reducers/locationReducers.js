import { UPDATE_CURRENT_LOCATION } from '../actions';

const initialState = {
  exitApp: true,
  navigationHome: null,
  location: null
};

export const locationReducers = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CURRENT_LOCATION:
      return {
        ...state,
        location: action.payload
      };
    case 'UPDATE_STACK':
      return {
        ...state,
        exitApp: action.payload.exitApp,
        navigationHome: action.payload.navigationHome
      };
    default:
      return state;
  }
};

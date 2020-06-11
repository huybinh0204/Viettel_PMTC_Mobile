import { SET_FILTER_VOFFICE } from 'actions/actionTypes';
import * as TYPE from 'actions/actionTypes'

const initialState = {
  filter: {},
};

export const vOfficeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER_VOFFICE:
      return {
        ...state,
        filter: action.payload,
      };
    default:
      return state;
  }
};

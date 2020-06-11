import { UPDATE_USER_INFO, UPDATE_USER_DATA, EDIT_USER_PROFILE, GET_USER_INFO, UPDATE_NOTIFIFY_NUMBER, SAVE_NOTIFICATION } from 'actions/actionTypes';

const initialState = {
  data: {
    hoTen: 'AISolution'
  },
  userData: {
    hoTen: 'AISolution',
    adOrgId: 1000000,
    adUserDepartmentId: 1005025,
    adUserId: 21447,
    loggedIn: {
      userName: '', // user code
      userFullName: '',
      adUserId: 0,
      roleId: 0,
      roleName: '',
      adOrgId: 0,
      adOrgName: '',
      adUserDepartmentId: 0,
      departmentName: '',
    }
  },
  token: null,
  langCode: null,
  notifyNumber: 0,
  notification: {}
};

export const userReducers = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER_INFO:
      return {
        ...state,
        data: action.payload.data || action.payload.user,
        userData: action.payload.data || action.payload.user,
        token: action.payload.token
      };
    case UPDATE_USER_DATA:
      return {
        ...state,
        data: action.payload.data,
        userData: action.payload.data,
        token: action.payload.token
      };
    case EDIT_USER_PROFILE:
      return {
        ...state,
        data: { ...state.data, ...action.payload.data },
        userData: { ...state.data, ...action.payload.data },
      };
    case GET_USER_INFO:
      return {
        ...state,
        data: action.payload,
        userData: action.payload,
      };

    case UPDATE_NOTIFIFY_NUMBER:
      return {
        ...state,
        notifyNumber: action.payload,
      };

    case SAVE_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };
    default:
      return state;
  }
};

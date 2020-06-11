import * as TYPE from '../actions/actionTypes';

const initState = {
  inputSearch: false,
  tabActive: 0,
  keyword: '',
  filter: {},
  showAllFieldGroup: true,
  objExpanded: null,
  requestAmount: 0,
  isReloadList: false,
  enableEdit: false,
  uploadFileAttack: false,
  savedBeforeExit: false,
  advanceRequestId: null,
  department: {},
  coVoffice: false,
  idVoffice: null
}

export const advanceRequestReducer = (state = initState, action) => {
  switch (action.type) {
    case TYPE.RELOAD_UPDATE_LIST_ADVANCE_REQUEST:
      return {
        ...state,
        isReloadList: !state.isReloadList
      }
    case TYPE.C0_VOFFICE:
      return {
        ...state,
        coVoffice: action.bool,
        idVoffice: action.id
      }
    case TYPE.INIT_DEPARTMENT_ID:
      return {
        ...state,
        department: action.body
      }
    case TYPE.UPDATE_ADVANCE_REQUEST_ID:
      return {
        ...state,
        advanceRequestId: action.body
      }
    case TYPE.CHECK_SAVE_BEFORE_EXIT:
      return {
        ...state,
        savedBeforeExit: action.body
      }
    case TYPE.UPLOAD_FILE_ATTACK_SUCCESS:
      return {
        ...state,
        uploadFileAttack: !state.uploadFileAttack
      }
    case TYPE.DISABLE_EDIT:
      return {
        ...state,
        enableEdit: action.body
      }
    case TYPE.ACTION_INPUT_SEARCH:
      return {
        ...state,
        inputSearch: action.body
      }
    case TYPE.SEARCH_IN_TAB_DETAIL_INFO:
      return {
        ...state,
        keyword: action.body,
        tabActive: action.tabActive
      }
    case TYPE.FILTER_ADVANCE_REQUEST:
      return {
        ...state,
        filter: action.body,
        tabActive: action.tabActive
      }
    case TYPE.SHOW_ALL_FIELD:
      return {
        ...state,
        showAllFieldGroup: action.body
      }
    case TYPE.UPDATE_ICON_EYE:
      return {
        ...state,
        objExpanded: action.body
      }
    case TYPE.UPDATE_REQUEST_AMOUNT:
      return {
        ...state,
        requestAmount: action.body
      }
    default:
      return state;
  }
}

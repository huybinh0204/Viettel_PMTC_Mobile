import {
  SET_STATEMENT_ID,
  RESET_STATEMENT_ID,
  SET_STATUS_MENU_STATEMENT
} from 'actions/actionTypes';

import * as TYPE from 'actions/actionTypes';

const initialState = {
  data: {
    hoTen: 'AISolution'
  },
  statusCO: false,
  token: null,
  langCode: null,
  cStatementId: 0,
  cStatementLineId: 0,
  dataStatementLine: {},
  typeOfIconTabStatement: 0,
  typeOfIconAttackInfo: 0,
  typeOfIconPaymentInfo: 0,
  keySearchStatementLine: '',
  statusMenu: {
    isSave: true,
    isCO: true,
    isRa: true,
    isAttack: true,
    isSubmitd: true,
    isPrint: true
  },
  // statement
  isHideGeneralInfo: true,
  isHideOfficeInfo: true,
  isHideMoneyInfo: true,
  isHideStatusInfo: true,

  // statement Line
  isHideGeneralInfoLine: true,
  isHideAccountantLine: true,
  isHideBudgetLine: true,
  isHideDifferentLine: true,

  isHideAllDetail: false,
  isHideAllGeneral: false,
  uploadFileAttack: false,
  statusButtonCO: true,
  statusStatementChil: ''
};
// export const SET_STATEMENT_ID= 'SET_STATEMENT_ID'
// export const RESET_STATEMENT_ID= 'SET_STATEMENT_ID'
export const statementRuducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SET_STATEMENT_ID:
      return {
        ...state,
        cStatementId: action.payload
      };
    case TYPE.SET_STATEMENT_LINE_ID:
      return {
        ...state,
        cStatementLineId: action.payload
      };
    case TYPE.RESET_STATEMENT_ID:
      return {
        ...state,
        cStatementId: null
      };
    case TYPE.SET_STATUS_MENU_STATEMENT:
      return {
        ...state,
        statusMenu: action.payload
      };

    case TYPE.SET_KEY_SEARCH_TEXT_STATEMENT_LINE:
      return {
        ...state,
        keySearchStatementLine: action.payload
      };

    case TYPE.SET_DATA_STATEMENT_LINE:
      return {
        ...state,
        dataStatementLine: action.payload
      };

    case TYPE.UPLOAD_FILE_ATTACK_STATEMENT_SUCCESS:
      return {
        ...state,
        uploadFileAttack: !state.uploadFileAttack
      };
    case TYPE.SET_STATUS_STATEMENT_CHIL_STATEMENT:
      return {
        ...state,
        statusStatementChil: action.payload
      };
    case TYPE.RESET_DATA_STATEMENT_LINE:
      return {
        ...state,
        dataStatementLine: {}
      };
    case TYPE.SET_TYPE_OF_ICON_STATEMENT_LINE:
      return {
        ...state,
        typeOfIconTabStatement: action.payload
      };
    case TYPE.SET_TYPE_OF_ICON_ATTACK_INFO:
      return {
        ...state,
        typeOfIconAttackInfo: action.payload
      };
    case TYPE.SET_TYPE_OF_ICON_PAYMENT_INFO:
      return {
        ...state,
        typeOfIconPaymentInfo: action.payload
      };
    case TYPE.SET_IS_HIDE_GROUPS_STATEMENT:
      return {
        ...state,
        ...action.payload
      };
    case TYPE.SET_STATUS_STATEMENT_STATEMENT:
      return {
        ...state,
        statusButtonCO: action.payload
      };
    default:
      return state;
  }
};

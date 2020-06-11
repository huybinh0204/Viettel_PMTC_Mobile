import * as TYPE from 'actions/actionTypes'
const initialState = {
  statusCO: false,
  token: null,
  langCode: null,
  apInvoiceGroupId: 0,
  cStatementLineId: 0,
  dataStatementLine: {},
  typeOfIconTabStatement: 0,
  keySearchInvoice: "",
  statusMenu: { isSave: true, isCO: true, isRa: true, isAttack: true, isSubmitd: true, isPrint: true },
  // invoice group
  isHideGeneralInfo: true,
  isHideStatementInfo: true,
  isHideMoneyInfo: true,
  isHideOfficeInfo: true,
  isHideStatusInfo: true,

  // statement Line
  isHideGeneralInfoLine: true,
  isHideAccountantLine: true,
  isHideBudgetLine: true,
  isHideDifferentLine: true,

  isHideAllDetail: false,
  isHideAllGeneral: false,

  statusButtonCO: true,
  isReloadList: false,
  objExpanded: null,
  reloadItem: false,
  filter: {}

};

export const invoiceGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPE.RELOAD_UPDATE_LIST_INVOICE_GROUP:
      return {
        ...state,
        isReloadList: !state.isReloadList
      };
    case TYPE.SET_STATEMENT_LINE_ID:
      return {
        ...state,
        cStatementLineId: action.payload
      };
    case TYPE.RESET_STATEMENT_ID:
      return {
        ...state,
        apInvoiceGroupId: null
      };
    case TYPE.SET_STATUS_MENU_STATEMENT:
      return {
        ...state,
        statusMenu: action.payload
      };

    case TYPE.SET_KEY_SEARCH_TEXT_STATEMENT_LINE:
      return {
        ...state,
        keySearchInvoice: action.payload
      };

    case TYPE.SET_DATA_STATEMENT_LINE:
      return {
        ...state,
        dataStatementLine: action.payload
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
    case TYPE.UPDATE_ICON_EYE:
      return {
        ...state,
        objExpanded: action.body
      };
    case TYPE.UPDATE_INVOICE_GROUP_ITEM:
      return {
        ...state,
        reloadItem: !state.reloadItem
      }
    case TYPE.FILTER_PAY_OF_GROUP_INVOICE:
      return {
        ...state,
        filter: action.body
      }
    default:
      return state;
  }
};
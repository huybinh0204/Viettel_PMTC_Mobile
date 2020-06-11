import { FETCH_LIST_INVOICE, FETCH_LIST_INVOICE_SUCCESS, FETCH_LIST_INVOICE_FAIL, SET_LIST_INVOICE } from 'actions/actionTypes';
import * as TYPE from 'actions/actionTypes'
import { convertDataInvoice } from '../config/Function';

const initialState = {
  listInvoice: {
    start: 0,
    size: 10,
    total: 14,
    data: [
    ],
    filterClau: null,
    sqlSelected: null,
    isCheckedAll: null,
    currentPage: 2,
    maxdata: false
  },
  listCurrency: [],
  token: null,
  currentPage: 0,
  loading: false,
  langCode: null,
  typeOfIconTab: 0,
  listChanel: [],
  listTypeTax: []
};

export const invoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LIST_INVOICE:
      return {
        ...state,
        currentPage: action.payload.pageCnt,
        loading: true
      };
    case FETCH_LIST_INVOICE_SUCCESS: {
      let { data } = action.payload
      let dataConvert = convertDataInvoice(data)

      return {
        ...state,
        loading: false,
        listInvoice: {
          ...action.payload,
          data: dataConvert,
          currentPage: 2,
          maxdata: action.payload.size === 0
        }
      };
    }
    case FETCH_LIST_INVOICE_FAIL:
      return {
        ...state,
        loading: false
      };
    case SET_LIST_INVOICE: {
      return {
        ...state,
        listInvoice: action.payload,
      }
    }
    case TYPE.FETCH_CURRENCY_LIST:
      return {
        ...state,
        currentPage: action.payload.pageCnt,
        loading: true
      };
    case TYPE.FETCH_CURRENCY_LIST_SUCCESS: {
      return {
        ...state,
        loading: false,
        listCurrency: action.payload
      };
    }
    case TYPE.FETCH_CURRENCY_LIST_FAIL:
      return {
        ...state,
        loading: false
      };
    case TYPE.SET_TYPE_OF_ICON:
      console.log("SET_TYPE_OF_ICONSET_TYPE_OF_ICON")
      return {
        ...state,
        typeOfIconTab: action.payload
      };
    case TYPE.FETCH_LIST_CHANEL:
      return {
        ...state,
        loading: true
      };
    case TYPE.FETCH_LIST_CHANEL_SUCCESS: {
      return {
        ...state,
        loading: false,
        listChanel: action.payload
      };
    }
    case TYPE.FETCH_LIST_CHANEL_FAIL:
      return {
        ...state,
        loading: false
      };
    case TYPE.FETCH_LIST_TYPE_TAX:
      return {
        ...state,
        loading: true
      };
    case TYPE.FETCH_LIST_TYPE_TAX_SUCCESS: {
      return {
        ...state,
        loading: false,
        listTypeTax: action.payload
      };
    }
    case TYPE.FETCH_LIST_TYPE_TAX_FAIL:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

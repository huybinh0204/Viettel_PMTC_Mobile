import url from 'apis/url';
import { PostData, DelData, GetData, PutData } from '../helpers';

export const getListStatement = (body) => (PostData(url.FETCH_LIST_STATEMENT, body, true)
  .then(res => res)
  .catch(err => err)
);

export const listStateMentForInvoiceGroup = body => (PostData(`${url.LIST_STATEMENT}`, body, true)
  .then(res => res)
  .catch(err => err)
)

export const getPartner = (body) => (PostData(url.PARTNER_AUTOCOMPLETE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);
export const getDepartmentFull = (body) => (PostData(url.DEPARTMENT_FULL_AUTOCOMPLETE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);
export const getCategory = (body) => (PostData(url.CATEGORY_AUTOCOMPLETE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);
export const deleteItemStatement = id => (DelData(`${url.DELETE_ITEM_STATEMENT}/${id}`, true))
  .then(res => res)
  .catch(err => err);

export const findByIdStatement = id => (GetData(`${url.FIND_BY_ID_STATEMENT_REQUEST}${id}`, {})
  .then(res => res)
  .catch(err => err)
);

export const createSatement = (body) => (PostData(url.ADD_STATEMENT_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

export const getListcStatementLine = (body) => (PostData(url.FETCH_LIST_STATEMENT_LINE, body, true)
.then(res => res)
  .catch(err => err)
);
export const deleteItemStatementLine = id => (DelData(`${url.DELETE_ITEM_STATEMENT_LINE}/${id}/`, true))
  .then(res => res)
  .catch(err => err);

export const getFeild = (body) => (PostData(url.PAYMENT_AUTOCOMPLETE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

export const getBudget = (body) => (PostData(url.BUDGET_AUTOCOMPLETE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

export const getCostType  = (body) => (PostData(url.COST_TYPE_AUTOCOMPLETE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

export const getActivity  = (body) => (PostData(url.ACTIVITY_AUTOCOMPLETE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);
  
export const createSatementLine = (body) => (PostData(url.ADD_STATEMENT_LINE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

export const updateSatement = (body) => (PutData(url.UPDATE_STATEMENT_LINE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

export const duplicateStatementLine = (body) => (PostData(url.DUPLICATE_STATEMENT_LINE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

export const findByIdStatementLine = id => (GetData(`${url.FIND_BY_ID_STATEMENT_LINE_REQUEST}${id}`, {})
  .then(res => res)
  .catch(err => err)
);

export const updateSatementLine = (body) => (PutData(url.UPDATE_STATEMENTLINE_REQUEST, body)
  .then(res => res)
  .catch(err => err)
);

export const getPaymentStatementLine = (body) => (PostData(url.GET_PAYMENT_STATEMENTLINE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

export const duplicateStatement = (body) => (PostData(url.DUPLICATE_STATEMENT_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

export const raStatement  = (body) => (PostData(url.RA_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

export const coStatement = (body) => (PostData(url.CO_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

export const getListAttackFile = (body) => (PostData(url.GET_LIST_ATTACK_FILE, body, true)
  .then(res => res)
  .catch(err => err)
);

export const deleteAttackFile = (body) => (PostData(url.DELETE_ATTACK_FILE, body, true)
  .then(res => res)
  .catch(err => err)
);

export const getCurrencyRate = (body) => (PostData(url.GET_CURRENCY_RATE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);


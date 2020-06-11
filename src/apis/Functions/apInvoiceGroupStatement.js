import url from 'apis/url';
import { PostData, DelData, GetData, PutData } from '../helpers'

export const getListApInvoiceGroupStatement = (body) => (PostData(url.FETCH_LIST_APINVOICE_GROUP_STATEMENT, body, true)
  .then(res => res)
  .catch(err => err)
);
export const getApInvoiceGroupStatementDetail = async (body) => GetData(url.FETCH_APINVOICE_GROUP_STATEMENT_DETAIL, body).then(res => res.data).catch(error => null);
export const delApInvoiceGroupStatement = id => (DelData(`${url.DEL_APINVOICE_GROUP_STATEMENT}/${id}/`, true))
  .then(res => res)
  .catch(err => err);

export const duplicateItemApInvoiceGroupStatement = (body) => (PostData(url.DUPLICATE_ITEM_APINVOICE_GROUP_STATEMENT, body, true)
  .then(res => res)
  .catch(err => err)
);

const getListCurrency = body => (PostData(`${url.GET_LIST_CURRENCY}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const addNewApInvoiceGroup = body => (PostData(`${url.ADD_NEW_APINVOICE_GROUP_REQUEST}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const updateApInvoiceGroup = body => (PutData(`${url.UPDATE_APINVOICE_GROUP_REQUEST}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const getItemApInvoiceGroup = id => (GetData(`${url.GET_APINVOICE_GROUP_REQUEST}${id}`, {})
  .then(res => res)
  .catch(err => err)
)

const getPartner = (body) => (PostData(url.PARTNER_AUTOCOMPLETE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

export const raInvoiceGroup = (body) => (PostData(url.RA_ERP_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

export const coInvoiceGroup = (body) => (PostData(url.CO_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

export const getInvoiceList = (body) => (PostData(url.GET_INVOICE_LIST_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

const delInvoice = (body) => (PostData(url.DELETE_INVOICE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
);

const paymentInfoOfInvoiceGroup = (body) => (PostData(url.PAYMENT_INFO_OF_INVOICE_GROUP_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
)

const getVOfficeInfo = (body) => (PostData(url.GET_VOFFICE_INFO_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
)

const getListCostFactor = (body) => (PostData(`${url.GET_LIST_COST_FACTOR}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const coVoffice = body => PostData(url.CO_VOFFICE, body).then(res => res).catch(err => err)
const raVoffice = body => PostData(url.RA_VOFFICE, body).then(res => res).catch(err => err)


export default {
  getListCurrency,
  addNewApInvoiceGroup,
  updateApInvoiceGroup,
  getItemApInvoiceGroup,
  getPartner,
  raInvoiceGroup,
  coInvoiceGroup,
  getInvoiceList,
  delInvoice,
  paymentInfoOfInvoiceGroup,
  getVOfficeInfo,
  getListCostFactor,
  coVoffice,
  raVoffice
}

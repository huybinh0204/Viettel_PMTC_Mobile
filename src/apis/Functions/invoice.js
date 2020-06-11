import url from 'apis/url';
import { PostData, DelData, GetData, PutData } from '../helpers'

// voffice
const getVOfficeById = async (body) => (GetData(`${url.GET_DETAIL_VOFFICE}${body.id}`, body)
  .then(res => res.data)
  .catch(err => err)
);

// invoice
const getListInvoice = async (body) => (PostData(url.FETCH_LIST_INVOICE, body)
  .then(res => res.data)
  .catch(err => err)
);
const getDetailsInvoice = async (body) => (GetData(url.FETCH_DETAILS_INVOICE, body)
  .then(res => res)
  .catch(err => err)
);
const delInvoice = async (body) => (DelData(url.DEL_INVOICE + body, body)
  .then(res => res.data)
  .catch(err => err)
);
const searchTermPayment = async (body) => (PostData(url.FETCH_TERM_PAYMENT, body)
  .then(res => res)
  .catch(err => err)
);
const searchWorkUnit = async (body) => (PostData(url.WORK_UNIT, body)
  .then(res => res)
  .catch(err => err)
);
const searchWorkingMarket = async (body) => (PostData(url.WORKING_MARKET, body)
  .then(res => res)
  .catch(err => err)
);
const searchDebtSubject = async (body) => (PostData(url.GET_DEBT_SUBJECT, body)
  .then(res => res)
  .catch(err => err)
);
const createInvoice = async (body) => (PostData(url.CREATE_INVOICE, body)
  .then(res => res)
  .catch(err => err)
);
const editInvoice = async (body) => (PutData(url.EDIT_INVOICE, body)
  .then(res => res)
  .catch(err => err)
);
const duplInvoice = async (id) => (PostData(url.DUPL_INVOICE, id)
  .then(res => res)
  .catch(err => err)
);
// for detail invoice
const createDetailInvoice = async (body) => (PostData(url.ADD_DETAIL_INVOICE, body)
  .then(res => res)
  .catch(err => err)
);
const editDetailInvoice = async (body) => (PutData(url.EDIT_DETAIL_INVOICE, body)
  .then(res => res)
  .catch(err => err)
);
const delDetailInvoice = async (id) => (DelData(url.DEL_DETAIL_INVOICE + id)
  .then(res => res)
  .catch(err => err)
);
const duplDetailInvoice = async (id) => (PostData(url.DUPL_DETAIL_INVOICE + id, id)
  .then(res => res)
  .catch(err => err)
);
const getListDetailInvoice = async (body) => (PostData(url.GET_LIST_DETAIL_INVOICE, body)
  .then(res => res)
  .catch(err => err)
);
const searchCostCenter = async (body) => (PostData(url.GET_CENTER_COST, body)
  .then(res => res)
  .catch(err => err)
);
const searchCostSource = async (body) => (PostData(url.GET_SOURCE_COST, body)
  .then(res => res)
  .catch(err => err)
);
const searchDetailInvoice = async (body) => (PostData(url.GET_DEBT_SUBJECT, body)
  .then(res => res)
  .catch(err => err)
);
const searchManagerUnit = async (body) => (PostData(url.GET_DEBT_SUBJECT, body)
  .then(res => res)
  .catch(err => err)
);
const searchContract = async (body) => (PostData(url.GET_LIST_CONTRACT, body)
  .then(res => res)
  .catch(err => err)
);
const getListChanel = async (body) => (PostData(url.GET_LIST_CHANEL, body)
  .then(res => res)
  .catch(err => err)
);
const searchListProduct = async (body) => (PostData(url.GET_LIST_PROJECT, body)
  .then(res => res)
  .catch(err => err)
);
const getListCuom = async (body) => (PostData(url.GET_LIST_CUOM, body)
  .then(res => res)
  .catch(err => err)
);
// for debt
const createRequestPartne = async (body) => (PostData(url.CREATE_REQUEST_PARTER_SERVICE, body)
  .then(res => res)
  .catch(err => err)
);

const updateRequestPartner = async (body) => (PutData(url.UPDATE_REQUEST_PARTER_SERVICE, body)
  .then(res => res)
  .catch(err => err)
);

const deleteRequestPartner = async (id) => (DelData(url.UPDATE_REQUEST_PARTER_SERVICE + id)
  .then(res => res)
  .catch(err => err)
);

const duplicateRequestPartner = async (body) => (PostData(url.DUPLICATE_REQUEST_PARTER_SERVICE, body)
  .then(res => res)
  .catch(err => err)
);

const editRequestPartne = async (body) => (PutData(url.EDIT_REQUEST_PARTER_SERVICE, body)
  .then(res => res)
  .catch(err => err)
);
const delRequestPartne = async (id) => (DelData(url.DEL_REQUEST_PARTER_SERVICE + id)
  .then(res => res)
  .catch(err => err)
);
const getListRequestPartne = async (body) => (PostData(url.GET_REQUEST_PARTER_SERVICE, body)
  .then(res => res)
  .catch(err => err)
);
const searchListPayUnit = async (body) => (PostData(url.GET_LIST_PAY_UNIT, body)
  .then(res => res)
  .catch(err => err)
);

const getIDRequestPartner = async (id) => (GetData(`${url.GET_ID_REQUEST_PARTER_SERVICE}?id=${id}`, null)
  .then(res => res)
  .catch(err => err)
)

const searchReceiver = async (body) => (PostData(url.GET_LIST_AD_USER, body)
  .then(res => res)
  .catch(err => err)
);

const searchDetailInvoiceByGroup = async (body) => (GetData(url.DETAIL_INVOICE_BY_GROUP, body)
  .then(res => res)
  .catch(err => err)
)
const getCategoryProduct = async (body) => (PostData(url.GET_CATEGORY_PRODUCT, body)
  .then(res => res)
  .catch(err => err)
)
const getDetailDetailInvoice = async (body) => (GetData(url.GET_DETAIL_DETAIL_INVOICE, body)
  .then(res => res)
  .catch(err => err)
)

const getListPartner = async (body) => (PostData(url.GET_PARTNERT_FILTERSTATUS, body)
  .then(res => res)
  .catch(err => err)
)

const getListAdUser = async (body) => (PostData(url.GET_LIST_AD_USER, body)
  .then(res => res)
  .catch(err => err)
)

const removeAttachmment = async (attachId) => (PostData(url.DELETE_ATTACK_FILE, [attachId])
  .then(res => res)
  .catch(err => err)
)

const getListAttachment = async (idInvoice) => (PostData(url.GET_LIST_ATTACK_FILE, {
  "adTableId": 1000369,
  "recordId": idInvoice,
  "isActive": "Y",
  "isDeleted": "N"
}))

const getInvoiceListForSelect = async (body) => (PostData(url.GET_INVOICE_LIST_FOR_SELECT_REQUEST, body)
  .then(res => res.data)
  .catch(err => err)
)

const saveInvoiceForInvoiceGroup = (body) => (PostData(url.SAVE_INVOICE_FOR_INVOICE_GROUP_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)
)

const checkPriceInvoice = (body) => (PostData(url.CHECK_PRICE_INVOICE, body, true)
  .then(res => res)
  .catch(err => err)
)

export default {
  getVOfficeById,
  getListInvoice,
  getDetailsInvoice,
  duplInvoice,
  delInvoice,
  searchTermPayment,
  searchWorkUnit,
  searchWorkingMarket,
  searchDebtSubject,
  createInvoice,
  editInvoice,
  createDetailInvoice,
  editDetailInvoice,
  delDetailInvoice,
  duplDetailInvoice,
  getListDetailInvoice,
  searchCostCenter,
  searchCostSource,
  searchDetailInvoice,
  searchManagerUnit,
  searchContract,
  getListChanel,
  searchListProduct,
  createRequestPartne,
  editRequestPartne,
  delRequestPartne,
  getListRequestPartne,
  searchListPayUnit,
  searchDetailInvoiceByGroup,
  getCategoryProduct,
  getDetailDetailInvoice,
  getListPartner,
  updateRequestPartner,
  deleteRequestPartner,
  duplicateRequestPartner,
  getListAdUser,
  getListCuom,
  searchReceiver,
  getIDRequestPartner,
  getListAttachment,
  removeAttachmment,
  getInvoiceListForSelect,
  saveInvoiceForInvoiceGroup,
  checkPriceInvoice
};

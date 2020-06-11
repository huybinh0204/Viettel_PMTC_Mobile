import url from 'apis/url';
import { PostData, DelData, GetData, PutData, PostFormData } from '../helpers';

const deleteItemAdvanceRequest = (id) => (DelData(`${url.DELETE_ITEM_ADVANCE_REQUEST}/${id}`, true)
  .then(res => res)
  .catch(err => err)
)
const filterAdvanceRequest = (body) => (PostData(`${url.FILTER_ADVANCE_REQUEST}`, body, true)
  .then(res => res)
  .catch(err => err)
)
const getItemAdvanceRequest = id => (GetData(`${url.GET_ADVANCE_REQUEST}${id}`, {})
  .then(res => res)
  .catch(err => err)
)
const getListPayUnit = (body) => (PostData(`${url.GET_LIST_PAY_UNIT_POPUP}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const getListCostFactor = (body) => (PostData(`${url.GET_LIST_COST_FACTOR}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const getListCurrency = body => (PostData(`${url.GET_LIST_CURRENCY}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const addNewAdvanceRequest = body => (PostData(`${url.ADD_NEW_ADVANCE_REQUEST}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const updateAdvanceRequest = body => (PutData(`${url.ADD_NEW_ADVANCE_REQUEST}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const getListDetailAdvanceRequest = body => (PostData(`${url.LIST_DETAIL_ADVANCE_REQUEST}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const deleteDeatailadvanceRequest = id => (DelData(`${url.DELETE_DETAIL_ADVANCE_REQUEST}/${id}`, true)
  .then(res => res)
  .catch(err => err)
)

const getListItemFee = body => (PostData(`${url.LIST_ITEM_FEE}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const getContract = body => (PostData(`${url.GET_CONTRACTS}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const getProject = body => (PostData(`${url.GET_PROJECT}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const getPosition = body => (PostData(`${url.GET_POSITION}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const getListDebtSubject = body => (PostData(`${url.GET_LIST_DEBT_SUBJECTS}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const getFunding = body => (PostData(`${url.GET_FUNING}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const paymentType = body => (PostData(`${url.PAYMENT_TYPE}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const peopleRequest = body => (PostData(`${url.PEOPLE_REQUEST}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const debtRecevingUnit = body => (PostData(`${url.DEB_RECEVING_UNIT}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const bank = body => (PostData(`${url.BANK}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const benefitBank = body => (PostData(`${url.BENEFI_BANK_ACCOUNT}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const listStateMent = body => (PostData(`${url.LIST_STATEMENT}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const createDetailLineAdvanceRequest = body => (PostData(`${url.CREATE_DETAIL_LINE_ADVANCE_REQUEST}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const getDetailLineAdvanceRequest = id => (GetData(`${url.GET_DETAIL_LINE_ADVANCE_REQUEST}?id=${id}`, true)
  .then(res => res)
  .catch(err => err)
)

const updateDetailLineAdvanceRequest = (body) => (PutData(`${url.UPDATE_DETAIL_LINE_ADVANCE_REQUEST}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const duplicateDetailLineAdvanceRequest = (id) => (PostData(`${url.DUPLICATE_ITEM_LINE_ADVANCE_REQUEST}`, id, true)
  .then(res => res)
  .catch(err => err)
)

const duplicateItemAdvanceRequest = (id) => (PostData(`${url.DUPLICATE_ITEM_ADVANCE_REQUEST}`, id, true)
  .then(res => res)
  .catch(err => err)
)

const getListApproval = (body) => (PostData(`${url.GET_LIST_APPROVAL_ADVANCE_REQUEST}`, body)
  .then(res => res)
  .catch(err => err)
)

const createApproval = (body) => (PostData(`${url.CREATE_APPROVAL_ADVANCE_REQUEST}`, body)
  .then(res => res)
  .catch(err => err)
)

const departmentApproval = (body) => (PostData(`${url.DEPARTMENT_APPROVAL}`, body)
  .then(res => res)
  .catch(err => err)
)

const statementApproval = (body) => (PostData(`${url.STATEMENT_APPROVAL}`, body)
  .then(res => res)
  .catch(err => err)
)

const getItemDepartmentApproval = (id) => (GetData(`${url.GET_ITEM_DEPARTMENT_APPROVAL}?id=${id}`, true)
  .then(res => res)
  .catch(err => err)
)

const deleteItemDepartmentApproval = (id) => (DelData(`${url.DELETE_ITEM_DEPARTMENT_APPROVAL}/${id}`, true)
  .then(res => res)
  .catch(err => err)
)

const duplicateItemDepartmentApproval = (id) => (PostData(`${url.DUPLICATE_ITEM_DEPARTMENT_APPROVAL}?id=${id}`, id, true)
  .then(res => res)
  .catch(err => err)
)

const updateItemDepartmentApproval = (body) => (PutData(`${url.UPDATE_ITEM_DEPARTMENT_APPROVAL}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const getListPayIndo = (body) => (PostData(`${url.GET_LIST_PAY_INFO}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const downloadFileAttack = (filename, folder) => (GetData(`${url.DOWNLOAD_FILE_ATTACK}`.concat(`={'filename':'${filename}', 'folder':'${folder}'}`), true)
  .then(res => res)
  .catch(err => err)
)

const listSigner = (keywork) => (GetData(`${url.LIST_SIGNERS}?term=${keywork}`, true)
  .then(res => res)
  .catch(err => err)
)

const roleSigner = (body) => (PostData(`${url.ROLE_SIGNERS}`, body, true)
  .then(res => res)
  .catch(err => err)
)

const CO = body => PostData(url.CO, body, true)
  .then(res => res)
  .catch(err => err)

const RA = body => PostData(url.RA, body, true)
  .then(res => res)
  .catch(err => err)

const vOffice = body => PostData(url.V_OFFICE, body, true)
  .then(res => res)
  .catch(err => err)

const getListRoleMenu = adRoleId => PostData(url.LIST_ROLE_MENU, adRoleId, true)
  .then(res => res)
  .catch(err => err)

const getPartners = body => PostData(url.PARTNER_AUTOCOMPLETE_REQUEST, body, true)
  .then(res => res)
  .catch(err => err)

const coVoffice = body => PostData(url.CO_VOFFICE, body).then(res => res).catch(err => err)
const raVoffice = body => PostData(url.RA_VOFFICE, body).then(res => res).catch(err => err)
const listAttackVoffice = id => GetData(`${url.GET_ATTACH_LIST}${id}`).then(res => res).catch(err => err)
const addSignerVoffice = signers => PostData(url.ADD_SIGNER_VOFFICE, signers).then(res => res).catch(err => err)
const deleteSignerVoffice = idSigner => DelData(`${url.DELETE_SIGNER_VOFFICE}/${idSigner}`).then(res => res).catch(err => err)
const addFileAttackVoffice = (cattachmentinfoId, idCreated, idUpdated, fileName, file) => PostFormData(`${url.ADD_FILE_ATTACK_VOFFICE}/${cattachmentinfoId}/${idCreated}/${idUpdated}/${fileName}`, file)
  .then(res => res)
  .catch(err => err)

export default {
  deleteItemAdvanceRequest,
  filterAdvanceRequest,
  getItemAdvanceRequest,
  getListPayUnit,
  getListCostFactor,
  getListCurrency,
  addNewAdvanceRequest,
  updateAdvanceRequest,
  getListDetailAdvanceRequest,
  deleteDeatailadvanceRequest,
  getListItemFee,
  getContract,
  getProject,
  getPosition,
  getListDebtSubject,
  getFunding,
  paymentType,
  peopleRequest,
  debtRecevingUnit,
  bank,
  benefitBank,
  listStateMent,
  createDetailLineAdvanceRequest,
  getDetailLineAdvanceRequest,
  updateDetailLineAdvanceRequest,
  duplicateDetailLineAdvanceRequest,
  duplicateItemAdvanceRequest,
  getListApproval,
  createApproval,
  departmentApproval,
  statementApproval,
  getItemDepartmentApproval,
  deleteItemDepartmentApproval,
  duplicateItemDepartmentApproval,
  updateItemDepartmentApproval,
  getListPayIndo,
  downloadFileAttack,
  listSigner,
  roleSigner,
  CO,
  RA,
  vOffice,
  getListRoleMenu,
  getPartners,
  // coPrint,
  coVoffice,
  raVoffice,
  listAttackVoffice,
  addSignerVoffice,
  deleteSignerVoffice,
  addFileAttackVoffice
};

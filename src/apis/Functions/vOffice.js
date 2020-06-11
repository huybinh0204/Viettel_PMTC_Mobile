import url from 'apis/url';
import { PostData, DelData, GetData, PutData, PostFormData } from '../helpers'

const getListVOffice = async (body) => (PostData(url.GET_LIST_VOFFICE, body)
  .then(res => res.data)
  .catch(err => err)
);

const getTextForms = async (body) => (PostData(url.GET_TEXT_FORMS_VOFFICE, body))
  .then(res => res.data)
  .catch(err => err)

const getDetailsVOffice = async (body) => (GetData(`${url.GET_DETAIL_VOFFICE}${body.id}`, body)
  .then(res => res)
  .catch(err => err)
);

const delVOffice = async (body) => (DelData(url.DEL_VOFFICE + body, body)
  .then(res => res.data)
  .catch(err => err)
);

const createVOffice = async (body) => (PostData(url.CREATE_VOFFICE, body))
  .then(res => res)
  .catch(err => err)

const updateVOffice = async (body) => (PutData(url.UPDATE_VOFFICE, body))
  .then(res => res)
  .catch(err => err)

const CO = async (body) => (PostData(url.UPDATE_CO_VOFFICE, body))
  .then(res => res)
  .catch(err => err)

const RA = async (body) => (PostData(url.UPDATE_RA_VOFFICE, body))
  .then(res => res)
  .catch(err => err)

const createSigners = signers => PostData(url.CREATE_SIGNERS, signers)
  .then(res => res)
  .catch(err => err)

const getAttachList = async (id) => (GetData(`${url.GET_ATTACH_LIST}${id}`))
  .then(res => res)
  .catch(err => err)

const getSignerList = async (id) => (GetData(`${url.GET_SIGNER_LIST}${id}`))
  .then(res => res)
  .catch(err => err)

const delSigner = async (id) => (DelData(`${url.DELETE_SIGNER}${id}`))
  .then(res => res)
  .catch(err => err)

const delSignerFile = async (id) => (PutData(`${url.DELETE_SIGNER_FILE}`, id))
  .then(res => res)
  .catch(err => err)

const changeTypePrint = (id, formData) => PostFormData(`${url.CHANGE_TYPE_PRINT_AFTER_CO}/${id}`, formData)
  .then(res => res)
  .catch(err => err)

const getListAttackVoffice = id => GetData(`${url.GET_LIST_ATTACK_FILE}/${id}`)
  .then(res => res)
  .catch(err => err)

export default {
  getListVOffice,
  getDetailsVOffice,
  delVOffice,
  getTextForms,
  createVOffice,
  updateVOffice,
  CO,
  RA,
  createSigners,
  getAttachList,
  getSignerList,
  delSigner,
  delSignerFile,
  changeTypePrint,
  getListAttackVoffice
};

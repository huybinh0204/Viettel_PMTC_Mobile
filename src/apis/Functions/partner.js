import url from 'apis/url';
import { PostData, DelData, GetData, PutData } from '../helpers'

const removeAttachmment = async (attachId) => (PostData(url.DELETE_ATTACK_FILE, [attachId])
  .then(res => res)
  .catch(err => err)
)

const getListAttachment = async (idPartner) => (PostData(url.GET_LIST_ATTACK_FILE, {
  "adTableId": 1001834,
  "recordId": idPartner,
  "isActive": "Y",
  "isDeleted": "N"
}).then(res => res)
  .catch(err => err)
)

const CO = async (body) => (PostData(url.UPDATE_CO_PARTER, body))
  .then(res => res)
  .catch(err => err)

const RA = async (body) => (PostData(url.UPDATE_RA_PARTER, body))
  .then(res => res)
  .catch(err => err)

export default {
  getListAttachment,
  removeAttachmment,
  CO,
  RA,
};

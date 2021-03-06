import { NetworkSetting } from '../config/Setting';

export default {
  TEST_TITTLE: 'This is test tittle',
  DELETE_TOKEN: `${NetworkSetting.ROOT}/sotay/deviceToken/user/`,
  // Invoice
  CREATE_INVOICE: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceServiceRest/apInvoice/`,
  EDIT_INVOICE: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceServiceRest/apInvoice/`,
  DEL_INVOICE: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceServiceRest/apInvoice/`,
  ADD_DUP_INVOICE: '',
  FETCH_DETAILS_INVOICE: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceServiceRest/apInvoice/findById`,
  FETCH_LIST_INVOICE: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceServiceRest/apInvoice/filterStatus`,
  GET_INVOICE_BY_ID: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceServiceRest/apInvoice/findById?id=54288`,
  DEL_INVOICE_BY_ID: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceServiceRest/apInvoice/{id}`,
  DUPL_INVOICE: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceServiceRest/apInvoice/dupl`,
  CHECK_PRICE_INVOICE: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceServiceRest/apInvoice/checkPriceApInvoiceLine`,
  // RequestPartner
  GET_DEBT_SUBJECT: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cBpartner/findByAutoComplete`,
  GET_REQUEST_PARTER_SERVICE: `${NetworkSetting.ROOT}/erp-service-mobile/cRequestPartnerServiceRest/cRequestPartner/filterStatus`,
  DEL_REQUEST_PARTER_SERVICE: `${NetworkSetting.ROOT}/erp-service-mobile/cRequestPartnerServiceRest/cRequestPartner/`,
  EDIT_REQUEST_PARTER_SERVICE: `${NetworkSetting.ROOT}/erp-service-mobile/cRequestPartnerServiceRest/cRequestPartner/`,
  CREATE_REQUEST_PARTER_SERVICE: `${NetworkSetting.ROOT}/erp-service-mobile/cRequestPartnerServiceRest/cRequestPartner/`,
  UPDATE_REQUEST_PARTER_SERVICE: `${NetworkSetting.ROOT}/erp-service-mobile/cRequestPartnerServiceRest/cRequestPartner/`,
  DUPLICATE_REQUEST_PARTER_SERVICE: `${NetworkSetting.ROOT}/erp-service-mobile/cRequestPartnerServiceRest/cRequestPartner/duplicate`,
  GET_PARTNERT_FILTERSTATUS: `${NetworkSetting.ROOT}/erp-service-mobile/cRequestPartnerServiceRest/cRequestPartner/filterStatus`,
  GET_LIST_AD_USER: `${NetworkSetting.ROOT}/erp-service/adUserServiceRest/adUser/getForAutoCompleteAdUser`,
  GET_ID_REQUEST_PARTER_SERVICE: `${NetworkSetting.ROOT}/erp-service-mobile/cRequestPartnerServiceRest/cRequestPartner/findById`,
  UPDATE_CO_PARTER: `${NetworkSetting.ROOT}/erp-service-mobile/cRequestPartnerServiceRest/cRequestPartner/doCo`,
  UPDATE_RA_PARTER: `${NetworkSetting.ROOT}/erp-service-mobile/cRequestPartnerServiceRest/cRequestPartner/doRa`,
  // for create invoice
  FETCH_TERM_PAYMENT: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cPaymentTerm/getForAutoComplete`,
  WORK_UNIT: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cWorkUnit/getForAutoComplete`,
  WORKING_MARKET: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cLocation/getForAutoComplete`,
  GET_LIST_CURRENCY: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cCurrency/findByAutoComplete`,
  DUPL_DETAIL_INVOICE: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceLineServiceRest/apInvoiceLine/dupl?id=`,
  ADD_DETAIL_INVOICE: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceLineServiceRest/apInvoiceLine/`,
  EDIT_DETAIL_INVOICE: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceLineServiceRest/apInvoiceLine/`,
  DEL_DETAIL_INVOICE: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceLineServiceRest/apInvoiceLine/`,
  GET_LIST_DETAIL_INVOICE: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceLineServiceRest/apInvoiceLine/filterStatus`,
  GET_LIST_PAY_UNIT: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/adOrg/getForAutoComplete`,
  // for detail invoice
  GET_CENTER_COST: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cCostCenter/getForAutoComplete`,
  GET_SOURCE_COST: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cBudgetFull/getForAutoComplete`,
  GET_LIST_PROJECT: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cProject/findByAutoComplete`,
  GET_LIST_CONTRACT: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cContract/findByAutoComplete`,
  GET_LIST_CHANEL: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cChannel/findByAutoComplete`,
  DETAIL_INVOICE_BY_GROUP: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementLineServiceRest/cStatementLine/detailByInvoiceGroup/112610?id=112610`,
  GET_CATEGORY_PRODUCT: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/mProduct/getForAutoComplete`,
  GET_DETAIL_DETAIL_INVOICE: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceLineServiceRest/apInvoiceLine/findById`,
  GET_LIST_TYPE_TAX: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cTax/getForAutoComplete`,
  GET_LIST_CUOM: `${NetworkSetting.ROOT}/erp-service/cUomServiceRest/cUom/getForAutoComplete`,
  // VOffice
  GET_LIST_VOFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/cDocumentsignServiceRest/cDocumentsign/filterStatus`,
  GET_TEXT_FORMS_VOFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/cDocumentsignServiceRest/cDocumentsign/cDocumentType/findByAutoComplete`,
  GET_DETAIL_VOFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/cDocumentsignServiceRest/cDocumentsign/findById?id=`,
  DEL_VOFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/cDocumentsignServiceRest/cDocumentsign/`,
  CREATE_VOFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/cDocumentsignServiceRest/cDocumentsign`,
  UPDATE_VOFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/cDocumentsignServiceRest/cDocumentsign`,
  UPDATE_CO_VOFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/completeIt/`,
  UPDATE_RA_VOFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/reActivateIt/`,
  CREATE_SIGNERS: `${NetworkSetting.ROOT}/erp-service-mobile/cOfficestaffServiceRest/cOfficePosition/getForAutoComplete`,
  GET_ATTACH_LIST: `${NetworkSetting.ROOT}/erp-service-mobile/cAttachmentinfoRsServiceRest/cAttachmentInfo/`,
  GET_SIGNER_LIST: `${NetworkSetting.ROOT}/erp-service-mobile/cSigninfomationServiceRest/cSignInfomation/`,
  DELETE_SIGNER: `${NetworkSetting.ROOT}/erp-service-mobile/cSigninfomationServiceRest/cSignInfomation/`,
  DELETE_SIGNER_FILE: `${NetworkSetting.ROOT}/erp-service/cAttachmentinfoServiceRest/remove`,
  CHANGE_TYPE_PRINT_AFTER_CO: `${NetworkSetting.ROOT}/erp-service-mobile/cDocumentsignServiceRest/cDocumentsign/addFileSignY`,
  // Advance Request
  DELETE_ITEM_ADVANCE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cAdvanceRequestServiceRest/cAdvanceRequest`,
  FILTER_ADVANCE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cAdvanceRequestServiceRest/cAdvanceRequest/filterStatus`,
  GET_ADVANCE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cAdvanceRequestServiceRest/cAdvanceRequest/findById?id=`,
  GET_LIST_PAY_UNIT_POPUP: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/adOrg/getForAutoComplete`,
  GET_LIST_COST_FACTOR: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cCostCategory/findByAutoComplete`,
  ADD_NEW_ADVANCE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cAdvanceRequestServiceRest/cAdvanceRequest`,
  LIST_DETAIL_ADVANCE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cAdvanceRequestLineServiceRest/cAdvanceRequestLine/filterStatus`,
  DELETE_DETAIL_ADVANCE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cAdvanceRequestLineServiceRest/cAdvanceRequestLine`,
  LIST_ITEM_FEE: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cCostTypeFull/getForAutoComplete`,
  GET_CONTRACTS: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cContract/findByAutoComplete`,
  GET_PROJECT: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cProject/findByAutoComplete`,
  GET_POSITION: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cSiteCodeInfo/findByAutoComplete`,
  GET_LIST_DEBT_SUBJECTS: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cBpartner/findByAutoComplete`,
  GET_FUNING: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cBudgetFull/getForAutoComplete`,
  PAYMENT_TYPE: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cInOutcomeType/getForAutoComplete`,
  PEOPLE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cBpartner/findByAutoComplete`,
  DEB_RECEVING_UNIT: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/adOrg/getForAutoCompleteAll`,
  BENEFI_BANK_ACCOUNT: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cBpartnerBank/getForAutoComplete`,
  BANK: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cBank/getForAutoComplete`,
  LIST_STATEMENT: `${NetworkSetting.ROOT}/erp-service/cStatementServiceRest/cStatement/getForAutoCompleteApCash`,
  CREATE_DETAIL_LINE_ADVANCE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cAdvanceRequestLineServiceRest/cAdvanceRequestLine`,
  GET_DETAIL_LINE_ADVANCE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cAdvanceRequestLineServiceRest/cAdvanceRequestLine/findById`,
  UPDATE_DETAIL_LINE_ADVANCE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cAdvanceRequestLineServiceRest/cAdvanceRequestLine`,
  DUPLICATE_ITEM_LINE_ADVANCE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cAdvanceRequestLineServiceRest/cAdvanceRequestLine/dupl`,
  DUPLICATE_ITEM_ADVANCE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cAdvanceRequestServiceRest/cAdvanceRequest/dupl`,
  GET_LIST_APPROVAL_ADVANCE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cApprovalAdvanceRequestRsServiceRest/cApprovalAdvanceRequest/filterStatus`,
  CREATE_APPROVAL_ADVANCE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cApprovalAdvanceRequestRsServiceRest/cApprovalAdvanceRequest/addCApprovalAdvanceRequest`,
  DEPARTMENT_APPROVAL: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cDepartmentFull/findAllByAutoComplete`,
  STATEMENT_APPROVAL: `${NetworkSetting.ROOT}/erp-service/cStatementServiceRest/cStatement/getForAutoCompleteApCash`,
  GET_ITEM_DEPARTMENT_APPROVAL: `${NetworkSetting.ROOT}/erp-service-mobile/cApprovalAdvanceRequestRsServiceRest/cApprovalAdvanceRequest/findById`,
  DELETE_ITEM_DEPARTMENT_APPROVAL: `${NetworkSetting.ROOT}/erp-service-mobile/cApprovalAdvanceRequestRsServiceRest/cApprovalAdvanceRequest`,
  DUPLICATE_ITEM_DEPARTMENT_APPROVAL: `${NetworkSetting.ROOT}/erp-service-mobile/cApprovalAdvanceRequestRsServiceRest/cApprovalAdvanceRequest/duplicateCApprovalAdvanceRequest`,
  UPDATE_ITEM_DEPARTMENT_APPROVAL: `${NetworkSetting.ROOT}/erp-service-mobile/cApprovalAdvanceRequestRsServiceRest/cApprovalAdvanceRequest/updateCApprovalAdvanceRequest`,
  GET_LIST_PAY_INFO: `${NetworkSetting.ROOT}/erp-service-mobile/cAdvanceRequestServiceRest/cAdvanceRequest/getSubInfo`,
  DOWNLOAD_FILE_ATTACK: `${NetworkSetting.ROOT}/erp-service/adAttachmentServiceRest/downloadFile?condition`,
  LIST_SIGNERS: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cOfficestaff/findByAutoComplete`,
  ROLE_SIGNERS: `${NetworkSetting.ROOT}/erp-service-mobile/cOfficestaffServiceRest/cOfficePosition/getForAutoComplete`,
  CO: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/completeIt`,
  RA: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/reActivateIt`,
  LIST_ROLE_MENU: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/adRoleMenu/doSearchByRole`,
  // CO_PRINT: `${NetworkSetting.ROOT}/erp-service-mobile/cDocumentsignServiceRest/attachFile`,
  CO_VOFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/completeIt/`,
  RA_VOFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/reActivateIt/`,
  // ADD_SIGNER_VOFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/cSigninfomationServiceRest/create/`,
  ADD_SIGNER_VOFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/cDocumentsignServiceRest/createSigners/`,
  DELETE_SIGNER_VOFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/cSigninfomationServiceRest/cSigninfomation`,
  ADD_FILE_ATTACK_VOFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/cAttachmentinfoRsServiceRest/attachFile`,

  // Statement
  FETCH_LIST_STATEMENT: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementServiceRest/cStatement/filterStatus`,
  FETCH_LIST_STATEMENT_LINE: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementLineServiceRest/cStatementLine/filterStatus`,
  DELETE_ITEM_STATEMENT: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementServiceRest/cStatement`,
  DELETE_ITEM_STATEMENT_LINE: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementLineServiceRest/cStatementLine`,
  FIND_BY_ID_STATEMENT_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementServiceRest/cStatement/findById?id=`,
  PARTNER_AUTOCOMPLETE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cBpartner/findByAutoComplete`,
  DEPARTMENT_FULL_AUTOCOMPLETE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cDepartmentFull/findByAutoComplete`,
  CATEGORY_AUTOCOMPLETE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cStatementCategory/findByAutoComplete`,
  ADD_STATEMENT_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementServiceRest/cStatement/`,
  PAYMENT_AUTOCOMPLETE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cPaymentScope/getForAutoComplete`,
  BUDGET_AUTOCOMPLETE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cBudgetFull/getForAutoComplete`,
  COST_TYPE_AUTOCOMPLETE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cCostTypeFull/getForAutoComplete`,
  ACTIVITY_AUTOCOMPLETE_REQUEST: `${NetworkSetting.ROOT}//erp-service-mobile/erpAPITermServiceRest/cActivity/getForAutoComplete`,
  ADD_STATEMENT_LINE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementLineServiceRest/cStatementLine/`,
  UPDATE_STATEMENT_LINE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementServiceRest/cStatement/`,
  DUPLICATE_STATEMENT_LINE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementLineServiceRest/cStatementLine/dupl`,
  FIND_BY_ID_STATEMENT_LINE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementLineServiceRest/cStatementLine/findById?id=`,
  UPDATE_STATEMENTLINE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementLineServiceRest/cStatementLine/`,
  GET_PAYMENT_STATEMENTLINE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cTypeOfRevenue/getSubInfo`,
  DUPLICATE_STATEMENT_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementServiceRest/cStatement/dupl`,
  RA_STATEMENT_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementServiceRest/cStatement/ra`,
  CO_STATEMENT_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cStatementServiceRest/cStatement/co`,
  GET_LIST_ATTACK_FILE: `${NetworkSetting.ROOT}/erp-service/adAttachmentServiceRest/adAttachment/search`,
  DELETE_ATTACK_FILE: `${NetworkSetting.ROOT}/erp-service/adAttachmentServiceRest/adAttachment/deleteList`,
  V_OFFICE: `${NetworkSetting.ROOT}/erp-service-mobile/cDocumentsignServiceRest/cDocumentsign/vOfficeInfo`,

  //ApInvoiceGroupStatement
  FETCH_LIST_APINVOICE_GROUP_STATEMENT: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceGroupServiceRest/apInvoiceGroup/filterStatus`,
  FETCH_APINVOICE_GROUP_STATEMENT_DETAIL: `${NetworkSetting.ROOT}/erp-service-mobile/getAPInvoiceDetail`,
  DEL_APINVOICE_GROUP_STATEMENT: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceGroupServiceRest/apInvoiceGroup`,
  DUPLICATE_ITEM_APINVOICE_GROUP_STATEMENT: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceGroupServiceRest/apInvoiceGroup/dupl`,
  ADD_NEW_APINVOICE_GROUP_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceGroupServiceRest/apInvoiceGroup`,
  UPDATE_APINVOICE_GROUP_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceGroupServiceRest/apInvoiceGroup/`,
  GET_APINVOICE_GROUP_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceGroupServiceRest/apInvoiceGroup/findById?id=`,
  GET_INVOICE_LIST_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceServiceRest/apInvoice/filterStatus`,
  DELETE_INVOICE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceServiceRest/apInvoice/deleteFromTHTT`,
  GET_INVOICE_LIST_FOR_SELECT_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceGroupServiceRest/apInvoiceGroup/searchApInvoiceNoGr`,
  SAVE_INVOICE_FOR_INVOICE_GROUP_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceServiceRest/apInvoice/saveApInvoiceToGr`,
  PAYMENT_INFO_OF_INVOICE_GROUP_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/apInvoiceGroupServiceRest/apInvoiceGroup/getApCash`,

  // User
  GET_USER_REQUEST: `${NetworkSetting.ROOT}/erp-service/adUserServiceRest/getUserInfoByUserName/`,
  CREATE_SESSION_MOBILE_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/adUserServiceRest/adUser/createSession2`,
  CREATE_SESSION_REQUEST: `${NetworkSetting.ROOT}/erp-service/adUserServiceRest/adUser/createSession2`,
  SAVE_DEVICE_TOKEN_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/userDeviceTokenServiceRest/adUserDeviceToken`,

  //common
  CO_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/completeIt`,
  RA_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/reActivateIt`,
  RA_ERP_REQUEST: `${NetworkSetting.ROOT}/erp-service/baseDocServiceRest/reActivateIt`,
  GET_VOFFICE_INFO_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/cDocumentsignServiceRest/cDocumentsign/vOfficeInfo`,
  GET_CURRENCY_RATE_REQUEST: `${NetworkSetting.ROOT}/erp-service/cCurrencyRateRsServiceRest/cCurrencyRate/getDefaul/`,
  
  //notification
  GET_NOTIFICATION_LIST_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/notificationServiceRest/notification/getLstNotiByUserId`,
  READ_NOTIFICATION_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/notificationServiceRest/notification/readNotification`,
  GET_ACTION_HISTORY_REQUEST: `${NetworkSetting.ROOT}/erp-service-mobile/adUserServiceRest/adUser/getHistoryAction`,
}
import moment from 'moment';

export default {
    isautopost: 'N',
    isCarryForward: 'N',
    originalInvoiceGroupId: null,
    isPayOnBehalf: 'N',
    numberReactive: 0,
    dateReactive: null,
    dateReactiveFrom: null,
    dateReactiveTo: null,
    apInvoiceGroupPreId: null,
    numberSettlement: null,
    controlDepartmentId: null,
    toFinancialDepartment: null,
    productAmount: null,
    pitStatus: null,
    pitCheckId: null,
    isAutoClearAsset: 'N',
    apInvoiceGroupId: 0,
    adOrgId: 0,
    adOrgName: null,
    adClientId: null,
    adClientName: null,
    created: null,
    createdFrom: null,
    createdTo: null,
    createdby: null,
    createdbyName: null,
    updated: null,
    updatedFrom: null,
    updatedTo: null,
    updatedby: null,
    updatedbyName: null,
    name: null,
    value: null,
    description: '',
    isactive: 'Y',
    isDeleted: 'N',
    type: 0,
    documentNo: '',
    transDate: moment(new Date()).format('DD/MM/YYYY'),
    transDateFrom: null,
    transDateTo: null,
    voucherNo: null,
    accountingDate: moment(new Date()).format('DD/MM/YYYY'),
    accountingDateFrom: null,
    accountingDateTo: null,
    batchNo: '',
    batchName: '',
    groupBatchNo: null,
    groupBatchName: null,
    requestAmount: 0.0,
    approvedAmount: 0.0,
    approveStatus: 0,
    docstatus: 'DR',
    accountingStatus: 0,
    paymentStatus: 0,
    isSync: 'N',
    posted: 'N',
    apInvoiceGroupRefId: null,
    apInvoiceGroupRefName: null,

    email: '',
    approveReason: null,
    signerstatus: 0,
    issignerrecord: 'N',
    signcomment: null,
    timeDr: moment(new Date()).format('DD/MM/YYYY'),
    isSubmitHardCopy: 'N',
    hardCopyInfo: null,
    fwmodelId: 0,
    isSize: true,
    cCurrencyId: null,
    cBpartnerId: null,
    cDepartmentId: null,
    cStatementId: null,
    cDocumentsignId: null,
    cCostCategoryId: null,
    cDocumentRecordId: null,
    cDocumentTypeId: null
}


import React, { Component } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import R from 'assets/R'
import i18n from 'assets/languages/i18n'
import { connect } from 'react-redux'
import { setTypeOfIcon } from 'actions/invoice'
import _ from 'lodash'
import apiInvoice from 'apis/Functions/invoice'
import { HEIGHTXD } from '../../../../../config'
import GeneralInfo from './Item/GeneralInfo'
import MoneyInfo from './Item/MoneyInfo'
import OtherInfo from './Item/OtherInfo'
import global from '../../../global'
import dataDetail from './dataDetal'

class DetailedInvoice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reRender: false
    }

    this.dataItem = {
      defaultSortField: 'name',
      isSize2: true,
      columnnGroup: null,
      columnSums: null,
      actionGroup: null,
      valueGroup: null,
      currencyColumn: null,
      listAction: null,
      currentActionIndex: null,
      totalRecord: null,
      totalAfter: null,
      totalRecordSum: null,
      adWindowId: null,
      isSumObject: false,
      filterFields: null,
      filterClau: null,
      sortField: null,
      sortDir: null,
      sqlWhere: null,
      returnMessage: null,
      roleCode: null,
      start: null,
      maxResult: null,
      isDisplayBold: null,
      sbAppend: null,
      lstResult: null,
      strAppend: null,
      baseAdUserId: null,
      accountingDate: null,
      accountingDateFrom: null,
      accountingDateTo: null,
      dataSource: null,
      originalInvoiceLineId: null,
      originalInvoiceLineName: null,
      finalAccountDrId: null,
      finalAccountDrName: null,
      finalTaxAccountId: null,
      finalTaxAccountName: null,
      interorgReceivableAccountId: null,
      interorgReceivableAccountName: null,
      interorgPayableAccountId: null,
      interorgPayableAccountName: null,
      interorgTypeId: null,
      interorgTypeName: null,
      planWillFinish: null,
      notRequestAmount: null,
      paymentMethod: null,
      notRequestAmountTmp: null,
      distributionProductId: null,
      distributionProductName: null,
      distributionRef: null,
      amtSourcePerMonth: null,
      amtAcctPerMonth: null,
      distributionDescription: null,
      distributionMonth: null,
      accountCrId: null,
      accountCrName: null,
      isNonDeductibleExp: null,
      nonDeductibleExpReasonId: null,
      nonDeductibleExpReasonName: null,
      requestNonDeductibleAmt: null,
      approveNonDeductibleAmt: null,
      fromInterOrgTypeId: null,
      fromInterOrgTypeName: null,
      fromReceivableAccountId: null,
      fromReceivableAccountName: null,
      fromPayableAccountId: null,
      fromPayableAccountName: null,
      governanceOrgId: null,
      governanceOrgName: null,
      amount: null,
      isFct: null,
      fctOrgId: null,
      fctOrgName: null,
      fctPeriodId: null,
      fctPeriodName: null,
      fctContractId: null,
      fctContractName: null,
      fctPartnerId: null,
      fctPartnerName: null,
      isFctDeduction: null,
      vatRate: null,
      citRate: null,
      fctUpdatedby: null,
      fctUpdatedbyName: null,
      fctUpdated: null,
      fctUpdatedFrom: null,
      fctUpdatedTo: null,
      apInvoiceLineId: null,
      adOrgId: null,
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
      isactive: null,
      isDeleted: null,
      apInvoiceId: null,
      apInvoiceName: null,
      description: null,
      qty: null,
      price: null,
      taxAccountId: null,
      taxAccountName: null,
      requestBeforeTaxAmount: null,
      requestTaxPrice: null,
      requestTaxAmount: null,
      requestAmount: null,
      poRqBeforeTaxAmount: null,
      poRqTaxPrice: null,
      poRqTaxAmount: null,
      poRqAmount: null,
      approvedBeforeTaxAmount: null,
      approvedTaxPrice: null,
      approvedTaxAmount: null,
      approvedAmount: null,
      poApBeforeTaxAmount: null,
      poApTaxPrice: null,
      poApTaxAmount: null,
      poApAmount: null,
      fromDate: null,
      fromDateFrom: null,
      fromDateTo: null,
      toDate: null,
      toDateFrom: null,
      toDateTo: null,
      fromNumber: null,
      toNumber: null,
      accountDrId: null,
      accountDrName: null,
      distributionAccountId: null,
      distributionAccountName: null,
      distributionFromDate: null,
      distributionFromDateFrom: null,
      distributionFromDateTo: null,
      distributionToDate: null,
      distributionToDateFrom: null,
      distributionToDateTo: null,
      distributionDay: null,
      keyheader: null,
      keyline: null,
      isSync: null,
      transDate: null,
      transDateFrom: null,
      transDateTo: null,
      name: null,
      value: null,
      searchKey: null,
      logInfo: null,
      fwmodelId: null,
      isSize: true,
      cTaxCategoryName: null,
      cContractName: null,
      cTaxName: null,
      cChannelName: null,
      cPaymentPlanId: null,
      cAdvanceRequestLineId: null,
      cPeriodId: null,
      cPeriodName: null,
      cSiteCodeInfoId: null,
      cSiteCodeInfoName: null,
      cCostCenterId: null,
      cAccountCrId: null,
      cActivitySectorId: null,
      tApproveStatus: null,
      tAdjustingEntryId: null,
      cChannelId: null,
      aAssetId: null,
      mProductId: null,
      cUomId: null,
      cTaxCategoryId: null,
      cContractId: null,
      cProjectId: null,
      cSalaryId: null,
      cPayrollId: null,
      cConstructionId: null,
      cConstructionPhaseId: null,
      cStatementLineId: null,
      mInWarehouseId: null,
      cBpartnerDrId: null,
      cBpartnerCrId: null,
      cBudgetId: null,
      cCostTypeId: null,
      cSalesRegionId: null,
      cTaxId: null,
      cSiteCodeTypeId: null,
      cServiceId: null,
      cActivityId: null,
      cPaymentPlanName: null,
      cAdvanceRequestLineName: null,
      cActivitySectorName: null,
      tAdjustingEntryName: null,
      aAssetName: null,
      mProductName: null,
      cUomName: null,
      cProjectName: null,
      cConstructionName: null,
      cConstructionPhaseName: null,
      cStatementLineName: null,
      mInWarehouseName: null,
      cBpartnerDrName: null,
      cBpartnerCrName: null,
      cSalesRegionName: null,
      cSiteCodeTypeName: null,
      cServiceName: null,
      cCostCenterName: null,
      cAccountCrName: null,
      cSalaryName: null,
      cPayrollName: null,
      cBudgetName: null,
      cCostTypeName: null,
      cActivityName: null
    }

    global.goBackToListDetailInvoice = this._goBackToListDetailInvoice.bind(this)
  }

  menu = [
    {
      name: i18n.t('SAVE_T'),
      iconName: R.images.iconSave
    },
    {
      name: i18n.t('ATTACK_T'),
      iconName: R.images.iconAttack
    },
  ]

  _goBackToListDetailInvoice=() => {
    this.props.navigation.goBack()
  }

  _onChangeBottomMenu=(index) => {}

  _reRender = () => this.setState({ reRender: !this.state.reRender })

  async componentDidMount() {
    let item = this.props.navigation.getParam('item')
    let id = item.apInvoiceLineId ? item.apInvoiceLineId : 707662
    let resDes = await apiInvoice.getDetailDetailInvoice({ id })
    if (resDes.data) {
      this.dataItem = resDes.data
      this._reRender()
    }
  }

  componentWillUnmount() {
    this.props.setTypeOfIcon(0)
  }

  render() {
    return (
      <View style={styles.conmponent}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginTop: HEIGHTXD(24) }}>
            <GeneralInfo
              product={!_.isNull(this.dataItem.mProductName) ? this.dataItem.mProductName : i18n.t('NULL_L')}
              contract={!_.isNull(this.dataItem.cContractName) ? this.dataItem.cContractName : i18n.t('NULL_L')}
              chanel={!_.isNull(this.dataItem.cChannelName) ? this.dataItem.cChannelName : i18n.t('NULL_L')}
              managerUnit={!_.isNull(this.dataItem.governanceOrgName) ? this.dataItem.governanceOrgName : i18n.t('NULL_L')}
              total={!_.isNull(this.dataItem.qty) ? this.dataItem.qty : i18n.t('NULL_L')}
              price={!_.isNull(this.dataItem.price) ? this.dataItem.price : i18n.t('NULL_L')}
              cUomId={!_.isNull(this.dataItem.cUomName) ? this.dataItem.cUomName : i18n.t('NULL_L')}
              cStatementLineName={!_.isNull(this.dataItem.cStatementLineName) ? this.dataItem.cStatementLineName : i18n.t('NULL_L')}
              taxId={!_.isNull(this.dataItem.cTaxCategoryName) ? this.dataItem.cTaxCategoryName : i18n.t('NULL_L')}
              description={!_.isNull(this.dataItem.description) ? this.dataItem.description : i18n.t('NULL_L')}
            />
          </View>

          <View style={{ marginTop: HEIGHTXD(24) }}>
            <MoneyInfo
              requestBeforeTaxAmount={!_.isNull(this.dataItem.requestBeforeTaxAmount) ? this.dataItem.requestBeforeTaxAmount : i18n.t('NULL_L')}
              requestTaxAmount={!_.isNull(this.dataItem.requestTaxAmount) ? this.dataItem.requestTaxAmount : i18n.t('NULL_L')}
              requestAmount={!_.isNull(this.dataItem.requestAmount) ? this.dataItem.requestAmount : i18n.t('NULL_L')}
              approvedBeforeTaxAmount={!_.isNull(this.dataItem.approvedBeforeTaxAmount) ? this.dataItem.approvedBeforeTaxAmount : i18n.t('NULL_L')}
              approvedTaxAmount={!_.isNull(this.dataItem.approvedTaxAmount) ? this.dataItem.approvedTaxAmount : i18n.t('NULL_L')}
              approvedAmount={!_.isNull(this.dataItem.approvedAmount) ? this.dataItem.approvedAmount : i18n.t('NULL_L')}
            />
          </View>
          <View style={{ marginTop: HEIGHTXD(24) }}>
            <OtherInfo
              cCostCenterName={!_.isNull(this.dataItem.cCostCenterName) ? this.dataItem.cCostCenterName : i18n.t('NULL_L')}
              cBudgetName={!_.isNull(this.dataItem.cBudgetName) ? this.dataItem.cBudgetName : i18n.t('NULL_L')}
              budget={!_.isNull(this.dataItem.cBudgetName) ? this.dataItem.cBudgetName : i18n.t('NULL_L')}
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}
function mapStateToProps(state) {
  return {

  }
}
export default connect(mapStateToProps, { setTypeOfIcon })(DetailedInvoice)
const styles = StyleSheet.create({
  conmponent: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51,
  }
})

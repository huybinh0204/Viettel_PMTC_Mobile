import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, StatusBar, BackHandler } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import R from '../../../../assets/R';
import { HEIGHTXD, WIDTHXD } from '../../../../config/Function';
import ItemGeneralInfo from './ItemViews/ItemGeneralInfo';
import ItemBeneficiary from './ItemViews/ItemBeneficiary';
import ItemOtherInfo from './ItemViews/ItemOtherInfo';
import ItemAccounting from './ItemViews/ItemAccountingInfo';
import { showAlert, TYPE } from '../../../../common/DropdownAlert';
import AdvanceRequest from '../../../../apis/Functions/advanceRequest';
import { updateRequestAmount, updateListAdvanceRequest, saveBeforeExit } from '../../../../actions/advanceRequest'
import global from '../../global'
import { showLoading, hideLoading } from '../../../../common/Loading/LoadingModal'
import Confirm from '../../../../common/ModalConfirm/Confirm';


class DetailInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 1,
      isCreate: true,
      item: {},
      oldRequestAmount: 0,
      adOrgId: null,
      adUserId: null,
      reRender: false,
      saveBeforeExit: false,
      isCancel: false,
      detail: {
        adOrgId: null,
        clearingDueDate: moment(new Date()).format('DD/MM/YYYY'),
        clearingDueDateFrom: null,
        clearingDueDateTo: null,
        bankreceivercode: null,
        citadCode: null,
        interorgReceivableAccountId: null,
        interorgPayableAccountId: null,
        swiftCode: null,
        isOutOfList: null,
        paymentBankAccountId: null,
        isFromVhr: null,
        apInvoiceLineId: null,
        requestBeforePitAmt: null,
        approveBeforePitAmt: null,
        pitAmount: null,
        serviceType: null,
        adOrgReceiveId: null,
        isFinalPayment: null,
        adClientId: null,
        created: null,
        createdby: null,
        updated: new Date().getTime(),
        updatedby: null,
        isactive: 'Y',
        isDeleted: 'N',
        apInvoiceGroupId: null,
        bank: null,
        invoiceNo: null,
        notPaymentAmount: null,
        note: null,
        apInvoiceId: null,
        clearingAmount: null,
        fwmodelId: 0,
        isSize: true,
        cAdvanceRequestLineId: 0,
        cPaymentPlanId: null,
        cSalesRegionId: null,
        cAdvanceRequestId: null,
        cPaymentPlanLineId: null,
        cBankAccountId: null,
        cPayrollId: null,
        cCashFlowId: null,
        cStatementId: null,
        description: null,
        requestAmount: 0,
      },
    }
    global.goBackToListDetail = this.goBackToListDetail.bind(this)
    this._backHandle = this._backHandle.bind(this)
  }

  _backHandle = () => {
    let result = false
    if (this.props.savedBeforeExit) {
      this.ConfirmPopup.setModalVisible(true)
      result = true
      this.setState({ isCancel: true })
    }
    return result
  }

  goBackToListDetail = () => {
    this.props.navigation.goBack()
  }

  componentDidMount() {
    const { dataDetail, adOrgId, adUserId } = this.props.navigation.state.params
    if (!_.isEmpty(dataDetail)) {
      this.setState({ detail: dataDetail, isCreate: false, oldRequestAmount: dataDetail.requestAmount, adOrgId, adUserId })
    } else {
      let { detail, oldRequestAmount } = this.state
      oldRequestAmount = this.props.requestAmount
      this.setState({ oldRequestAmount, detail, adUserId, adOrgId })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPressMenu !== this.props.isPressMenu && nextProps.icPressMenu !== -1 && nextProps.tabActive === this.state.index) {
      this._callApi()
    }
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandle)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandle)
    this.props.navigation.state.params.updateItem()
    this.props.returnData({ activeMenu: global.HIDE_BOTTOM_MENU, indexIcon: global.SHOW_ICON_SEARCHKEY, toDetail: false })
  }

  _callApi = () => {
    if (this.state.isCreate) {
      this._createLineDetail()
    } else {
      this._updateLineDetail()
    }
  }

  _showAlertWarning = (message) => {
    showAlert(TYPE.WARN, 'Thông báo', message)
  }

  _validateCreateLineDetail = () => {
    const error = [];
    _.forEach(['description', 'requestAmount', 'cStatementId', 'cBpartnerId', 'bankownername', 'accountNo', 'cBankId'], item => {
      if (!this.state.detail.description) {
        this._showAlertWarning('Vui lòng nhập nội dung thông tin chi tiết')
        error.push('description')
      }
      if (!this.state.detail.requestAmount) {
        this._showAlertWarning('Vui lòng nhập số tiền đề nghị')
        error.push('requestAmount')
      }
      if (!this.state.detail.cStatementId) {
        this._showAlertWarning('Vui lòng chọn tờ trình')
        error.push('cStatementId')
      }
      if (!this.state.detail.cBpartnerId) {
        this._showAlertWarning('Vui lòng chọn đối tượng công nợ')
        error.push('cBpartnerId')
      }
      if (!this.state.detail.bankownername) {
        this._showAlertWarning('Vui lòng điền nhập tên chủ tài khoản')
        error.push('bankownername')
      }
      if (!this.state.detail.accountNo) {
        this._showAlertWarning('Vui lòng điền nhập số tài khoản')
        error.push('accountNo')
      }
      if (!this.state.detail.cBankId) {
        this._showAlertWarning('Vui lòng điền chọn ngân hàng')
        error.push('cBankId')
      }
    })
    return error;
  }

  _createLineDetail = async () => {
    showLoading()
    if (this._validateCreateLineDetail().length > 0) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng điền đầy đủ thông tin')
      hideLoading()
    } else {
      try {
        let { detail } = this.state
        detail.cAdvanceRequestId = this.props.id;
        detail.adOrgId = this.state.adOrgId
        const response = await AdvanceRequest.createDetailLineAdvanceRequest(detail);
        if (response && response.status === 200) {
          hideLoading()
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Tạo mới thông tin chi tiết thành công')
          this.props.updateRequestAmount(this.props.requestAmount + response.data.requestAmount)
          this.props.updateListAdvanceRequest()
          this.props.saveBeforeExit(false)
          this.goBackToListDetail()
        } else {
          showAlert(TYPE.ERROR, 'Thông báo', 'Tạo mới thông tin chi tiết thất bại')
          hideLoading()
        }
      } catch (err) {
        showAlert(TYPE.ERROR, 'Thông báo', 'Tạo mới thông tin chi tiết thất bại')
        hideLoading()
      }
    }
  }

  _updateLineDetail = async () => {
    showLoading()
    if (this._validateCreateLineDetail().length > 0) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng điền đầy đủ thông tin')
      hideLoading()
    } else {
      try {
        let { detail, oldRequestAmount } = this.state;
        detail.updated = new Date().getTime()
        detail.adOrgId = this.state.adOrgId
        const response = await AdvanceRequest.updateDetailLineAdvanceRequest(detail);
        if (response && response.status === 200) {
          hideLoading()
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Cập nhật thông tin chi tiết thành công')
          if (response.data.requestAmount > oldRequestAmount) {
            this.props.updateRequestAmount(this.props.requestAmount + (response.data.requestAmount - oldRequestAmount))
            this.props.updateListAdvanceRequest()
          } else if (response.data.requestAmount < oldRequestAmount) {
            this.props.updateRequestAmount(this.props.requestAmount - (oldRequestAmount - response.data.requestAmount))
          }
          this.props.saveBeforeExit(false)
          this.goBackToListDetail()
        } else {
          showAlert(TYPE.ERROR, 'Thông báo', 'Cập nhật thông tin chi tiết thất bại')
          hideLoading()
        }
      } catch (err) {
        showAlert(TYPE.ERROR, 'Thông báo', 'Cập nhật thông tin chi tiết thất bại')
        hideLoading()
      }
    }
  }

  _onChangeDetail = (itemBody) => {
    let { detail } = this.state;
    let check = this.state.saveBeforeExit
    if (!this.props.savedBeforeExit) {
      this.props.saveBeforeExit(true)
      check = true
    }
    detail[itemBody.key] = itemBody.value
    this.setState({ detail, saveBeforeExit: check })
  }

  render() {
    const { adOrgId, cDepartmentId, docstatus, isFinish, transDate, documentNo } = this.props
    return (
      <View style={styles.container}>
        <ScrollView
          style={[{ flex: 1 }, { marginBottom: HEIGHTXD(200) }]}
          showsVerticalScrollIndicator={false}
        >
          <StatusBar backgroundColor={R.colors.colorMain} />
          <Confirm
            ref={ref => { this.ConfirmPopup = ref }}
            title="Bạn có muốn lưu bản ghi này trước khi thoát không ?"
            titleLeft="HUỶ"
            titleRight="ĐỒNG Ý"
            onPressLeft={() => this.props.saveBeforeExit(false)}
            onPressRight={() => this._callApi()}
          />
          <View style={{ marginBottom: HEIGHTXD(12), marginTop: HEIGHTXD(24) }}>
            <ItemGeneralInfo
              enableEdit={this.props.enableEdit}
              showDeatiail={this.props.showDeatiail}
              data={this.state.detail}
              content={this.state.content}
              documentNo={documentNo}
              docstatus={docstatus}
              isFinish={isFinish}
              transDate={transDate}
              cDepartmentId={cDepartmentId}
              adOrgId={adOrgId}
              onChangeValue={item => this._onChangeDetail(item)}
            />
          </View>
          <View style={{ marginVertical: HEIGHTXD(12) }}>
            <ItemBeneficiary
              enableEdit={this.props.enableEdit}
              showDeatiail={this.props.showDeatiail}
              data={this.state.detail}
              cBpartnerId={this.props.cBpartnerId}
              onChangeValue={item => this._onChangeDetail(item)}
            />
          </View>
          <View style={{ marginVertical: HEIGHTXD(12) }}>
            <ItemAccounting
              enableEdit={this.props.enableEdit}
              data={this.state.detail}
              onChangeValue={item => this._onChangeDetail(item)}
            />
          </View>
          <View style={{ marginVertical: HEIGHTXD(12) }}>
            <ItemOtherInfo
              enableEdit={this.props.enableEdit}
              showDeatiail={this.props.showDeatiail}
              data={this.state.detail}
              onChangeValue={item => this._onChangeDetail(item)}
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    requestAmount: state.advanceRequestReducer.requestAmount,
    savedBeforeExit: state.advanceRequestReducer.savedBeforeExit,
    enableEdit: state.advanceRequestReducer.enableEdit,
  }
}

export default connect(mapStateToProps, { updateRequestAmount, updateListAdvanceRequest, saveBeforeExit })(DetailInfo)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: R.colors.blueGrey51,
  },
  button: {
    marginVertical: HEIGHTXD(48),
    width: WIDTHXD(137),
    height: WIDTHXD(137),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: WIDTHXD(137),
    elevation: 5,
    backgroundColor: R.colors.white
  }
})

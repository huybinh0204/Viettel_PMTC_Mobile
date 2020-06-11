import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, StatusBar, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import { connect } from 'react-redux'
import moment from 'moment'
import R from '../../../../assets/R';
import { HEIGHTXD, WIDTHXD } from '../../../../config/Function';
import ItemGeneralInfo from './ItemViews/ItemGeneralInfo';
import ItemMoneyInfo from './ItemViews/ItemMoneyInfo';
import ItemVOffice from './ItemViews/ItemVoffice';
import ItemStatus from './ItemViews/ItemStatus';
import AdvanceRequest from '../../../../apis/Functions/advanceRequest'
import { showAlert, TYPE } from '../../../../common/DropdownAlert';
import Confirm from '../../../../common/ModalConfirm/Confirm';
import { updateListAdvanceRequest, showAllField, updateIconEye, saveBeforeExit } from '../../../../actions/advanceRequest'
import Navigation from '../../../../routers/NavigationService'
import { showLoading, hideLoading } from '../../../../common/Loading/LoadingModal'
import global from '../../global'


class GeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      listCurrency: [],
      isCreate: false,
      pressNextToDetail: false,
      isEdit: false,
      isUpdate: false,
      showAllField: true,
      saveBeforeExit: false,
      isCancel: false,
      objExpanded: { expandedGeneral: true, expandedMoney: true, expandedStatus: true, expandedVOffice: true },
      body: {
        adOrgId: this.props.adOrgId,
        createdby: this.props.adUserId,
        updatedby: this.props.adUserId,
        cDepartmentId: this.props.cDepartmentId,
        approvedAmount: null,
        isCompleteItSort: 'N',
        description: '',
        cCostCategoryId: null,
        paymentMethod: null,
        requestType: null,
        requestAmount: null,
        paymentOrgId: this.props.adOrgId,
        paymentOrgName: this.props.adOrgName,
        isactive: 'Y',
        documentNo: '',
        transDate: moment(new Date()).format('DD/MM/YYYY'),
        currencyRate: 0,
        fwmodelId: null,
        isSize: true,
        cCurrencyId: null,
        cStatementId: null,
        cBpartnerName: null,
        cCurrencyName: null,
        cBpartnerId: null,
        cAdvanceRequestId: 0,
        cDocumentTypeId: 2,
        // cDocumentsignId: this.props.idVoffice || 0,
        cPayrollId: null,
        cCashFlowId: null,
        cSalaryId: null,
        cCostCategoryName: null,
        cSalaryName: null,
        cPayrollName: null,
        cCashFlowName: null,
        updated: new Date().getTime(),
      },
    };
    this._backHandle = this._backHandle.bind(this)
    global.UPDATE_ADVANCE_REQUEST = this._updateGeneralInfo.bind(this, false)
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

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandle)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandle)
  }

  _callApi = async () => {
    if (this.state.isCreate === true) {
      this._createGeneralInfo()
    } else {
      this._updateGeneralInfo(true)
    }
  }

  _validateData = () => {
    const error = []
    _.forEach(['paymentOrgId', 'paymentMethod', 'currencyRate', 'cCurrencyId'], item => {
      if (!this.state.body.paymentMethod) {
        showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng chọn hình thức chi trả')
        error.push(item)
      } else if (!this.state.body.paymentOrgId) {
        showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng chọn đơn vị chi trả')
        error.push(item)
      } else if (!this.state.body.cCurrencyId) {
        showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng chọn đơn vị tiền tệ')
        error.push(item)
      } else if (!this.state.body.currencyRate) {
        showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng nhập tỷ giá')
        error.push(item)
      }
    })
    return error
  }

  _createGeneralInfo = async () => {
    if (!this._validateData().length) {
      try {
        showLoading()
        const { body, isCancel } = this.state;
        body.approvedAmount = body.requestAmount
        const response = await AdvanceRequest.addNewAdvanceRequest(body)
        if (response && response.status === 200) {
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Tạo mới đề nghị thanh toán thành công')
          global.CB_PARTNER_ID = body.cBpartnerId
          global.CB_PARTNER_NAME = body.cBpartnerName
          if (isCancel) Navigation.pop()
          this.props.setId(response.data.cAdvanceRequestId)
          this.props.updateListAdvanceRequest()
          this.props.saveBeforeExit(false)
          this.setState({ isCreate: false, body: response.data, isUpdate: true, isEdit: false, saveBeforeExit: false }, () => {
          })
          this.props.onCreateSuccess()
        } else {
          showAlert(TYPE.ERROR, 'Thông báo', 'Tạo mới đề nghị thanh toán thất bại')
        }
      } catch (err) {
        showAlert(TYPE.ERROR, 'Thông báo', 'Tạo mới đề nghị thanh toán thất bại')
      } finally {
        hideLoading()
      }
    }
  }

  _updateGeneralInfo = async (bool) => {
    if (!this._validateData().length) {
      try {
        showLoading()
        let { body, isCancel } = this.state;
        body.updated = new Date().getTime()
        body.approvedAmount = body.requestAmount
        if (this.props.idVoffice) body.cDocumentsignId = this.props.idVoffice
        if (this.props.isCoVoffice === true) body.isCompleteItSort = 'Y'
        else body.isCompleteItSort = 'N'
        const response = await AdvanceRequest.updateAdvanceRequest(body)
        console.log('body update---222 22222', body)
        console.log('RESPONSE UPDATE 22222222-------', response)
        if (response && response.status === 200) {
          global.CB_PARTNER_ID = body.cBpartnerId
          global.CB_PARTNER_NAME = body.cBpartnerName
          this.props.updateListAdvanceRequest()
          this.props.saveBeforeExit(false)
          if (bool) showAlert(TYPE.SUCCESS, 'Thông báo', 'Cập nhât đề nghị thanh toán thành công')
          if (isCancel) Navigation.pop()
          this.setState({ isUpdate: true, isEdit: false, saveBeforeExit: false }, () => {
          })
        } else {
          if (bool) showAlert(TYPE.ERROR, 'Thông báo', 'Cập nhật đề nghị thanh toán thất bại')
        }
      } catch (err) {
        if (bool) showAlert(TYPE.ERROR, 'Thông báo', 'Cập nhật đề nghị thanh toán thất bại')
      } finally {
        hideLoading()
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPressMenu !== this.props.isPressMenu && nextProps.icPressMenu !== -1 && nextProps.tabActive === this.state.index) {
      this._callApi()
    }
    if (nextProps.isCreate !== this.props.isCreate) {
      this.setState({ isCreate: nextProps.isCreate })
    }
    if (!_.isEmpty(nextProps.value) || (nextProps.value !== this.props.value)) {
      this.setState({ body: { ...this.state.body, ...nextProps.value } })
    }
    if ((nextProps.showAllFieldGroup !== this.props.showAllFieldGroup) && (nextProps.tabActive === this.state.index)) {
      this.setState({ showAllField: nextProps.showAllFieldGroup })
    }
    if (nextProps.requestAmount !== this.props.requestAmount) {
      let { body } = this.state
      body.requestAmount = nextProps.requestAmount
      this.setState({ body }, () => {
      })
    }
  }

  updateExpanded = (bool, index) => {
    const { objExpanded } = this.state
    switch (index) {
      case 0:
        objExpanded.expandedGeneral = bool
        break
      case 1:
        objExpanded.expandedMoney = bool
        break
      case 2:
        objExpanded.expandedVOffice = bool
        break
      default:
        objExpanded.expandedStatus = bool
        break
    }
    this.setState({ objExpanded }, () => {
      this.props.updateIconEye()
    })
  }

  componentDidMount() {
    this._getListCurrency()
  }

  _getListCurrency = async () => {
    const body = { isSize: true, name: '' }
    try {
      const response = await AdvanceRequest.getListCurrency(body);
      if (response && response.status === 200) {
        const { listCurrency } = this.state
        _.forEach(response.data, (item) => {
          const itemCurrency = { name: item.value, fwmodelId: item.fwmodelId }
          listCurrency.push(itemCurrency)
        })
        listCurrency.pop()
        this.setState({ listCurrency })
      }
    } catch (err) {
    }
  }

  _onChangeValue = (item) => {
    let newBody = { ...this.state.body };
    let check = this.state.saveBeforeExit
    if (!this.props.savedBeforeExit) {
      this.props.saveBeforeExit(true)
      check = true
    }
    newBody[item.key] = item.value;
    this.setState({ body: newBody, isEdit: false, saveBeforeExit: check }, () => {
      this.props.updateState(newBody)
    })
  }

  _onPressAlert = () => {
    this._callApi()
  }

  render() {
    return (
      <ScrollView
        style={[styles.container, { marginBottom: HEIGHTXD(200) }]}
        showsVerticalScrollIndicator={false}
      >
        <Confirm
          ref={ref => { this.ConfirmPopup = ref }}
          title="Bạn có muốn lưu bản ghi này không ?"
          titleLeft="HUỶ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => { }}
          onPressRight={() => this._onPressAlert()}
        />
        <StatusBar backgroundColor={R.colors.colorMain} />
        <View style={{ marginBottom: HEIGHTXD(12), marginTop: HEIGHTXD(24) }}>
          <ItemGeneralInfo
            value={this.state.body}
            onChangeValue={this._onChangeValue}
            showAllField={this.state.showAllField}
            updateExpanded={this.updateExpanded}
            enableEdit={this.props.enableEdit}
          />
        </View>
        <View style={{ marginVertical: HEIGHTXD(12) }}>
          <ItemMoneyInfo
            value={this.state.body}
            currency={this.state.listCurrency}
            onChangeValue={this._onChangeValue}
            showAllField={this.state.showAllField}
            updateExpanded={this.updateExpanded}
            enableEdit={this.props.enableEdit}
          />
        </View>
        {(this.state.isCreate === false) && (this.state.body.cAdvanceRequestId !== 0)
          ? <View>
            <View style={{ marginVertical: HEIGHTXD(12) }}>
              <ItemVOffice
                value={this.state.body}
                showAllField={this.state.showAllField}
                updateExpanded={this.updateExpanded}
                enableEdit={this.props.enableEdit}
              />
            </View>
            <View style={{ marginVertical: HEIGHTXD(12) }}>
              <ItemStatus
                value={this.state.body}
                docStatus={this.props.docStatus}
                showAllField={this.state.showAllField}
                updateExpanded={this.updateExpanded}
              />
            </View>
          </View>
          : null}
        <TouchableOpacity
          onPress={() => {
            this.props.nextToLine()
          }}
          activeOpacity={1}
          style={styles.buttonNext}
        >
          <View style={styles.button}>
            <Icon name="arrow-right" size={WIDTHXD(60)} color={R.colors.colorMain} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

function mapStateToProps(state) {
  return {
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
    adOrgName: state.userReducers.userData.loggedIn.adOrgName,
    showAllFieldGroup: state.advanceRequestReducer.showAllFieldGroup,
    requestAmount: state.advanceRequestReducer.requestAmount,
    enableEdit: state.advanceRequestReducer.enableEdit,
    adUserId: state.userReducers.data.adUserId,
    savedBeforeExit: state.advanceRequestReducer.savedBeforeExit,
    cDepartmentId: state.userReducers.userData.loggedIn.adUserDepartmentId,
    isCoVoffice: state.advanceRequestReducer.coVoffice,
    idVoffice: state.advanceRequestReducer.idVoffice,
  }
}

export default connect(mapStateToProps, { updateListAdvanceRequest, showAllField, updateIconEye, saveBeforeExit })(GeneralInfo)

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  buttonNext: {
    alignItems: 'flex-end',
    marginRight: WIDTHXD(86),
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    elevation: 2,
    shadowOpacity: 0.3
  }
})

import React, { Component } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import R from 'assets/R'
import i18n from 'assets/languages/i18n'
import { connect } from 'react-redux'
import { setTypeOfIcon, fetchListTypeTax } from 'actions/invoice'
import apiInvoice from 'apis/Functions/invoice'
import { showAlert, TYPE } from 'common/DropdownAlert'
import _ from 'lodash'
import Confirm from 'common/ModalConfirm/Confirm'
import { HEIGHTXD, checkFormatArray } from '../../../../../config'
import GeneralInfo from './Item/GeneralInfo'
import MoneyInfo from './Item/MoneyInfo'
import OtherInfo from './Item/OtherInfo'
import { dataDetailedInvoice } from './dataDetailedInvoice'
import BottomMenu from '../../../../VOffice/CreateVOffice/GeneralInfor/ItemViews/BottomMenu';
import global from '../../../global';


class DetailedInvoice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reRender: false,
      titlePopupCheckPrice: ''
    }
    this.dataDetailedInvoice = JSON.parse(JSON.stringify(dataDetailedInvoice))
    global.goBackToListDetailInvoice = this._goBackToListDetailInvoice.bind(this)
  }

  setDetailedInvoice = (invoice) => {

    // calculator total again
    this.dataDetailedInvoice.requestAmount = parseFloat(invoice.requestBeforeTaxAmount) + parseFloat(invoice.requestTaxAmount);
    // by default, aproved value will equa request value
    this.dataDetailedInvoice.approvedBeforeTaxAmount = parseFloat(invoice.requestBeforeTaxAmount);
    this.dataDetailedInvoice.approvedTaxAmount = parseFloat(invoice.requestTaxAmount);
    this.dataDetailedInvoice.approvedAmount = parseFloat(invoice.requestAmount);

    this.dataDetailedInvoice = invoice;

    // console.log('update invoice:', 'requestBeforeTaxAmount', invoice.requestBeforeTaxAmount, 'requestTaxAmount', invoice.requestTaxAmount)
    this._reRender();
  }

  menu = [
    {
      name: i18n.t('SAVE_T'),
      iconName: R.images.invoice.save,
      enable: true,
    },
    {
      name: i18n.t('ATTACK_T'),
      iconName: R.images.invoice.attach,
      enable: true
    },
  ]

  _goBackToListDetailInvoice = () => {
    this.props.navigation.goBack()
  }

  _onSuccess = () => { }

  _checkInformation = () => {
    let { mProductId, description, qty, price, cCostCenterId, cContractId, cUomId } = this.dataDetailedInvoice
    let arrayTitleRequire = ['Mặt hàng', 'Mô tả', 'Số lượng', 'Đơn giá', 'Trung tâm chi phí', 'Hợp đồng', 'Đơn vị tính']
    let arrayRequire = [mProductId, description, qty, price, cCostCenterId, cContractId, cUomId]
    let isCorrect = checkFormatArray(arrayRequire)
    if (isCorrect === true) {
      if (this.props.screenProps.invoiceInfo.serviceType === 'EW') {
        this._checkPrice()
      } else {
        this._onCompleteForm()
      }
    } else {
      showAlert(TYPE.WARN, 'Thông báo', `Vui lòng điền ${arrayTitleRequire[isCorrect] ? arrayTitleRequire[isCorrect] : 'đầy đủ thông tin'}`)
    }
  }

  _checkPrice = async () => {
    let body = {
      price: this.dataDetailedInvoice.price,
      mProductId: this.dataDetailedInvoice.mProductId,
      apInvoiceId: this.props.navigation.getParam('idInvoice'),
    }
    console.log(body)

    const respponse = await apiInvoice.checkPriceInvoice(body)
    console.log(respponse)
    if (respponse && respponse.status === 200) {
      if (respponse.data) {
        this.setState({titlePopupCheckPrice: `Đơn giá không nằm trong khung giá từ ${respponse.data.minPrice} đến ${respponse.data.maxPrice}`}, () => {
          this.ConfirmPricePopup.setModalVisible(true)
        })
      } else {
        this._onCompleteForm()
      }
    }

  }

  _onCompleteForm = () => {
    const isEdit = this.props.navigation.getParam('isEdit')
    try {
      this.setState({ showLoadingCtn: true }, async () => {
        const response = isEdit ? await apiInvoice.editDetailInvoice(this.dataDetailedInvoice) : await apiInvoice.createDetailInvoice(this.dataDetailedInvoice)
        if (response && response.status === 200) {
          showAlert(TYPE.SUCCESS, 'Thông báo', isEdit ? 'Sửa chi tiết hóa đơn thành công' : 'Tạo chi tiết hóa đơn thành công');
          this._onSuccess();
          this.props.navigation.goBack();
        } else {
          showAlert(TYPE.ERROR, 'Thông báo', isEdit ? 'Sửa chi tiết hóa đơn thất bại' : 'Tạo chi tiết hóa đơn thất bại');
        }
        this._loadData()
        this.props.navigation.state.params.refreshData()
        this.setState({ showLoadingCtn: false })
      })
    } catch (err) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Tạo chi tiết hóa đơn thất bại')
    }
  }

  _onChangeBottomMenu = (index) => {
    switch (index) {
      case 0: {
        // this.ConfirmPopup.setModalVisible(true); BA Duc bao xoa
        this._checkInformation();
        break
      }
      case 1:
        global.setTabIndex(2);
        setTimeout(() => {
          global.showAttachModal && global.showAttachModal();
        }, 700);
        break;
      default: {
        break
      }
    }
  }

  _reRender = () => {
    this.setState({ reRender: !this.state.reRender })
  }

  componentDidMount() {
    this._loadData()
  }

  _loadData = async () => {
    const { listTypeTax } = this.props
    if (this.props.navigation.getParam('idInvoice')) {
      this.dataDetailedInvoice.apInvoiceId = this.props.navigation.getParam('idInvoice')
    }
    const isEdit = this.props.navigation.getParam('isEdit')
    if (isEdit) {
      let items = this.props.navigation.getParam('item')
      let id = items.apInvoiceLineId ? items.apInvoiceLineId : 707662
      let resDes = await apiInvoice.getDetailDetailInvoice({ id })
      if (resDes.data) {
        this.dataDetailedInvoice = resDes.data
        if (!_.isEmpty(listTypeTax)) {
          _.forEach(listTypeTax, item => {
            if (item.taxId === resDes.data.cTaxId) {
              this.dataDetailedInvoice = { ...this.dataDetailedInvoice, tax: (item.tax !== null && item.tax) ? item.tax : 0 }
            }
          })
        }
        this._reRender()
      }
    } else {
      const invoiceInfo = this.props.screenProps.invoiceInfo
      this.dataDetailedInvoice.description = invoiceInfo.description
    }

    let body = {
      isSize: true,
      name: ''
    }
    this.props.fetchListTypeTax(body)
  }

  componentWillUnmount() {
    this.props.setTypeOfIcon(0)
  }

  render() {
    const invoiceInfo = this.props.screenProps.invoiceInfo

    return (
      <View style={styles.conmponent}>
        <ScrollView
          style={{ flex: 1, marginBottom: HEIGHTXD(200) }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginTop: HEIGHTXD(30) }}>
            <GeneralInfo
              listTypeTax={this.props.listTypeTax}
              self={this}
              adOrgId={this.props.adOrgId}
              invoiceInfo={invoiceInfo}
            />
          </View>

          <View style={{ marginTop: HEIGHTXD(30) }}>
            <MoneyInfo self={this} itemMoney={this.itemMoney} />
          </View>
          <View style={{ marginTop: HEIGHTXD(30) }}>
            <OtherInfo self={this}
              adOrgId={this.props.adOrgId}
              departmentId={this.props.adUserDepartmentId} />
          </View>
        </ScrollView>
        <BottomMenu
          menu={this.menu}
          onChange={this._onChangeBottomMenu}
          activeIndex={this.state.indexBottom}
        />
        <Confirm
          ref={ref => { this.ConfirmPopup = ref }}
          title="Bạn có muốn lưu bản ghi này không ?"
          titleLeft="HUỶ BỎ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => { }}
          onPressRight={() => {
            this.ConfirmPopup.setModalVisible(true);
            this._checkInformation()
          }}
        />

        <Confirm
          ref={ref => { this.ConfirmPricePopup = ref }}
          title={this.state.titlePopupCheckPrice}
          titleLeft="HUỶ BỎ"
          titleRight="TIẾP TỤC"
          onPressLeft={() => { }}
          onPressRight={() => {
            this.ConfirmPricePopup.setModalVisible(true);
            this._onCompleteForm()
          }}
        />
      </View>
    )
  }
}
function mapStateToProps(state) {
  return {
    listTypeTax: state.invoiceReducer.listTypeTax,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
    adUserDepartmentId: state.userReducers.userData.loggedIn.adUserDepartmentId
  }
}
export default connect(mapStateToProps, { setTypeOfIcon, fetchListTypeTax })(DetailedInvoice)
const styles = StyleSheet.create({
  conmponent: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51,
  }
})

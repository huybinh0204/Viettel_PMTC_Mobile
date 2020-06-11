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
import BottomMenu from '../../../common/BottomMenu';
import global from '../../../global';


class DetailedInvoice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reRender: false
    }
    this.dataDetailedInvoice = JSON.parse(JSON.stringify(dataDetailedInvoice))
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

  _onSuccess=() => {}

  _checkInformation=() => {
    let { mProductId, description, qty, price, cTaxId, cCostCenterId } = this.dataDetailedInvoice
    let arrayTitleRequire = ['Mặt hàng', 'Mô tả', 'Số lượng', 'Đơn giá', 'Loại thuế', 'Trung tâm chi phí']
    let arrayRequire = [mProductId, description, qty, price, cTaxId, cCostCenterId]
    let isCorrect = checkFormatArray(arrayRequire)
    if (isCorrect === true) {
      this._onCompleteForm()
    } else {
      showAlert(TYPE.WARN, 'Thông báo', `Vui lòng điền ${arrayTitleRequire[isCorrect] ? arrayTitleRequire[isCorrect] : 'đầy đủ thông tin'}`)
    }
  }

  _onCompleteForm=() => {
    const isEdit = this.props.navigation.getParam('isEdit')
    try {
      this.setState({ showLoadingCtn: true }, async () => {
        const response = isEdit ? await apiInvoice.editDetailInvoice(this.dataDetailedInvoice) : await apiInvoice.createDetailInvoice(this.dataDetailedInvoice)
        if (response && response.status === 200) {
          showAlert(TYPE.SUCCESS, 'Thông báo', isEdit ? 'Sửa chi tiết hóa đơn thành công' : 'Tạo chi tiết hóa đơn thành công');
          this._onSuccess()
        } else {
          showAlert(TYPE.ERROR, 'Thông báo', isEdit ? 'Sửa chi tiết hóa đơn thất bại' : 'Tạo chi tiết hóa đơn thất bại');
        }
        this._loadData()
        this.props.navigation.state.params.refreshData()
        // NavigationService.pop()
        this.setState({ showLoadingCtn: false })
      })
    } catch (err) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Tạo chi tiết hóa đơn thất bại')
    }
  }

  _onChangeBottomMenu=(index) => {
    switch (index) {
      case 0: {
        this.ConfirmPopup.setModalVisible(true);
        break
      }
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

  _loadData=async () => {
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
            />
          </View>

          <View style={{ marginTop: HEIGHTXD(30) }}>
            <MoneyInfo self={this} itemMoney={this.itemMoney} />
          </View>
          <View style={{ marginTop: HEIGHTXD(30) }}>
            <OtherInfo self={this} />
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
      </View>
    )
  }
}
function mapStateToProps(state) {
  return {
    listTypeTax: state.invoiceReducer.listTypeTax
  }
}
export default connect(mapStateToProps, { setTypeOfIcon, fetchListTypeTax })(DetailedInvoice)
const styles = StyleSheet.create({
  conmponent: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51,
  }
})
